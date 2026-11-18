import {setupObservatoryUI} from './observatory-ui.js';
import {bindRenderer} from './graphics.js';
import {setupUniverse} from './universe.js';
import {setupSingularity} from './singularity.js';
import {setupExpeditions} from './expeditions.js';
import {setupPrecisionViewer} from './precision-viewer.js';
import {setupWorkspace} from './workspace.js';
import {setupAnalysis} from './analysis-lab.js';
import * as THREE from './assets/three.module.js';
import {makeNebula} from './spacefx.js';
import {travelSeconds,durationLabel,clamp,journeyProgress} from './science.js';
const $ = s => document.querySelector(s);
const assets = new THREE.TextureLoader();
const textureCache = new Map();
function texture(file,linear=false) {
  if (!textureCache.has(file)) {
    const value = assets.load(`assets/${file}.jpg`);
    value.colorSpace = linear?THREE.NoColorSpace:THREE.SRGBColorSpace;
    value.anisotropy=8;
    textureCache.set(file, value);
  }
  return textureCache.get(file);
}
const vertex = `varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vPosition=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vPosition,1.);}`;
const fragment = `uniform sampler2D dayMap;uniform sampler2D nightMap;uniform sampler2D normalMap;uniform sampler2D waterMap;uniform float earth;uniform vec3 sunlight;varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
void main(){vec3 N=normalize(vNormal);if(earth>.5){vec3 dp1=dFdx(vPosition),dp2=dFdy(vPosition);vec2 duv1=dFdx(vUv),duv2=dFdy(vUv);vec3 T=normalize(dp1*duv2.y-dp2*duv1.y);vec3 B=normalize(-dp1*duv2.x+dp2*duv1.x);vec3 mapN=texture2D(normalMap,vUv).xyz*2.-1.;mapN.xy*=.48;N=normalize(mat3(T,B,N)*mapN);}
vec3 L=normalize(sunlight);float incidence=dot(N,L);float day=smoothstep(-.13,.18,incidence);vec3 surface=texture2D(dayMap,vUv).rgb;vec3 lights=texture2D(nightMap,vUv).rgb*earth;vec3 V=normalize(cameraPosition-vPosition),H=normalize(L+V);float water=texture2D(waterMap,vUv).r*earth;float shine=pow(max(dot(N,H),0.),85.)*water*1.15*max(incidence,0.);float fresnel=pow(1.-max(dot(N,V),0.),3.);vec3 color=surface*(.035+max(incidence,0.)*1.15)+lights*(1.-day)*1.6+vec3(.65,.84,1.)*shine;color+=vec3(.08,.24,.4)*fresnel*max(incidence,0.)*earth;
gl_FragColor=vec4(color,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
let ringTexture;
function rings() {
  if (!ringTexture) {
    const width=512,bytes=new Uint8Array(width*4);
    for(let i=0;i<width;i++){
      const t=i/width, band=.5+.22*Math.sin(i*.21)+.14*Math.sin(i*1.7),gap=t>.60&&t<.65;
      bytes.set([190,177,144,Math.round(gap?4:clamp(band,0,1)*210)],i*4);
    }
    ringTexture=new THREE.DataTexture(bytes,width,1,THREE.RGBAFormat);ringTexture.needsUpdate=true;
  }
  const geo=new THREE.RingGeometry(1.8,2.65,192);
  const pos=geo.attributes.position,uv=geo.attributes.uv;
  for(let i=0;i<pos.count;i++)uv.setXY(i,(Math.hypot(pos.getX(i),pos.getY(i))-1.8)/.85,.5);
  const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:ringTexture,side:THREE.DoubleSide,transparent:true,depthWrite:false,opacity:.9}));
  mesh.rotation.x=-Math.PI/2.5;mesh.rotation.y=.1;return mesh;
}
function world(p, detail=64) {
  const group=new THREE.Group();
  const uniforms={dayMap:{value:texture(p.file)},nightMap:{value:texture('earth-night')},earth:{value:p.name==='Earth'?1:0},normalMap:{value:texture('earth-normal',true)},waterMap:{value:texture('earth-specular',true)},sunlight:{value:new THREE.Vector3(-4,2.5,4)}};
  const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms,extensions:{derivatives:true}});
  const globe=new THREE.Mesh(new THREE.SphereGeometry(1.46,detail,detail/2),material);group.add(globe);
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.49,detail,detail/2),new THREE.ShaderMaterial({
    vertexShader:`varying vec3 n;varying vec3 v;varying vec3 wn;varying float inside;void main(){n=normalize(normalMatrix*normal);wn=normalize(mat3(modelMatrix)*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);vec3 origin=(modelMatrix*vec4(0.,0.,0.,1.)).xyz;float radius=length((modelMatrix*vec4(1.49,0.,0.,1.)).xyz-origin);inside=1.-step(radius,length(cameraPosition-origin));gl_Position=projectionMatrix*p;}`,
    fragmentShader:`varying vec3 n;varying vec3 v;varying vec3 wn;varying float inside;uniform vec3 color;uniform vec3 sunDirection;void main(){float mu=abs(dot(normalize(n),normalize(v))),rim=pow(1.-mu,3.);float light=dot(normalize(wn),normalize(sunDirection));vec3 blue=mix(vec3(.8,.3,.12),color,smoothstep(-.12,.22,light));float density=mix(rim*.48,.10+rim*.55,inside);gl_FragColor=vec4(blue*(.3+smoothstep(-.3,.3,light)*.7),density);}`,
    uniforms:{color:{value:new THREE.Color(p.name==='Earth'?'#629fda':p.color)},sunDirection:uniforms.sunlight},transparent:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false
  }));group.add(atmosphere);
  const ring=rings();group.add(ring);
  const cloud=new THREE.Mesh(new THREE.SphereGeometry(1.474,detail,detail/2),new THREE.MeshPhongMaterial({map:texture('earth-clouds'),transparent:true,blending:THREE.AdditiveBlending,opacity:.16,depthWrite:false}));group.add(cloud);
  const grid=new THREE.Mesh(new THREE.SphereGeometry(1.482,32,20),new THREE.MeshBasicMaterial({wireframe:true,color:0xc5eea0,transparent:true,opacity:.17,depthWrite:false}));grid.visible=false;group.add(grid);
  function setPlanet(next) {
    uniforms.dayMap.value=texture(detail>=96&&['earth','mars','jupiter'].includes(next.file)?next.file+'-hd':next.file);uniforms.earth.value=next.name==='Earth'?1:0;
    atmosphere.material.uniforms.color.value.set(next.name==='Earth'?'#629fda':next.color);atmosphere.visible=!['Mercury','Mars'].includes(next.name);
    ring.visible=next.name==='Saturn';cloud.visible=next.name==='Earth';group.rotation.z=next.name==='Uranus'?1.4:.12;globe.rotation.y=next.name==='Earth'?3.3:.7;
  }
  setPlanet(p);return {group,globe,atmosphere,ring,cloud,grid,uniforms,setPlanet};
}
function rendererFor(element) {
  if(new URLSearchParams(location.search).get('graphics')==='basic')throw new Error('Basic graphics mode selected');
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:760px)').matches?1.35:1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  element.append(renderer.domElement);return renderer;
}
function addLights(scene) { const sun=new THREE.DirectionalLight(0xf7f2e5,2.5);sun.position.set(-4,2.5,4);scene.add(sun,new THREE.AmbientLight(0x869aad,.12));return sun; }
function observeSize(element,renderer,camera) {bindRenderer(renderer,element,camera);}
export function initExperience(api) {
  try {setupSingularity(api);}catch(error){console.warn('Singularity observatory unavailable',error);}
  setupTravel(api);

  setupImmersive(api);
  setupReveal(api);
  try {setupPrecisionViewer(api,{world,rendererFor,observeSize,addLights,texture});}catch(error){showViewerFallback();console.warn('Viewer fallback active',error);}
  import('./command.js').then(({setupCommand})=>{const gfx={world,rendererFor,observeSize,addLights,texture};for(const [name,init] of [['universe observatory',setupUniverse],['command tools',setupCommand],['analytical tools',setupAnalysis],['field workspace',setupWorkspace],['expedition studio',setupExpeditions]]){try{init(api,gfx)}catch(error){console.warn(name+' unavailable',error)}}setupObservatoryUI();}).catch(error=>console.warn('Command tools unavailable',error));
  let started=false;
  new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!started){started=true;try{setupFlight(api)}catch(error){setupFlightFallback(api);console.warn('Flight fallback active',error)}}},{rootMargin:'500px'}).observe($('#journey'));
}
function showViewerFallback() {
  $('#planet-render').hidden=true;$('#planet-fallback').hidden=false;
  $('.drag-label').textContent='TEXTURE VIEW / 3D UNAVAILABLE';
  $('.viewer-zoom').hidden=true;$('.view-options').hidden=true;
}
function setupImmersive(api) {
  const dialog=$('#immersive-dialog'),stage=$('#planet-stage'),origin=stage.parentElement;
  $('#expand-view').onclick=()=>{$('#immersive-mount').append(stage);dialog.showModal();stage.focus();document.body.classList.add('observatory-open');};
  function restore(){origin.append(stage);document.body.classList.remove('observatory-open');$('#expand-view').focus();}
  $('#close-immersive').onclick=()=>dialog.close();dialog.addEventListener('close',restore);
  $('#previous-planet').onclick=()=>api.selectPlanet((api.getState().current+7)%8);
  $('#next-planet').onclick=()=>api.selectPlanet((api.getState().current+1)%8);
  document.addEventListener('planet-change',e=>{$('#immersive-name').textContent=`${e.detail.planet.name.toUpperCase()} / 0${e.detail.index+1}`;});
}
const route=[
  {index:2,kicker:'DEPARTURE',title:'It begins<br>with <em>home.</em>',copy:'Every explorer starts somewhere. Ours is a small blue world, suspended in the sunlight.'},
  {index:3,kicker:'THE RED PLANET',title:'A world waiting<br>to be <em>understood.</em>',copy:'Dust-red deserts. Ancient riverbeds. A landscape that asks what happened here — and what comes next.'},
  {index:4,kicker:'THE GAS GIANT',title:'Think big.<br>Then think <em>bigger.</em>',copy:'Jupiter could contain more than 1,300 Earths by volume. Its storms turn an atmosphere into a moving work of art.'},
  {index:5,kicker:'THE RINGED WORLD',title:'Some things<br>defy <em>expectation.</em>',copy:'Countless fragments of ice and rock. Together, they form the most extraordinary rings in our solar system.'},
  {index:6,kicker:'THE SIDEWAYS PLANET',title:'A different<br>point of <em>view.</em>',copy:'Tilted almost onto its side, Uranus reminds us that even a planet can take an unexpected path.'},
  {index:7,kicker:'THE OUTER FRONTIER',title:'The end of a map.<br>The start of <em>wonder.</em>',copy:'More than four light-hours from our star, Neptune moves through a world of deep cold and fierce winds.'}
];
function setupFlightUI(api) {
  const section=$('#journey');let active=-1;const routeControl=document.createElement('label');routeControl.className='flight-route-control';routeControl.innerHTML='FLIGHT POSITION <input id="flight-route" type="range" min="0" max="100" step=".1" value="0" aria-label="Flyby route position">';document.querySelector('.flight-bottom').prepend(routeControl);
  $('#flight-waypoints').innerHTML=route.map((step,i)=>`<button data-waypoint="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${api.planets[step.index].name}</button>`).join('');
  document.querySelectorAll('[data-waypoint]').forEach(b=>b.onclick=()=>{$('#flight-route').value=+b.dataset.waypoint*20;});
  return progress=>{const chapter=clamp(Math.round(progress*5),0,5);$('#flight-progress-fill').style.transform=`scaleX(${progress})`;if(chapter===active)return;active=chapter;const step=route[chapter],p=api.planets[step.index];$('#flight-counter').textContent=`0${chapter+1} / 06`;$('#flight-kicker').textContent=`${step.kicker} / ${p.distance.toLocaleString('en-US')} MILLION KM FROM THE SUN`;$('#flight-title').innerHTML=step.title;$('#flight-copy').textContent=step.copy;$('#flight-world').textContent=p.name;$('#flight-distance').textContent=p.distance.toLocaleString('en-US');document.querySelectorAll('[data-waypoint]').forEach((b,i)=>b.setAttribute('aria-pressed',i===chapter));return p;};
}
function setupFlight(api) {
  const root=$('#flight-render'),renderer=rendererFor(root),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,700);addLights(scene);scene.add(makeNebula());observeSize(root,renderer,camera);
  const worlds=route.map((step,i)=>{const model=world(api.planets[step.index],64);model.group.position.set(i*28,0,0);model.group.scale.setScalar(i===2?1.5:i===3?1.13:1.3);scene.add(model.group);return model;});
  let seed=337;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  const positions=new Float32Array(2300*3);for(let i=0;i<2300;i++){positions[i*3]=random()*390-100;positions[i*3+1]=(random()-.5)*160;positions[i*3+2]=(random()-.5)*220-25;}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({size:.09,color:0xb7d3eb,transparent:true,opacity:.8,sizeAttenuation:true})));
  // Instancing adds a distant asteroid field without one draw call per asteroid.
  const debris=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.055,0),new THREE.MeshBasicMaterial({color:0x6b737c}),280),dummy=new THREE.Object3D();
  for(let i=0;i<280;i++){const angle=random()*Math.PI*2,r=5+random()*2;dummy.position.set(42+Math.cos(angle)*r,(random()-.5)*2,Math.sin(angle)*r-4);dummy.scale.setScalar(.5+random()*2);dummy.updateMatrix();debris.setMatrixAt(i,dummy.matrix);}scene.add(debris);
  if(renderer.debug)renderer.debug.onShaderError=()=>{root.hidden=true;setupFlightFallback(api);};
  const updateUI=setupFlightUI(api);let progress=0,visible=false,last=0;const target=new THREE.Vector3();
  new IntersectionObserver(e=>{visible=e[0].isIntersecting;}).observe($('#journey'));
  function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05)||0;last=now;if(!visible||document.hidden)return;const r=$('#journey').getBoundingClientRect(),desired=+$('#flight-route').value/100;const moving=api.getState().motion;progress=moving?THREE.MathUtils.lerp(progress,desired,1-Math.exp(-dt*7)):desired;const path=progress*5,fraction=path-Math.floor(path),arc=Math.sin(fraction*Math.PI);const narrow=root.clientWidth<760;camera.position.set(path*28-(narrow?.75:2.8),1.3+arc*2,7.1+arc*11);target.set(path*28-(narrow?.7:2),narrow?-.7:-.25,0);camera.lookAt(target);worlds.forEach((w,i)=>{if(moving)w.globe.rotation.y+=dt*(.04+i*.005);});updateUI(progress);renderer.render(scene,camera);}requestAnimationFrame(frame);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();root.hidden=true;setupFlightFallback(api);});
}
function setupFlightFallback(api) {
  const el=$('#flight-fallback');el.hidden=false;const update=setupFlightUI(api);
  function draw(){const r=$('#journey').getBoundingClientRect(),p=update(+$('#flight-route').value/100);if(p)el.style.backgroundImage=`url(assets/${p.file}.jpg)`;}
  $('#flight-route').addEventListener('input',draw);document.querySelectorAll('[data-waypoint]').forEach(b=>b.addEventListener('click',draw));draw();
}
function setupTravel(api) {
  let destination=2,mode='light',animation=null,statusTimer=null;
  const select=$('#travel-destination');select.innerHTML=api.planets.map((p,i)=>`<option value="${i}" ${i===2?'selected':''}>${p.name}</option>`).join('');
  const particle=$('#signal-particle');
  function reset(){animation?.cancel();clearTimeout(statusTimer);particle.style.opacity='0';$('#signal-status').textContent='READY FOR TRANSMISSION';$('#send-signal').innerHTML='Send the signal <span>↗</span>';}
  function update(){reset();const p=api.planets[destination];$('#travel-duration').textContent=durationLabel(travelSeconds(p.distance,mode));$('#travel-distance').textContent=p.distance.toLocaleString('en-US')+' million kilometers';$('#target-caption').textContent=p.name.toUpperCase()+' / ARRIVAL';$('#travel-target').style.backgroundImage=`url(assets/${p.file}.jpg)`;}
  select.onchange=()=>{destination=+select.value;update();};
  document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{mode=b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(a=>{a.classList.toggle('selected',a===b);a.setAttribute('aria-pressed',a===b);});update();});
  $('#send-signal').onclick=()=>{reset();const p=api.planets[destination],moving=api.getState().motion;$('#signal-status').textContent=moving?'SIGNAL IN TRANSIT · ACCELERATED VIEW':`ARRIVED AT ${p.name.toUpperCase()}`;$('#send-signal').innerHTML='Replay transmission <span>↻</span>';if(!moving)return;animation=particle.animate([{left:'0%',opacity:0},{left:'3%',opacity:1,offset:.03},{left:'97%',opacity:1,offset:.97},{left:'100%',opacity:0}],{duration:4000,easing:'linear',fill:'none'});statusTimer=setTimeout(()=>{$('#signal-status').textContent=`ARRIVED AT ${p.name.toUpperCase()} · ${durationLabel(travelSeconds(p.distance,mode))}`;},4000);};
  document.addEventListener('motion-change',reset);update();
}
function setupReveal(api) {
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}})},{threshold:.08});
  document.querySelectorAll('.reveal,.section-heading').forEach(el=>{el.classList.add('motion-ready');observer.observe(el);});
  let requested=false;function scroll(){if(requested)return;requested=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#page-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;requested=false;});}
  const line=document.createElement('div');line.id='page-progress';line.setAttribute('aria-hidden','true');document.body.append(line);addEventListener('scroll',scroll,{passive:true});scroll();
}


export {world};
