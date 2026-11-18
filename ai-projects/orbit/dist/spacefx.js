import * as THREE from './assets/three.module.js';
export function makeStars(count=3200,spread=150){
  let seed=7381;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  const points=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count);
  for(let i=0;i<count;i++){const theta=random()*Math.PI*2,phi=Math.acos(random()*2-1),r=spread*(.55+random()*.45);points.set([Math.sin(phi)*Math.cos(theta)*r,Math.cos(phi)*r,Math.sin(phi)*Math.sin(theta)*r],i*3);const tint=random();colors.set(tint>.82?[1,.69,.39]:tint<.3?[.48,.73,1]:[.8,.9,1],i*3);sizes[i]=random()>.96?3.3:random()*1.5+.5;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(points,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
  const mat=new THREE.ShaderMaterial({vertexShader:`attribute float size;varying vec3 vColor;void main(){vColor=color;vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=size;gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vColor;void main(){float r=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,r);gl_FragColor=vec4(vColor,a*.9);}`,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  return new THREE.Points(geo,mat);
}
export function makeNebula(){
  const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 p;float hash(vec3 v){return fract(sin(dot(v,vec3(127.1,311.7,74.7)))*43758.5453);}float noise(vec3 v){vec3 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}void main(){vec3 d=normalize(p);float n=0.;float a=.5;vec3 q=d*4.;for(int i=0;i<5;i++){n+=noise(q)*a;q=q*2.03+3.1;a*=.5;}float band=exp(-pow((d.y+d.x*.3-.05)*3.,2.));vec3 c=mix(vec3(.006,.015,.034),vec3(.026,.08,.125),pow(n,2.)*band);c+=vec3(.045,.014,.065)*pow(max(n-.34,0.),1.5)*band;gl_FragColor=vec4(c,1.);}`});
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(260,40,24),material);mesh.renderOrder=-20;return mesh;
}
export function makeSun(map){
  const group=new THREE.Group();
  const mat=new THREE.ShaderMaterial({uniforms:{map:{value:map},time:{value:0}},vertexShader:`varying vec2 uv0;varying vec3 n;void main(){uv0=uv;n=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D map;uniform float time;varying vec2 uv0;varying vec3 n;void main(){vec2 uv=uv0;uv.x+=sin(uv.y*38.+time*.3)*.004;uv.y+=sin(uv.x*55.-time*.2)*.003;vec3 s=texture2D(map,uv).rgb;float granule=sin(uv.x*450.+time)*sin(uv.y*270.-time*.7)*.04;vec3 c=s*vec3(1.8,1.22,.64)+vec3(.4,.16,.025)+granule;gl_FragColor=vec4(c,1.);}`});
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.9,64,40),mat);group.add(sphere);
  const corona=new THREE.Mesh(new THREE.SphereGeometry(1.2,64,40),new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:`varying vec3 n;varying vec3 view;varying vec3 p;void main(){p=position;n=normalize(normalMatrix*normal);vec4 v=modelViewMatrix*vec4(position,1.);view=normalize(-v.xyz);gl_Position=projectionMatrix*v;}`,fragmentShader:`uniform float time;varying vec3 n;varying vec3 view;varying vec3 p;void main(){float rim=pow(max(0.,.75-dot(normalize(n),-normalize(view))),2.5);float ray=.55+.2*sin(atan(p.y,p.x)*35.+time*.35)+.12*sin(atan(p.z,p.x)*57.-time*.2);gl_FragColor=vec4(vec3(1.,.4,.08),clamp(rim*ray*.27,0.,.5));}`}));group.add(corona);
  const light=new THREE.PointLight(0xffc77a,18,85,1.2);group.add(light);
  return {group,tick:t=>{mat.uniforms.time.value=t;corona.material.uniforms.time.value=t;sphere.rotation.y=t*.015;}};
}
export function makeSatellite(){
  const craft=new THREE.Group(),hull=new THREE.MeshStandardMaterial({color:0xb9c5cb,metalness:.8,roughness:.32}),gold=new THREE.MeshStandardMaterial({color:0xd0ac58,metalness:.75,roughness:.4});
  const core=new THREE.Mesh(new THREE.BoxGeometry(.13,.13,.19),gold);craft.add(core);
  const panelMat=new THREE.MeshStandardMaterial({color:0x174c8a,metalness:.5,roughness:.28,emissive:0x05152b,side:THREE.DoubleSide});
  for(const sign of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.3,.012,.2),panelMat);panel.position.x=sign*.24;craft.add(panel);for(let j=0;j<10;j++){const line=new THREE.Mesh(new THREE.BoxGeometry(.002,.014,.2),hull);line.position.set(sign*.24-.135+j*.03,0,0);craft.add(line);}const boom=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.2,8),hull);boom.rotation.z=Math.PI/2;boom.position.x=sign*.1;craft.add(boom);}
  const dish=new THREE.Mesh(new THREE.SphereGeometry(.07,20,12,0,Math.PI*2,0,Math.PI/2),hull);dish.rotation.x=Math.PI/2;dish.position.z=.14;craft.add(dish);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.21,8),hull);rod.position.y=.13;craft.add(rod);
  for(let i=0;i<12;i++){const seam=new THREE.Mesh(new THREE.BoxGeometry(.132,.002,.002),hull);seam.position.set(0,-.06+i*.011,.097);craft.add(seam);}const nozzle=new THREE.Mesh(new THREE.ConeGeometry(.025,.045,16,1,true),hull);nozzle.rotation.x=-Math.PI/2;nozzle.position.z=-.12;craft.add(nozzle);for(const sign of [-1,1]){const antenna=new THREE.Mesh(new THREE.CylinderGeometry(.0015,.0015,.22,8),gold);antenna.position.set(sign*.075,.12,0);antenna.rotation.z=sign*.3;craft.add(antenna);}craft.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return craft;
}
export function makeOrbitPath(radius,color=0x397c9e){
  const points=Array.from({length:193},(_,i)=>new THREE.Vector3(Math.cos(i/192*Math.PI*2)*radius,0,Math.sin(i/192*Math.PI*2)*radius));
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.43}));
}
export function makePipeline(renderer,scene,camera){
  if(!renderer.setRenderTarget)return{render:()=>renderer.render(scene,camera),set enabled(v){},get enabled(){return true}};
  let enabled=true;
  const hdr=renderer.capabilities?.isWebGL2&&renderer.extensions?.has('EXT_color_buffer_float');
  const target=new THREE.WebGLRenderTarget(1,1,{type:hdr?THREE.HalfFloatType:THREE.UnsignedByteType,depthBuffer:true});
  if(renderer.info)renderer.info.autoReset=false;
  const screen=new THREE.Scene(),ortho=new THREE.OrthographicCamera(-1,1,1,-1,0,1),size=new THREE.Vector2();
  const material=new THREE.ShaderMaterial({uniforms:{sceneTex:{value:target.texture},resolution:{value:new THREE.Vector2(1,1)},time:{value:0}},depthTest:false,depthWrite:false,vertexShader:`varying vec2 uv0;void main(){uv0=uv;gl_Position=vec4(position,1.);}`,fragmentShader:`uniform sampler2D sceneTex;uniform vec2 resolution;uniform float time;varying vec2 uv0;void main(){vec2 px=1./resolution;vec3 base=texture2D(sceneTex,uv0).rgb;vec3 glow=vec3(0.);for(int x=-2;x<=2;x++){for(int y=-2;y<=2;y++){vec2 off=vec2(float(x),float(y))*px*3.;vec3 c=texture2D(sceneTex,uv0+off).rgb;float w=exp(-float(x*x+y*y)*.4);glow+=max(c-.64,0.)*w;}}vec2 p=uv0-.5;float vignette=1.-dot(p,p)*.55;vec3 color=(base+glow*.033)*vignette;color+=sin(uv0.y*resolution.y*1.57)*.0015;gl_FragColor=vec4(color,1.);\n#include <colorspace_fragment>\n}`});
  screen.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
  return{get enabled(){return enabled},set enabled(v){enabled=v},render(time=0){renderer.info?.reset?.();if(!enabled){renderer.setRenderTarget(null);renderer.render(scene,camera);return;}renderer.getDrawingBufferSize(size);if(target.width!==size.x||target.height!==size.y){target.setSize(size.x,size.y);material.uniforms.resolution.value.copy(size);}material.uniforms.time.value=time;renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(screen,ortho);}};
}
