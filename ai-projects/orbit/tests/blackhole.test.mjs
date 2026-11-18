import test from 'node:test';
import assert from 'node:assert/strict';
import {blackholeReference,clockRate,tidalGradient,tracePhoton,CRITICAL_IMPACT} from '../dist/blackhole-math.js';
test('Schwarzschild reference radii and crossing time have consistent dimensions',()=>{
 const r=blackholeReference(10);assert.ok(Math.abs(r.rs-29.533)<.01);
 assert.equal(r.photonSphere,1.5*r.rs);assert.equal(r.isco,3*r.rs);
 assert.equal(r.shadow,CRITICAL_IMPACT*r.rs);assert.ok(Math.abs(r.crossingSeconds-.00019703)<1e-7);
});
test('stationary clock rates match reference limits and redshift relation',()=>{
 assert.equal(clockRate(1),0);assert.equal(clockRate(.5),0);
 assert.ok(Math.abs(clockRate(1.5)-1/Math.sqrt(3))<1e-12);
 assert.ok(clockRate(1.01)<clockRate(3));assert.ok(clockRate(1e10)>.999999999);
});
test('tidal gradient scales with inverse mass squared at fixed horizon radius',()=>{
 const a=tidalGradient(10,3);assert.ok(Math.abs(a/tidalGradient(100,3)-100)<1e-10);
 assert.ok(Math.abs(a/tidalGradient(10,6)-8)<1e-10);
 assert.equal(tidalGradient(10,3,4),2*a);
});
test('null ray capture boundary straddles 3sqrt(3)/2',()=>{
 assert.equal(tracePhoton(CRITICAL_IMPACT-.003).outcome,'captured');
 assert.equal(tracePhoton(CRITICAL_IMPACT+.003).outcome,'escaped');
});
test('photon trajectory preserves reflection symmetry',()=>{
 const a=tracePhoton(3.4),b=tracePhoton(-3.4);assert.equal(a.outcome,'escaped');
 assert.equal(a.points.length,b.points.length);
 a.points.forEach((p,i)=>{assert.ok(Math.abs(p[0]-b.points[i][0])<1e-9);assert.ok(Math.abs(p[1]+b.points[i][1])<1e-9);});
});
test('ray deflection converges when integration step is halved',()=>{
 const a=tracePhoton(2.65),b=tracePhoton(2.65,{step:.0225,maxSteps:12000});
 assert.equal(a.outcome,b.outcome);assert.ok(Math.abs(a.minRadius-b.minRadius)<.002);
 const angle=p=>Math.atan2(p.at(-1)[1]-p.at(-2)[1],p.at(-1)[0]-p.at(-2)[0]);
 assert.ok(Math.abs(angle(a.points)-angle(b.points))<.003);
});
