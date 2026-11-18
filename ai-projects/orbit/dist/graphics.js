import * as T from './assets/three.module.js';
const renderers=new Set();
let quality='auto';try{quality=localStorage.getItem('orbit-quality')||'auto'}catch{}
export function graphicsQuality(){return quality}
export function renderScale(width,height,mode=quality){
 const dpr=globalThis.devicePixelRatio||1;
 const cap=mode==='4k'?3840:mode==='ultra'?2560:mode==='efficient'?1100:1800;
 const desired=mode==='4k'?3840/width:mode==='ultra'?Math.max(dpr,1.6):mode==='efficient'?1:Math.min(dpr,1.6);
 return Math.max(.1,Math.min(desired,cap/width,(mode==='4k'?2160:1600)/height));
}
export function setGraphicsQuality(value){quality=['auto','efficient','ultra','4k'].includes(value)?value:'auto';try{localStorage.setItem('orbit-quality',quality)}catch{}document.dispatchEvent(new CustomEvent('graphics-quality',{detail:{quality}}));for(const item of renderers)item.resize();}
export function bindRenderer(renderer,root,camera){
 const item={visible:false,resize(){const r=root.getBoundingClientRect();if(!r.width||!r.height)return;const activeScale=Math.min(renderScale(r.width,r.height),quality==='auto'?(renderer.orbitAutoScale||Infinity):Infinity),scale=item.visible?activeScale:Math.min(1,900/r.width,650/r.height);renderer.setPixelRatio(scale);renderer.setSize(r.width,r.height);if(camera?.isPerspectiveCamera){camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}}};
 renderer.orbitResize=item.resize;renderers.add(item);new ResizeObserver(item.resize).observe(root);new IntersectionObserver(entries=>{item.visible=entries[0].isIntersecting;item.resize();},{rootMargin:'200px'}).observe(root);item.resize();
 return item.resize;
}
export function saveCanvas(canvas,name){canvas.toBlob(blob=>{if(!blob)return;const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)},'image/png');}
export function capture4K(renderer,scene,camera,name='ORBIT-4K.png',render){
 const size=renderer.getSize(new T.Vector2()),ratio=renderer.getPixelRatio(),aspect=camera.aspect;
 try{renderer.setPixelRatio(1);renderer.setSize(3840,2160,false);if(camera.isPerspectiveCamera){camera.aspect=16/9;camera.updateProjectionMatrix()}if(render)render();else renderer.render(scene,camera);saveCanvas(renderer.domElement,name)}finally{renderer.setPixelRatio(ratio);renderer.setSize(size.x,size.y,false);if(camera.isPerspectiveCamera){camera.aspect=aspect;camera.updateProjectionMatrix()}}
}
export function softSprite(){const data=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const r=Math.hypot(x-31.5,y-31.5)/31.5,a=Math.max(0,Math.exp(-r*r*7)-.001);data.set([255,255,255,Math.round(a*255)],(y*64+x)*4)}const t=new T.DataTexture(data,64,64,T.RGBAFormat);t.needsUpdate=true;return t;}
export function disposeObject(object){object.traverse(o=>{o.geometry?.dispose();for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])m.dispose()});object.clear();}
