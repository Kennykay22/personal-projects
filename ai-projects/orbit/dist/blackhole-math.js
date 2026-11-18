// Schwarzschild reference model. Distances used by the optical integrator are in Rs.
import {schwarzschildKm} from './lab-physics.js';
export const CRITICAL_IMPACT = 3 * Math.sqrt(3) / 2;
export function clockRate(radiusRs) {
  if (!(radiusRs > 1)) return 0;
  return Math.sqrt(1 - 1 / radiusRs);
}
export function tidalGradient(massSolar, radiusRs, lengthM = 2) {
  const rs = schwarzschildKm(massSolar) * 1000;
  return 299792458 ** 2 * rs * lengthM / (radiusRs * rs) ** 3;
}
export function blackholeReference(massSolar) {
  const rs = schwarzschildKm(massSolar);
  return {rs, photonSphere:1.5 * rs, isco:3 * rs, shadow:CRITICAL_IMPACT * rs,
    crossingSeconds:2 * rs / 299792.458};
}
// The planar null-geodesic equation r'' = -3 L² r / (2 |r|^5), with Rs=1.
// Start with E=1 and angular momentum -b at a finite source radius. RK4 is
// intentionally separate from the lower-resolution real-time GPU illustration.
export function tracePhoton(impact, {step=.045, maxSteps=6500} = {}) {
  let x=-24, y=impact;
  const r=Math.hypot(x,y), radial=-Math.sqrt(Math.max(0,1-impact**2/r**2+impact**2/r**3));
  let vx=radial*x/r+impact*y/r**2, vy=radial*y/r-impact*x/r**2;
  const l2=impact**2, points=[[x,y]];
  function derivative(s) {
    const radius=Math.hypot(s[0],s[1]), a=-1.5*l2/Math.max(radius**5,1e-8);
    return [s[2],s[3],s[0]*a,s[1]*a];
  }
  function add(s,k,h) {return s.map((v,i)=>v+k[i]*h)}
  let outcome='orbiting', minRadius=r;
  for(let i=0;i<maxSteps;i++) {
    const rr=Math.hypot(x,y); minRadius=Math.min(minRadius,rr);
    if(rr<=1.001){outcome='captured';break}
    if(rr>26 && x*vx+y*vy>0){outcome='escaped';break}
    const h=Math.min(step,Math.max(.006,rr*.018)), s=[x,y,vx,vy];
    const a=derivative(s),b=derivative(add(s,a,h/2)),c=derivative(add(s,b,h/2)),d=derivative(add(s,c,h));
    [x,y,vx,vy]=s.map((v,j)=>v+h/6*(a[j]+2*b[j]+2*c[j]+d[j]));
    if(i%3===0)points.push([x,y]);
  }
  points.push([x,y]);
  return {points,outcome,minRadius,impact};
}
