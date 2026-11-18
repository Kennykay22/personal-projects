import test from 'node:test';
import assert from 'node:assert/strict';
import {travelSeconds,durationLabel,journeyProgress} from '../dist/science.js';

test('light from Sun to Earth takes about 499 seconds',()=>{
  assert.ok(Math.abs(travelSeconds(149.6)-499.012)<.01);
  assert.equal(durationLabel(travelSeconds(149.6)),'8m 19s');
});
test('outer planet travel crosses hours and years',()=>{
  assert.equal(durationLabel(travelSeconds(4515)),'4h 11m 0s');
  assert.equal(durationLabel(travelSeconds(4515,'probe')),'8.4 years');
});
test('duration formatting carries rounded seconds correctly',()=>{
  assert.equal(durationLabel(3599.9),'1h 0m 0s');
  assert.equal(durationLabel(59.6),'1m 0s');
  assert.equal(durationLabel(0),'0m 0s');
});
test('invalid distances are rejected',()=>{
  for(const invalid of [-1,NaN,Infinity])assert.throws(()=>travelSeconds(invalid),RangeError);
});
test('sticky flight progress stays within its endpoints',()=>{
  assert.equal(journeyProgress(30,5800,1000),0);
  assert.equal(journeyProgress(-2400,5800,1000),.5);
  assert.equal(journeyProgress(-4800,5800,1000),1);
  assert.equal(journeyProgress(-5000,5800,1000),1);
  assert.equal(journeyProgress(0,1000,1000),0);
});

test('gravity transfer preserves mass while changing gravitational force',async()=>{
  const {gravitationalForce}=await import('../dist/science.js');
  assert.equal(gravitationalForce(75,9.8),735);
  assert.equal(gravitationalForce(75,3.7),277.5);
  assert.equal(gravitationalForce(0,9.8),0);
  assert.throws(()=>gravitationalForce(-1,9.8),RangeError);
});
test('Earth escape speed and solar irradiance are physically plausible',async()=>{
  const {escapeVelocityKmS,solarIrradiance}=await import('../dist/science.js');
  assert.ok(Math.abs(escapeVelocityKmS(9.8,12756)-11.18)<.01);
  assert.equal(solarIrradiance(149.6),1361);
  assert.equal(solarIrradiance(299.2),1361/4);
});
test('orbital motion preserves radius and returns after one period',async()=>{
  const {orbitPosition}=await import('../dist/science.js');
  const start=orbitPosition(5,365.2,0),end=orbitPosition(5,365.2,365.2);
  assert.equal(start.x,5);assert.equal(start.z,0);
  assert.ok(Math.abs(end.x-start.x)<1e-12);assert.ok(Math.abs(end.z-start.z)<1e-12);
  const quarter=orbitPosition(5,365.2,365.2/4);assert.ok(Math.abs(quarter.x)<1e-12);assert.equal(quarter.z,5);
});
