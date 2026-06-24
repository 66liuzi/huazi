'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GridScan.css';

const vert = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;

const frag = `precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt,uYaw,uLineThickness;
uniform vec3 uLinesColor,uScanColor;
uniform float uGridScale,uLineJitter,uScanOpacity,uScanDirection;
uniform float uNoise,uScanGlow,uScanSoftness,uScanDuration,uScanDelay;
varying vec2 vUv;

float sm01(float a,float b,float x){float t=clamp((x-a)/max(1e-5,b-a),0.0,1.0);return t*t*t*(t*(t*6.0-15.0)+10.0);}

void main(){
  vec2 uv=(gl_FragCoord.xy*2.0-iResolution.xy)/iResolution.y;
  vec3 ro=vec3(0.0),rd=normalize(vec3(uv,2.0));
  float cR=cos(uTilt),sR=sin(uTilt);rd.xy=mat2(cR,-sR,sR,cR)*rd.xy;
  float cY=cos(uYaw),sY=sin(uYaw);rd.xz=mat2(cY,-sY,sY,cY)*rd.xz;
  vec2 sk=clamp(uSkew,vec2(-0.7),vec2(0.7));rd.xy+=sk*rd.z;
  vec3 col=vec3(0.01,0.005,0.02);
  float gs=max(1e-5,uGridScale),minT=1e20;vec2 guv=vec2(0.0);
  for(int i=0;i<4;i++){
    float iy=float(i<2);
    float pos=mix(-0.2,0.2,float(i))*iy+mix(-0.5,0.5,float(i-2))*(1.0-iy);
    float t=(pos-(iy*ro.y+(1.0-iy)*ro.x))/(iy*rd.y+(1.0-iy)*rd.x);
    vec3 h=ro+rd*t;h.xy+=sk*0.15*smoothstep(0.0,3.0,h.z);
    if(t>0.0&&t<minT){guv=mix(h.zy,h.xz,iy)/gs;minT=t;}
  }
  vec3 hit=ro+rd*minT;
  float ja=clamp(uLineJitter,0.0,1.0);
  if(ja>0.0)guv+=vec2(sin(guv.y*2.7+iTime*1.8),cos(guv.x*2.3-iTime*1.6))*(0.12*ja);
  float fx=fract(guv.x),fy=fract(guv.y);
  float ax=min(fx,1.0-fx),ay=min(fy,1.0-fy);
  float wx=fwidth(guv.x),wy=fwidth(guv.y);
  float hp=max(0.0,uLineThickness)*0.4;
  float lx=1.0-smoothstep(hp*wx,hp*wx+wx,ax);
  float ly=1.0-smoothstep(hp*wy,hp*wy+wy,ay);
  float grid=(lx+ly)*0.5;
  float dist=length(hit-ro),fade=(1.0-smoothstep(0.0,0.8,dist/5.0))*0.6;
  col+=uLinesColor*grid*fade;

  float cyc=uScanDuration+uScanDelay;
  float tc=mod(iTime,cyc);
  float ph=clamp(tc/max(1e-5,uScanDuration),0.0,1.0);
  if(uScanDirection>1.5)ph=abs(ph*2.0-1.0);
  else if(uScanDirection>0.5)ph=1.0-ph;
  float taper=sm01(0.0,0.85,ph)*sm01(0.85,0.0,ph);
  vec2 sp=(hit.xy+sk*hit.z*0.5)/(hit.z+1e-5)+vec2(0.0,0.1);
  float sy=mix(0.85,-0.85,ph);
  float ds=length(sp-vec2(0.0,sy));
  float core=exp(-ds*uScanSoftness*2.0);
  float aura=exp(-ds*uScanSoftness*uScanGlow*0.5)*0.4;
  col+=uScanColor*(core+aura)*taper*uScanOpacity*1.5;

  float vig=1.0-length(uv)*0.5;col*=clamp(vig,0.0,1.0);
  float noise=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  col+=(noise-0.5)*uNoise*0.4;
  gl_FragColor=vec4(col,1.0);
}`;

function srgb(hex:string){const c=new THREE.Color(hex);return c.convertSRGBToLinear();}

interface GridScanProps {
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  gridScale?: number;
  lineJitter?: number;
  scanColor?: string;
  scanOpacity?: number;
  scanDirection?: 'forward'|'backward'|'pingpong';
  scanGlow?: number;
  scanSoftness?: number;
  scanDuration?: number;
  scanDelay?: number;
  noiseIntensity?: number;
  snapBackDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const GridScan: React.FC<GridScanProps>=({
  sensitivity=0.5,lineThickness=1.5,linesColor='#6b5ce7',gridScale=0.06,
  lineJitter=0.05,scanColor='#96c8ff',scanOpacity=0.5,scanDirection='pingpong',
  scanGlow=0.6,scanSoftness=1.8,scanDuration=3.0,scanDelay=1.5,
  noiseIntensity=0.008,snapBackDelay=250,className='',style={},
})=>{
  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const container=containerRef.current;
    if(!container)return;

    let renderer:THREE.WebGLRenderer|null=null;
    let cleanup:()=>void=()=>{};

    try{
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      const uniforms={
        iResolution:{value:new THREE.Vector3(1,1,1)},
        iTime:{value:0},
        uSkew:{value:new THREE.Vector2(0,0)},
        uTilt:{value:0},uYaw:{value:0},
        uLineThickness:{value:lineThickness},
        uLinesColor:{value:srgb(linesColor)},
        uScanColor:{value:srgb(scanColor)},
        uGridScale:{value:gridScale},
        uLineJitter:{value:Math.max(0,Math.min(1,lineJitter))},
        uScanOpacity:{value:scanOpacity},
        uNoise:{value:noiseIntensity},
        uScanGlow:{value:scanGlow},
        uScanSoftness:{value:scanSoftness},
        uScanDuration:{value:scanDuration},
        uScanDelay:{value:scanDelay},
        uScanDirection:{value:scanDirection==='backward'?1:scanDirection==='pingpong'?2:0},
      };

      const material=new THREE.ShaderMaterial({
        uniforms,vertexShader:vert,fragmentShader:frag,
        transparent:true,depthWrite:false,depthTest:false,
      });
      const scene=new THREE.Scene();
      const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
      const lookTarget=new THREE.Vector2(0,0);
      let hovering=false;

      const setSize=()=>{
        const w=container.clientWidth,h=container.clientHeight;
        if(!w||!h||!renderer)return;
        renderer.setSize(w,h,false);
        uniforms.iResolution.value.set(w,h,renderer.getPixelRatio());
      };
      setSize();

      const onMouse=(e:MouseEvent)=>{
        if(!hovering)return;
        const r=container.getBoundingClientRect();
        lookTarget.set(((e.clientX-r.left)/r.width)*2-1,-(((e.clientY-r.top)/r.height)*2-1));
      };
      const onEnter=()=>{hovering=true;};
      const onLeave=()=>{
        hovering=false;
        setTimeout(()=>{if(!hovering)lookTarget.set(0,0);},snapBackDelay);
      };

      container.addEventListener('mousemove',onMouse);
      container.addEventListener('mouseenter',onEnter);
      container.addEventListener('mouseleave',onLeave);
      window.addEventListener('resize',setSize);

      let raf=0;
      const loop=(t:number)=>{
        const u=uniforms;
        u.iTime.value=t*0.001;
        u.uSkew.value.x+=(lookTarget.x*0.15-u.uSkew.value.x)*0.08;
        u.uSkew.value.y+=(lookTarget.y*0.12-u.uSkew.value.y)*0.08;
        u.uTilt.value+=(lookTarget.x*0.25-u.uTilt.value)*0.08;
        u.uYaw.value+=(lookTarget.y*0.2-u.uYaw.value)*0.08;
        renderer!.render(scene,camera);
        raf=requestAnimationFrame(loop);
      };
      raf=requestAnimationFrame(loop);

      cleanup=()=>{
        cancelAnimationFrame(raf);
        container.removeEventListener('mousemove',onMouse);
        container.removeEventListener('mouseenter',onEnter);
        container.removeEventListener('mouseleave',onLeave);
        window.removeEventListener('resize',setSize);
        renderer!.dispose();
      };
    }catch(e){
      console.warn('GridScan init failed',e);
      if(renderer)renderer.dispose();
    }

    return cleanup;
  },[]);

  return <div ref={containerRef} className={`gridscan${className?` ${className}`:''}`} style={style}/>;
};

export default GridScan;
