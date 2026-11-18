import {setupOrbitalEngine} from './orbital-engine.js';
import {clamp,gravitationalForce,escapeVelocityKmS,solarIrradiance} from './science.js';
const $=s=>document.querySelector(s);
const number=(n,d=1)=>n.toLocaleString('en-US',{maximumFractionDigits:d});
const landmarks={
  Earth:[['Sahara',23.4,13],['Himalayas',28,86.9],['Amazon basin',-3,-62]],
  Mars:[['Olympus Mons',18.65,-133.8],['Valles Marineris',-13.9,-59.2],['Jezero crater',18.4,77.5]],
  Venus:[['Maxwell Montes',65.2,3.3],['Aphrodite Terra',-5,104]],
  Mercury:[['Caloris basin',30.5,160.5],['Southern highlands',-30,40]]
};
const composition={
  Venus:[['CO₂',96.5],['N₂',3.5]],Earth:[['N₂',78.08],['O₂',20.95],['OTHER',.97]],Mars:[['CO₂',95.3],['N₂',2.7],['Ar + OTHER',2]],
  Jupiter:[['H₂',89.8],['He',10.2]],Saturn:[['H₂',96.3],['He + TRACES',3.7]],Uranus:[['H₂',82.5],['He',15.2],['CH₄',2.3]],Neptune:[['H₂',80],['He',19],['CH₄ + TRACES',1]]
};
const missions=[
  {year:'2021',name:'PERSEVERANCE',world:'Mars',text:'Jezero crater landing / sample collection',url:'https://science.nasa.gov/mission/mars-2020-perseverance/'},
  {year:'2016',name:'JUNO',world:'Jupiter',text:'Jupiter orbit insertion / polar exploration',url:'https://science.nasa.gov/mission/juno/'},
  {year:'2015',name:'NEW HORIZONS',world:'Pluto',text:'First close flyby of Pluto and its moons',url:'https://science.nasa.gov/mission/new-horizons/'},
  {year:'2004',name:'CASSINI',world:'Saturn',text:'Saturn orbit insertion / ring and moon science',url:'https://science.nasa.gov/mission/cassini/'},
  {year:'1977',name:'VOYAGER',world:'outer',text:'Twin launches / outer planets to interstellar space',url:'https://science.nasa.gov/mission/voyager/'}
];
export function setupCommand(api,graphics){
  setupTelemetry(api);setupGravity(api);setupArchive();setupPalette(api);
  let started=false;
  new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!started){started=true;try{setupOrbitalEngine(api,graphics);}catch(error){$('#solar-render').hidden=true;$('#orbits').hidden=false;$('#solar-scale-note').textContent='2D FALLBACK / SCHEMATIC';console.warn('Solar engine fallback',error);}}},{rootMargin:'400px'}).observe($('#solar-system'));
  let timer;document.addEventListener('orbit-toast',event=>{clearTimeout(timer);$('#action-toast').textContent=event.detail;$('#action-toast').classList.add('visible');timer=setTimeout(()=>$('#action-toast').classList.remove('visible'),3500);});
}
function setupTelemetry(api){
  function clock(){$('#system-time').textContent='UTC / '+new Date().toISOString().slice(11,19);}
  clock();setInterval(clock,1000);
  function update(){const p=api.planets[api.getState().current];$('#hud-diameter').innerHTML=number(p.diameter,0)+' <small>KM</small>';$('#hud-gravity').innerHTML=number(p.gravity)+' <small>M/S²</small>';$('#hud-escape').innerHTML=number(escapeVelocityKmS(p.gravity,p.diameter),2)+' <small>KM/S</small>';$('#hud-flux').innerHTML=number(solarIrradiance(p.distance),0)+' <small>W/M²</small>';
    const targets=landmarks[p.name];$('#landmark-list').innerHTML=targets?targets.map(([name,lat,lon],i)=>`<button class="landmark-button" data-landmark="${i}">⌖ ${name}<span>${lat.toFixed(1)}° / ${lon.toFixed(1)}°</span></button>`).join(''):'<p class="instrument-note">NO SOLID SURFACE TARGETS.<br>USE THE LIGHTING AND GRID CONTROLS TO STUDY THIS ATMOSPHERE.</p>';
    $('#landmark-note').textContent=targets?'SLEW TO APPROXIMATE GEOGRAPHIC COORDINATES':'ATMOSPHERIC WORLD / OPTICAL OBSERVATION';
    document.querySelectorAll('[data-landmark]').forEach(b=>b.onclick=()=>{const target=targets[+b.dataset.landmark];document.dispatchEvent(new CustomEvent('surface-target',{detail:{lat:target[1],lon:target[2]}}));document.dispatchEvent(new CustomEvent('orbit-toast',{detail:'TARGET ACQUIRED / '+target[0].toUpperCase()}));});
    $('#atmosphere-profile').innerHTML=composition[p.name]?composition[p.name].map(([gas,fraction],i)=>`<div class="composition-row"><div><span>${gas}</span><span>${fraction}%</span></div><i style="--fraction:${fraction}%;--gas-color:${['#74dff4','#e8b177','#699cc6'][i]}"><span></span></i></div>`).join(''):'<p class="instrument-note">TENUOUS EXOSPHERE<br>OXYGEN · SODIUM · HYDROGEN<br>NO SUBSTANTIAL ATMOSPHERE</p>';
    $('#comparison-title').textContent=p.name.toUpperCase()+' / EARTH';
    const ratios=[['EQUATORIAL DIAMETER',p.diameter/12756],['SURFACE GRAVITY',p.gravity/9.8],['ORBITAL PERIOD',p.period/365.2],['SOLAR IRRADIANCE',solarIrradiance(p.distance)/1361]];
    $('#comparison-metrics').innerHTML=ratios.map(([label,r])=>`<div class="comparison-metric"><div><span>${label}</span><strong>${r.toFixed(r<.1?3:2)}×</strong></div><div class="comparison-meter" style="--marker:${clamp(50+Math.log2(Math.max(r,.001))*9,2,98)}%"></div></div>`).join('');
  }document.addEventListener('planet-change',update);update();
  $('#compare-launch').onclick=()=>{if($('#compare-toggle').getAttribute('aria-pressed')!=='true')$('#compare-toggle').click();$('#expand-view').click();};
}
function setupGravity(api){
  $('#gravity-planet').innerHTML=api.planets.map((p,i)=>`<option value="${i}" ${i===2?'selected':''}>${p.name}</option>`).join('');
  $('#gravity-planet').value='2';
  function update(){const mass=+$('#body-mass').value||75,p=api.planets[+$('#gravity-planet').value||0];$('#body-mass-label').textContent=mass+' KG';$('#gravity-force').textContent=number(gravitationalForce(mass,p.gravity),1);$('#gravity-explanation').textContent=`Your mass stays ${mass} kg. On ${p.name}, your weight is ${(p.gravity/9.8).toFixed(2)}× your Earth weight. Gas-giant gravity uses a reference atmospheric level.`;}
  $('#body-mass').oninput=update;$('#gravity-planet').onchange=update;update();
}
function setupArchive(){function render(filter){const selected=missions.filter(m=>filter==='all'||filter===m.world||filter==='outer'&&m.world!=='Mars');$('#mission-archive').innerHTML=selected.map(m=>`<a class="archive-entry" href="${m.url}" target="_blank" rel="noopener"><span>${m.year}</span><div><strong>${m.name}</strong><small>${m.text}</small></div><b>↗</b></a>`).join('');}
  document.querySelectorAll('[data-mission-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mission-filter]').forEach(a=>a.setAttribute('aria-pressed',a===b));render(b.dataset.missionFilter);});render('all');
}
function setupPalette(api){
  const dialog=$('#command-dialog'),input=$('#command-search');let index=0,filtered=[];
  const commands=[...['universe','singularity','relativity-lab','gravity-studio','expeditions','light-lab','data-lab'].map((id,i)=>({label:['Explore the universe','Explore black holes','Open relativity experiments','Open gravity dynamics','Open expedition studio','Open transmission control','Explore planetary data'][i],type:'NAVIGATE',run:()=>$('#'+id)?.scrollIntoView({behavior:api.getState().motion?'smooth':'instant'})})),...api.planets.map((p,i)=>({label:'Inspect '+p.name,type:p.type,run:()=>{api.selectPlanet(i);$('#explore').scrollIntoView({behavior:'smooth'});}})),{label:'Open immersive observatory',type:'VIEW',run:()=>$('#expand-view').click()},{label:'Start deep-space flight',type:'NAVIGATE',run:()=>$('#journey').scrollIntoView({behavior:api.getState().motion?'smooth':'instant'})},{label:'Navigate to orbital engine',type:'NAVIGATE',run:()=>$('#solar-system').scrollIntoView({behavior:api.getState().motion?'smooth':'instant'})},{label:'Compare planet with Earth',type:'ANALYZE',run:()=>$('#compare-launch').click()},{label:'Toggle surface grid',type:'VIEW',run:()=>$('#grid-toggle').click()},{label:'Toggle night-side lighting',type:'VIEW',run:()=>$('#light-toggle').click()},{label:'Capture planet image',type:'SAVE PNG',run:()=>{$('#explore').scrollIntoView({behavior:'instant'});$('#capture-frame').click();}}];
  function render(){filtered=commands.filter(c=>c.label.toLowerCase().includes(input.value.toLowerCase()));index=clamp(index,0,Math.max(0,filtered.length-1));$('#command-results').innerHTML=filtered.length?filtered.map((c,i)=>`<button class="command-result ${i===index?'is-focused':''}" data-command="${i}"><span>${c.label}</span><small>${c.type} ↗</small></button>`).join(''):'<div class="command-result">No matching command.</div>';document.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>execute(+b.dataset.command));}
  function execute(i){const c=filtered[i];if(c){dialog.close();c.run();}}
  function open(){if($('#immersive-dialog').open)return;dialog.showModal();input.value='';index=0;render();input.focus();}
  $('#open-command').onclick=open;$('#close-command').onclick=()=>dialog.close();input.oninput=()=>{index=0;render();};
  input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();index=clamp(index+(e.key==='ArrowDown'?1:-1),0,Math.max(0,filtered.length-1));render();}else if(e.key==='Enter'){e.preventDefault();execute(index);}});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dialog.open)dialog.close();else open();}});
}
