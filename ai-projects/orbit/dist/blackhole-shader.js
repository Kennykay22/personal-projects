export const blackholeFragment = `
precision highp float;
uniform vec2 resolution;
uniform float time, yaw, pitch, distance, center, lensing, diskOn, gridOn, exposure, activity, jets, pulse, quality;
uniform float diskTilt,innerRadius,spectrum,hotspot,disruption,eventAge,splitView,beaming;
vec3 tilted(vec3 p){float c=cos(diskTilt),s=sin(diskTilt);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
vec3 sky(vec3 d){
  vec2 p=vec2(atan(d.z,d.x),asin(clamp(d.y,-1.,1.)));
  vec2 cells=p*260.;vec2 id=floor(cells),f=fract(cells)-.5;
  float star=pow(max(0.,1.-length(f)*2.),18.)*step(.986,hash(id));
  float dust=noise(p*5.)*.6+noise(p*13.)*.3;
  float band=exp(-pow((p.y+.2*sin(p.x*2.))*5.,2.));
  vec3 col=vec3(.014,.021,.032)+vec3(.075,.08,.12)*band*dust;
  col+=star*mix(vec3(.55,.72,1.),vec3(1.,.8,.6),hash(id+9.))*1.7;
  if(gridOn>.5){vec2 g=abs(sin(p*18.));col+=vec3(.16,.28,.32)*(1.-smoothstep(.008,.024,min(g.x,g.y)));}
  return col;
}
vec3 diskColor(vec3 p,vec3 v){
  float r=length(p.xz),a=atan(p.z,p.x),spin=time*activity*.27/pow(r,.9);
  float n=noise(vec2(a*7.-spin,r*7.));
  float fil=.52+.25*sin(r*26.+n*7.-time*.9)+.23*sin(a*24.-spin*12.+r*17.);
  float heat=pow(innerRadius/r,1.8);
  vec3 color=mix(vec3(1.,.18,.025),vec3(1.,.83,.48),clamp(heat*.7,0.,1.));
  vec3 tangent=normalize(vec3(-p.z,0.,p.x));
  float beam=mix(1.,pow(clamp(1.+dot(normalize(v),tangent)*sqrt(.5/r),.4,1.6),3.),beaming);
  float edge=smoothstep(innerRadius,innerRadius+.35,r)*(1.-smoothstep(7.,9.,r));
  float hot=exp(-pow(sin((a-time*.7)*.5)*12.,2.))*exp(-pow((r-innerRadius-.6)*3.,2.))*hotspot;
 if(spectrum>.5&&spectrum<1.5)color=mix(vec3(.45,.03,.01),vec3(1.,.65,.25),clamp(heat,0.,1.));if(spectrum>1.5)color=mix(vec3(.22,.025,.75),vec3(.35,.85,1.),clamp(heat,0.,1.));
 return (color*heat*(.75+fil*1.1)+vec3(.8,1.,1.)*hot*4.)*beam*edge*(.8+pulse*2.);
}
void main(){
  vec2 screen=gl_FragCoord.xy/resolution;float lens=lensing;vec2 uv=(screen-vec2(center,.51))*vec2(resolution.x/resolution.y,1.);if(splitView>.5){uv=(vec2(fract(screen.x*2.),screen.y)-vec2(.5,.51))*vec2(resolution.x/resolution.y*.5,1.);if(screen.x<.5)lens=0.;}
  vec3 ro=distance*vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch));
  vec3 forward=normalize(-ro),right=normalize(cross(forward,vec3(0.,1.,0.))),up=cross(right,forward);
  vec3 v=normalize(forward+uv.x*right*1.13+uv.y*up*1.13),p=ro;
  float h2=dot(cross(p,v),cross(p,v));
  vec3 color=vec3(0.);float trans=1.,closest=100.;bool captured=false;
  for(int i=0;i<360;i++){
    if(float(i)>quality)break;
    float r=length(p);closest=min(closest,r);
    if(r<1.){captured=true;break;}
    if(r>40.)break;
    float stepSize=clamp(r*.065,.028,.65);
    vec3 prev=p;
    vec3 acc=-1.5*h2*p/pow(r,5.)*lens;
    p+=v*stepSize+acc*stepSize*stepSize*.5;
    float nr=length(p);
    v+=(acc-1.5*h2*p/pow(nr,5.)*lens)*stepSize*.5;
    vec3 tp=tilted(p),tprev=tilted(prev);
    if(tprev.y*tp.y<0. && diskOn>.5){
      vec3 hit=mix(tprev,tp,abs(tprev.y)/(abs(tprev.y)+abs(tp.y)));
      float rad=length(hit.xz);
      if(rad>innerRadius && rad<9.){color+=trans*diskColor(hit,tilted(v));trans*=.18;}
    }
    if(disruption>.5){float a=eventAge*7.,radius=9.-eventAge*7.5;vec3 star=vec3(cos(a)*radius,.4*(1.-eventAge),sin(a)*radius);vec3 q=tp-star;float radial=dot(q,normalize(star)),across=length(q-normalize(star)*radial);float emission=exp(-across*across*32.-radial*radial/(.04+eventAge*3.));color+=trans*vec3(1.,.7,.35)*emission*stepSize*4.;}
    if(jets>.5){float beam=exp(-dot(tp.xz,tp.xz)*12.)*exp(-abs(tp.y)*.14)*smoothstep(1.2,2.,abs(tp.y));color+=trans*vec3(.08,.23,.5)*beam*stepSize*.5;}
    if(trans<.025)break;
  }
  if(!captured)color+=trans*sky(normalize(v));
  // Thin glow outlines unresolved higher-order photon images; the disk itself
  // is sampled at bent-ray plane crossings, rather than drawn as a foreground ring.
  color+=vec3(1.,.59,.22)*exp(-abs(closest-1.5)*29.)*.11*lens;
  color=vec3(1.)-exp(-color*exposure*1.5);
  color=pow(color,vec3(.87));
  color*=1.-.32*dot(uv,uv);
  gl_FragColor=vec4(max(color,vec3(0.)),1.);
}`;
