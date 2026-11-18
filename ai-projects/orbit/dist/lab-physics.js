export const G=6.67430e-11,CMS=299792458,SOLAR_MASS=1.98847e30;
export function schwarzschildKm(solarMass){if(!Number.isFinite(solarMass)||solarMass<=0)throw new RangeError('Positive mass required');return 2*G*SOLAR_MASS*solarMass/(CMS*CMS)/1000;}
export function dropAcceleration(v,g,mass,radius,density=0,cd=.47){if(mass<=0||radius<=0||g<=0||density<0)throw new RangeError('Invalid experiment parameters');return -g-.5*density*cd*Math.PI*radius*radius*v*Math.abs(v)/mass;}
export function simulateDrop({height=20,mass=75,radius=.2,density=0,launch=0,restitution=0,g=9.8,duration=20}={}){
 if(height<=0||duration<=0||restitution<0||restitution>1)throw new RangeError('Invalid initial state');
 const dt=1/240,result=[{t:0,y:height,v:launch,energy:mass*g*height+.5*mass*launch*launch}],impacts=[];let y=height,v=launch,rest=false;
 for(let k=1;k<=Math.round(duration/dt);k++){const prior=y,oldV=v;let t=k*dt;if(!rest){const a=dropAcceleration(v,g,mass,radius,density);v+=a*dt;y+=v*dt;if(y<=0&&v<0){const f=prior/(prior-y||1);impacts.push({t:t-dt+f*dt,speed:Math.abs(oldV+(v-oldV)*f)});y=0;v=-v*restitution;if(v<.08){v=0;rest=true;}}}if(k%4===0)result.push({t,y,v,energy:mass*g*y+.5*mass*v*v});}
 return {samples:result,impacts};
}
export function sampleDrop(samples,t){const i=Math.max(0,Math.min(samples.length-1,Math.round(t*60)));return samples[i];}
