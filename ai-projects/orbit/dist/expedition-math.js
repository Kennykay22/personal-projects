export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function eclipseState(sourceRadius,occluderRadius,sourceDistance,occluderDistance,offset){
 const sun=Math.atan(sourceRadius/sourceDistance),moon=Math.atan(occluderRadius/occluderDistance),separation=Math.atan(Math.abs(offset)/occluderDistance);
 return {sun,moon,separation,type:separation>=sun+moon?'No eclipse':separation<=Math.abs(moon-sun)?moon>=sun?'Total eclipse':'Annular eclipse':'Partial eclipse'};
}
export function propellantFraction(deltaVkmS,isp=450){if(deltaVkmS<0||isp<=0)throw new RangeError('Invalid propulsion inputs');return 1-Math.exp(-deltaVkmS*1000/(9.80665*isp));}
export function surfaceHeight(x,z,seed=0){return Math.sin(x*.55+seed)*Math.cos(z*.4-seed)*.65+Math.sin(x*1.7+z*.7)*.16+Math.cos(z*2.1-x)*.08;}
export function slopeAt(x,z,seed=0){const e=.02,dx=(surfaceHeight(x+e,z,seed)-surfaceHeight(x-e,z,seed))/(2*e),dz=(surfaceHeight(x,z+e,seed)-surfaceHeight(x,z-e,seed))/(2*e);return Math.atan(Math.hypot(dx,dz))*180/Math.PI;}
// Fraction of a circular solar disk obscured by a circular foreground disk.
export function obscuration(sun,moon,separation){
 if(separation>=sun+moon)return 0;
 if(separation<=Math.abs(sun-moon))return Math.min(1,moon*moon/(sun*sun));
 const d=separation,a=Math.acos(Math.max(-1,Math.min(1,(d*d+sun*sun-moon*moon)/(2*d*sun)))),b=Math.acos(Math.max(-1,Math.min(1,(d*d+moon*moon-sun*sun)/(2*d*moon))));
 const area=sun*sun*a+moon*moon*b-.5*Math.sqrt(Math.max(0,(-d+sun+moon)*(d+sun-moon)*(d-sun+moon)*(d+sun+moon)));
 return Math.max(0,Math.min(1,area/(Math.PI*sun*sun)));
}
