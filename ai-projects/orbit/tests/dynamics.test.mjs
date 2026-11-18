import test from 'node:test';
import assert from 'node:assert/strict';
import {position,orbitalElements,dateDays,kepler,fallTime,hohmann,altitudeAt,terrainHeight,AU,C,separation} from '../dist/dynamics.js';
test('J2000 reference date and terrestrial heliocentric position',()=>{
 assert.equal(dateDays('2000-01-01T12:00:00Z'),0);
 const p=position(2,0);assert.ok(Math.abs(p.x-(-.1772))<.001);assert.ok(Math.abs(p.z-.9672)<.001);assert.ok(Math.abs(p.y)<.00001);
});
test('Kepler solution satisfies equation for all supported eccentricities',()=>{
 for(const e of [0,.0086,.0934,.2057])for(const M of [-Math.PI,-1,0,1,Math.PI])assert.ok(Math.abs(kepler(M,e)-e*Math.sin(kepler(M,e))-M)<1e-12);
});
test('elliptical radii, inclination, and time-dependent positions',()=>{
 for(let i=0;i<8;i++){
  const [a,e]=orbitalElements(i,0),peri=position(i,0,0),apo=position(i,0,Math.PI);
  assert.ok(Math.abs(Math.hypot(peri.x,peri.y,peri.z)-a*(1-e))<1e-10);
  assert.ok(Math.abs(Math.hypot(apo.x,apo.y,apo.z)-a*(1+e))<1e-10);
  const p=position(i,1000),q=position(i,1001);assert.ok(Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)>0);
 }
 assert.ok(Math.abs(position(0,0).y)>.01);
});
test('light time and separation are symmetric and date dependent',()=>{
 assert.ok(Math.abs(AU/C-499.004783836)<1e-8);
 assert.equal(separation(2,3,0),separation(3,2,0));assert.equal(separation(2,2,0),0);
 assert.notEqual(separation(2,3,0),separation(2,3,100));
});
test('vacuum fall time matches analytic result and rejects invalid input',()=>{
 assert.ok(Math.abs(fallTime(20,9.8)-2.020305089)<1e-8);assert.equal(fallTime(0,3.7),0);
 for(const [h,g] of [[-1,9.8],[1,0],[NaN,1],[1,Infinity]])assert.throws(()=>fallTime(h,g),RangeError);
});
test('Earth–Mars Hohmann transfer matches known two-body approximation',()=>{
 const h=hohmann(1,1.52371034);assert.ok(Math.abs(h.seconds/86400-258.87)<1);assert.ok(Math.abs(h.departure-2.945)<.02);assert.ok(Math.abs(h.arrival-2.65)<.02);
 const reverse=hohmann(1.52371034,1);assert.equal(reverse.seconds,h.seconds);assert.ok(Math.abs(reverse.departure-h.arrival)<1e-10);
 assert.equal(hohmann(1,1).departure,0);assert.throws(()=>hohmann(0,1),RangeError);
});
test('log zoom spans near terrain to remote planetary view monotonically',()=>{
 let previous=Infinity;for(let i=0;i<=100;i++){const a=altitudeAt(i,6378);assert.ok(a>0&&a<previous);previous=a;}
 assert.ok(Math.abs(altitudeAt(100,6378)-.76536)<1e-8);assert.equal(altitudeAt(0,6378),1275600);assert.equal(altitudeAt(-1,6378),altitudeAt(0,6378));
});
test('illustrative terrain elevation is bounded, deterministic, and nonuniform',()=>{
 let min=Infinity,max=-Infinity;for(let i=0;i<100;i++){const a=i*2.4,x=Math.sin(a),y=Math.cos(a),z=0,h=terrainHeight(x,y,z);assert.equal(h,terrainHeight(x,y,z));assert.ok(h>=0&&h<.003);min=Math.min(min,h);max=Math.max(max,h);}assert.ok(max-min>.0005);
});
