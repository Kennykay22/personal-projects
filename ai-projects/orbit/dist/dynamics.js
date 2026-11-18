// JPL approximate elements, Table 1: mean ecliptic/equinox J2000; 1800–2050.
export const AU=149597870.7, C=299792.458, MU=1.3271244004127942e11;
export const elements=[
[[.38709927,.20563593,7.00497902,252.25032350,77.45779628,48.33076593],[.00000037,.00001906,-.00594749,149472.67411175,.16047689,-.12534081]],
[[.72333566,.00677672,3.39467605,181.97909950,131.60246718,76.67984255],[.00000390,-.00004107,-.00078890,58517.81538729,.00268329,-.27769418]],
[[1.00000261,.01671123,-.00001531,100.46457166,102.93768193,0],[.00000562,-.00004392,-.01294668,35999.37244981,.32327364,0]],
[[1.52371034,.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891],[.00001847,.00007882,-.00813131,19140.30268499,.44441088,-.29257343]],
[[5.202887,.04838624,1.30439695,34.39644051,14.72847983,100.47390909],[-.00011607,-.00013253,-.00183714,3034.74612775,.21252668,.20469106]],
[[9.53667594,.05386179,2.48599187,49.95424423,92.59887831,113.66242448],[-.00125060,-.00050991,.00193609,1222.49362201,-.41897216,-.28867794]],
[[19.18916464,.04725744,.77263783,313.23810451,170.95427630,74.01692503],[-.00196176,-.00004397,-.00242939,428.48202785,.40805281,.04240589]],
[[30.06992276,.00859048,1.77004347,-55.12002969,44.96476227,131.78422574],[.00026291,.00005105,.00035372,218.45945325,-.32241464,-.00508664]]];
export const dateDays=date=>(new Date(date).getTime()-Date.UTC(2000,0,1,12))/864e5;
export function orbitalElements(i,days=0){return elements[i][0].map((n,k)=>n+elements[i][1][k]*days/36525)}
export function kepler(M,e){let E=M;for(let k=0;k<12;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;}
export function position(i,days=0,anomaly){
 const [a,e,inc,L,peri,node]=orbitalElements(i,days),rad=Math.PI/180;
 const M=((L-peri+180)%360+360)%360*rad-Math.PI,E=anomaly??kepler(M,e),x=a*(Math.cos(E)-e),z=a*Math.sqrt(1-e*e)*Math.sin(E),w=(peri-node)*rad,o=node*rad,I=inc*rad;
 return {x:(Math.cos(w)*Math.cos(o)-Math.sin(w)*Math.sin(o)*Math.cos(I))*x+(-Math.sin(w)*Math.cos(o)-Math.cos(w)*Math.sin(o)*Math.cos(I))*z,
 y:Math.sin(w)*Math.sin(I)*x+Math.cos(w)*Math.sin(I)*z,
 z:(Math.cos(w)*Math.sin(o)+Math.sin(w)*Math.cos(o)*Math.cos(I))*x+(-Math.sin(w)*Math.sin(o)+Math.cos(w)*Math.cos(o)*Math.cos(I))*z};
}
export function separation(a,b,days){const p=position(a,days),q=position(b,days);return Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)*AU;}
export function fallTime(height,g){if(!Number.isFinite(height)||height<0||!Number.isFinite(g)||g<=0)throw new RangeError('Invalid fall inputs');return Math.sqrt(2*height/g)}
export function hohmann(r1,r2){if(!Number.isFinite(r1)||!Number.isFinite(r2)||r1<=0||r2<=0)throw new RangeError('Positive orbital radii required');const a=(r1+r2)/2,e=Math.abs(r2-r1)/(r1+r2),seconds=Math.PI*Math.sqrt((a*AU)**3/MU);return {a,e,seconds,departure:Math.abs(Math.sqrt(MU/(r1*AU))*(Math.sqrt(2*r2/(r1+r2))-1)),arrival:Math.abs(Math.sqrt(MU/(r2*AU))*(1-Math.sqrt(2*r1/(r1+r2))))};}
export function altitudeAt(t,radiusKm){return radiusKm*.00012*Math.pow(200/.00012,1-Math.max(0,Math.min(100,t))/100)}
export function terrainHeight(x,y,z){const broad=.5+.5*Math.sin(x*11+Math.sin(z*8))*Math.cos(y*13-z*7),ridge=1-Math.abs(Math.sin(x*170+Math.cos(z*90))*Math.cos(y*180+z*110)),detail=1-Math.abs(Math.sin(x*880+z*350)*Math.cos(y*730-z*260));return .00012+broad*.00065+Math.pow(ridge,3)*(.00035+broad*.001)+Math.pow(detail,4)*.00025;}
