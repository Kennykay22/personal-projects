export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function earthZoomForAltitude(altitudeKm,radiusKm){return clamp(100*(1-Math.log(altitudeKm/(radiusKm*.00012))/Math.log(200/.00012)),0,100)}
export function satellitePosition(phase,radius=1.6,inclination=.6,node=0){const c=Math.cos(phase),s=Math.sin(phase),ci=Math.cos(inclination),si=Math.sin(inclination),cn=Math.cos(node),sn=Math.sin(node);return {x:radius*(cn*c-sn*s*ci),y:radius*s*si,z:radius*(sn*c+cn*s*ci)}}
export function hasLineOfSight(a,b,radius=1.46){const d={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},q=d.x*d.x+d.y*d.y+d.z*d.z,t=q?clamp(-(a.x*d.x+a.y*d.y+a.z*d.z)/q,0,1):0;return Math.hypot(a.x+t*d.x,a.y+t*d.y,a.z+t*d.z)>radius+.001;}
export function circularPeriod(altitudeKm,radiusKm=6378.1,mu=398600.4418){return Math.PI*2*Math.sqrt((radiusKm+altitudeKm)**3/mu)}
export function hubbleVelocity(distanceMpc,h0=70){return distanceMpc*h0}
export function galaxyPoint(i,count,arms=4,spread=.28){
 const rand=n=>{const v=Math.sin(n*127.1+78.233)*43758.5453;return v-Math.floor(v)},r=Math.pow(rand(i+1),.68)*12,a=(i%arms)/arms*Math.PI*2+r*.65+(rand(i+77)-.5)*spread*3,thickness=(rand(i+100)-.5)*(.15+Math.exp(-r*.4)*1.4);
 return {x:Math.cos(a)*r,y:thickness,z:Math.sin(a)*r,r,temperature:3000+rand(i+330)*22000};
}
