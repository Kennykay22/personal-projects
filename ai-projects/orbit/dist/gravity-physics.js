import {dropAcceleration} from './lab-physics.js';
// Lumped center contact: a sphere compresses a linear spring/damper net.
// Contact force is unilateral; the net cannot pull an escaping ball downward.
export function simulateCatch({height=20,mass=75,radius=.2,density=0,launch=0,g=9.8,duration=20,stiffness=12000,damping=900}={}){
 if(height<=0||mass<=0||stiffness<=0||damping<0)throw new RangeError('Invalid net experiment');
 const dt=1/960,samples=[],impacts=[];let y=height,v=launch;
 const sample=t=>samples.push({t,y,v,sag:Math.max(0,-y),spring:.5*stiffness*Math.max(0,-y)**2,energy:mass*g*y+.5*mass*v*v+.5*stiffness*Math.max(0,-y)**2});sample(0);
 for(let k=1;k<=Math.round(duration/dt);k++){const oldY=y,oldV=v,force=y<0?Math.max(0,-stiffness*y-damping*v):0;v+=(dropAcceleration(v,g,mass,radius,density)+force/mass)*dt;y+=v*dt;if(oldY>0&&y<=0&&v<0){const f=oldY/(oldY-y);impacts.push({t:(k-1+f)*dt,speed:Math.abs(oldV+(v-oldV)*f)})}if(k%16===0)sample(k*dt);}
 return {samples,impacts};
}
