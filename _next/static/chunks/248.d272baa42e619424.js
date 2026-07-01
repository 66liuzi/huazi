(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[248],{7248:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>g});var i=a(5155),n=a(2115),l=a(6926),o=a(5269),r=a(9625);a(9419);let s=`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,c=`
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);

  float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;

  float tx = halfPx * wx;
  float ty = halfPx * wy;

  float aax = wx;
  float aay = wy;

  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);

  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (jitterAmt > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * jitterAmt);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float aax2 = wx2;
  float aay2 = wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);
  if (uLineStyle > 0.5) {
    float dashRepeat2 = 4.0;
    float dashDuty2 = 0.5;
    float vy2m = fract(gridUV2.y * dashRepeat2);
    float vx2m = fract(gridUV2.x * dashRepeat2);
    float dashMaskY2 = step(vy2m, dashDuty2);
    float dashMaskX2 = step(vx2m, dashDuty2);
    if (uLineStyle < 1.5) {
      lineX2 *= dashMaskY2;
      lineY2 *= dashMaskX2;
    } else {
      float dotRepeat2 = 6.0;
      float dotWidth2 = 0.18;
      float cy2 = abs(fract(gridUV2.y * dotRepeat2) - 0.5);
      float cx2 = abs(fract(gridUV2.x * dotRepeat2) - 0.5);
      float dotMaskY2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.y * dotRepeat2), cy2);
      float dotMaskX2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.x * dotRepeat2), cx2);
      lineX2 *= dotMaskY2;
      lineY2 *= dotMaskX2;
    }
  }
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);

    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    if (uScanDirection > 0.5 && uScanDirection < 1.5) {
      phase = 1.0 - phase;
    } else if (uScanDirection > 1.5) {
      float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
      phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }
    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headW = taper;
    float tailW = taper;
    float headFade = smoother01(0.0, headW, phase);
    float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      if (uScanDirection > 0.5 && uScanDirection < 1.5) {
        phaseI = 1.0 - phaseI;
      } else if (uScanDirection > 1.5) {
        phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      }
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, headW, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

  float lineVis = lineMask;
  vec3 gridCol = uLinesColor * lineVis * fade;
  vec3 scanCol = uScanColor * combinedPulse;
  vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
  float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
  float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
  float halo = max(gx, gy) * fade;
  alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
  fragColor = vec4(color, alpha);
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`,u=({enableWebcam:e=!1,showPreview:t=!1,modelsPath:u="https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights",sensitivity:y=.55,lineThickness:x=1,linesColor:g="#2F293A",scanColor:w="#FF9FFC",scanOpacity:S=.4,gridScale:b=.1,lineStyle:M="solid",lineJitter:k=.1,scanDirection:R="pingpong",enablePost:Y=!0,bloomIntensity:I=0,bloomThreshold:C=0,bloomSmoothing:T=0,chromaticAberration:j=.002,noiseIntensity:D=.01,scanGlow:L=.5,scanSoftness:U=2,scanPhaseTaper:V=.9,scanDuration:E=2,scanDelay:A=2,enableGyro:F=!1,scanOnClick:P=!1,snapBackDelay:W=250,className:z,style:O})=>{let X=(0,n.useRef)(null),N=(0,n.useRef)(null),B=(0,n.useRef)(null),_=(0,n.useRef)(null),G=(0,n.useRef)(null),q=(0,n.useRef)(null),H=(0,n.useRef)(null),Z=(0,n.useRef)(0),[$,J]=(0,n.useState)(!1),[K,Q]=(0,n.useState)(!1),ee=(0,n.useRef)(new o.I9Y(0,0)),et=(0,n.useRef)(0),ea=(0,n.useRef)(0),ei=(0,n.useRef)(new o.I9Y(0,0)),en=(0,n.useRef)(new o.I9Y(0,0)),el=(0,n.useRef)(0),eo=(0,n.useRef)(0),er=(0,n.useRef)(0),es=(0,n.useRef)(0),ec=(0,n.useRef)([]),eu=(0,n.useRef)([]),ed=(0,n.useRef)([]),ef=(0,n.useRef)([]),eh=(0,n.useRef)([]),em=o.cj9.clamp(y,0,1),ep=o.cj9.lerp(.06,.2,em),ev=o.cj9.lerp(.12,.3,em),ey=o.cj9.lerp(.1,.28,em),ex=o.cj9.lerp(.25,.45,em),eg=o.cj9.lerp(.45,.12,em),ew=1/0,eS=o.cj9.lerp(1.2,1.6,em);return(0,n.useEffect)(()=>{let e=X.current;if(!e)return;let t=null,a=a=>{if(K)return;t&&(clearTimeout(t),t=null);let i=e.getBoundingClientRect(),n=(a.clientX-i.left)/i.width*2-1,l=-((a.clientY-i.top)/i.height*2-1);ee.current.set(n,l)},i=async()=>{let e=performance.now()/1e3;if(P&&(e=>{let t=ec.current.slice();if(t.length>=8&&t.shift(),t.push(e),ec.current=t,_.current){let e=_.current.uniforms,a=Array(8).fill(0);for(let e=0;e<t.length&&e<8;e++)a[e]=t[e];e.uScanStarts.value=a,e.uScanCount.value=t.length}})(e),F&&window.DeviceOrientationEvent&&window.DeviceOrientationEvent.requestPermission)try{await window.DeviceOrientationEvent.requestPermission()}catch{}},n=()=>{t&&(clearTimeout(t),t=null)},l=()=>{K||(t&&clearTimeout(t),t=setTimeout(()=>{ee.current.set(0,0),et.current=0,ea.current=0},Math.max(0,W||0)))};return e.addEventListener("mousemove",a),e.addEventListener("mouseenter",n),P&&e.addEventListener("click",i),e.addEventListener("mouseleave",l),()=>{e.removeEventListener("mousemove",a),e.removeEventListener("mouseenter",n),e.removeEventListener("mouseleave",l),P&&e.removeEventListener("click",i),t&&clearTimeout(t)}},[K,W,P,F]),(0,n.useEffect)(()=>{let e=X.current;if(!e)return;let t=new r.JeP({antialias:!0,alpha:!0});B.current=t,t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.setSize(e.clientWidth,e.clientHeight),t.outputColorSpace=o.er$,t.toneMapping=o.y_p,t.autoClear=!1,t.setClearColor(0,0),e.appendChild(t.domElement);let a={iResolution:{value:new o.Pq0(e.clientWidth,e.clientHeight,t.getPixelRatio())},iTime:{value:0},uSkew:{value:new o.I9Y(0,0)},uTilt:{value:0},uYaw:{value:0},uLineThickness:{value:x},uLinesColor:{value:d(g)},uScanColor:{value:d(w)},uGridScale:{value:b},uLineStyle:{value:"dashed"===M?1:2*("dotted"===M)},uLineJitter:{value:Math.max(0,Math.min(1,k||0))},uScanOpacity:{value:S},uNoise:{value:D},uBloomOpacity:{value:I},uScanGlow:{value:L},uScanSoftness:{value:U},uPhaseTaper:{value:V},uScanDuration:{value:E},uScanDelay:{value:A},uScanDirection:{value:"backward"===R?1:2*("pingpong"===R)},uScanStarts:{value:Array(8).fill(0)},uScanCount:{value:0}},i=new o.BKk({uniforms:a,vertexShader:s,fragmentShader:c,transparent:!0,depthWrite:!1,depthTest:!1});_.current=i;let n=new o.Z58,u=new o.qUd(-1,1,1,-1,0,1),h=new o.eaF(new o.bdM(2,2),i);n.add(h);let m=null;if(Y){G.current=m=new l.s0(t);let e=new l.AH(n,u);m.addPass(e);let a=new l.bv({intensity:1,luminanceThreshold:C,luminanceSmoothing:T});a.blendMode.opacity.value=Math.max(0,I),q.current=a;let i=new l.t$({offset:new o.I9Y(j,j),radialModulation:!0,modulationOffset:0});H.current=i;let r=new l.Vu(u,a,i);r.renderToScreen=!0,m.addPass(r)}let p=()=>{t.setSize(e.clientWidth,e.clientHeight),i.uniforms.iResolution.value.set(e.clientWidth,e.clientHeight,t.getPixelRatio()),G.current&&G.current.setSize(e.clientWidth,e.clientHeight)};window.addEventListener("resize",p);let v=performance.now(),y=()=>{var e,a,l,r,s,c;let d,h,m,p,x,g,w,S,b,M,k=performance.now(),R=Math.max(0,Math.min(.1,(k-v)/1e3));v=k,ei.current.copy((e=ei.current,a=ee.current,l=en.current,r=eg,s=ew,c=R,d=e.clone(),p=1/(1+(m=(h=2/(r=Math.max(1e-4,r)))*c)+.48*m*m+.235*m*m*m),x=e.clone().sub(a),g=a.clone(),w=s*r,x.length()>w&&x.setLength(w),a=e.clone().sub(x),S=l.clone().addScaledVector(x,h).multiplyScalar(c),l.sub(S.clone().multiplyScalar(h)),l.multiplyScalar(p),d.copy(a.clone().add(x.add(S).multiplyScalar(p))),b=g.clone().sub(e),M=d.clone().sub(g),b.dot(M)>0&&(d.copy(g),l.set(0,0)),d));let Y=f(el.current,et.current,{v:eo.current},eg,ew,R);el.current=Y.value,eo.current=Y.v;let I=f(er.current,ea.current,{v:es.current},eg,ew,R);er.current=I.value,es.current=I.v;let C=new o.I9Y(ei.current.x*ep,-ei.current.y*eS*ep);i.uniforms.uSkew.value.set(C.x,C.y),i.uniforms.uTilt.value=el.current*ev,i.uniforms.uYaw.value=o.cj9.clamp(er.current*ey,-.6,.6),i.uniforms.iTime.value=k/1e3,t.clear(!0,!0,!0),G.current?G.current.render(R):t.render(n,u),Z.current=requestAnimationFrame(y)};return Z.current=requestAnimationFrame(y),()=>{Z.current&&cancelAnimationFrame(Z.current),window.removeEventListener("resize",p),i.dispose(),h.geometry.dispose(),G.current&&(G.current.dispose(),G.current=null),t.dispose(),t.forceContextLoss(),e.removeChild(t.domElement)}},[y,x,g,w,S,b,M,k,R,Y,D,I,L,U,V,E,A,C,T,j,eg,ew,ep,eS,ev,ey]),(0,n.useEffect)(()=>{let e=_.current;if(e){let t=e.uniforms;t.uLineThickness.value=x,t.uLinesColor.value.copy(d(g)),t.uScanColor.value.copy(d(w)),t.uGridScale.value=b,t.uLineStyle.value="dashed"===M?1:2*("dotted"===M),t.uLineJitter.value=Math.max(0,Math.min(1,k||0)),t.uBloomOpacity.value=Math.max(0,I),t.uNoise.value=Math.max(0,D),t.uScanGlow.value=L,t.uScanOpacity.value=Math.max(0,Math.min(1,S)),t.uScanDirection.value="backward"===R?1:2*("pingpong"===R),t.uScanSoftness.value=U,t.uPhaseTaper.value=V,t.uScanDuration.value=Math.max(.05,E),t.uScanDelay.value=Math.max(0,A)}q.current&&(q.current.blendMode.opacity.value=Math.max(0,I),q.current.luminanceMaterial.threshold=C,q.current.luminanceMaterial.smoothing=T),H.current&&H.current.offset.set(j,j)},[x,g,w,b,M,k,I,C,T,j,D,L,S,R,U,V,E,A]),(0,n.useEffect)(()=>{if(!F)return;let e=e=>{if(K)return;let t=e.gamma??0,a=e.beta??0,i=o.cj9.clamp(t/45,-1,1),n=o.cj9.clamp(-a/30,-1,1);ee.current.set(i,n),et.current=.4*o.cj9.degToRad(t)};return window.addEventListener("deviceorientation",e),()=>{window.removeEventListener("deviceorientation",e)}},[F,K]),(0,n.useEffect)(()=>{if(!e)return;let t=!1;return(async()=>{try{let e=await Promise.all([a.e(122),a.e(814),a.e(997)]).then(a.bind(a,187));await Promise.all([e.nets.tinyFaceDetector.loadFromUri(u),e.nets.faceLandmark68TinyNet.loadFromUri(u)]),t||J(!0)}catch{t||J(!1)}})(),()=>{t=!0}},[u,e]),(0,n.useEffect)(()=>{let t=!1,i=0,n=N.current;return(async()=>{if(!e||!$||!n)return;try{n.srcObject=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:720}},audio:!1}),await n.play()}catch{return}let l=await Promise.all([a.e(122),a.e(814),a.e(997)]).then(a.bind(a,187)),r=new l.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.5}),s=async e=>{if(!t){if(e-i>=33){i=e;try{let e=await l.detectSingleFace(n,r).withFaceLandmarks(!0);if(e&&e.detection){let t=e.detection.box,a=n.videoWidth||1,i=n.videoHeight||1,l=t.x+.5*t.width,r=t.y+.5*t.height;h(eu.current,l/a*2-1,5),h(ed.current,r/i*2-1,5);let s=m(eu.current),c=m(ed.current),u=new o.I9Y(Math.tanh(s),Math.tanh(c)),d=Math.min(1,Math.hypot(t.width/a,t.height/i));ee.current.copy(u.multiplyScalar(1+ex*(d-.25)));let f=e.landmarks.getLeftEye(),y=e.landmarks.getRightEye(),x=p(f),g=p(y),w=Math.atan2(g.y-x.y,g.x-x.x);h(ef.current,w,5),et.current=m(ef.current);let S=e.landmarks.getNose(),b=S[S.length-1]||S[Math.floor(S.length/2)],M=e.landmarks.getJawOutline(),k=M[3]||M[2],R=M[13]||M[14],Y=v(b,k),I=v(b,R),C=Math.hypot(g.x-x.x,g.y-x.y)+1e-6,T=o.cj9.clamp((I-Y)/(1.6*C),-1,1);T=Math.tanh(T),h(eh.current,T,5),ea.current=m(eh.current),Q(!0)}else Q(!1)}catch{Q(!1)}}"requestVideoFrameCallback"in HTMLVideoElement.prototype?n.requestVideoFrameCallback(()=>s(performance.now())):requestAnimationFrame(s)}};requestAnimationFrame(s)})(),()=>{if(t=!0,n){let e=n.srcObject;e&&"getTracks"in e&&e.getTracks().forEach(e=>e.stop()),n.pause(),n.srcObject=null}}},[e,$,ex]),(0,i.jsx)("div",{ref:X,className:`gridscan${z?` ${z}`:""}`,style:O,children:t&&(0,i.jsxs)("div",{className:"gridscan__preview",children:[(0,i.jsx)("video",{ref:N,muted:!0,playsInline:!0,autoPlay:!0,className:"gridscan__video"}),(0,i.jsx)("div",{className:"gridscan__badge",children:e?$?K?"Face: tracking":"Face: searching":"Loading models":"Webcam disabled"})]})})};function d(e){return new o.Q1f(e).convertSRGBToLinear()}function f(e,t,a,i,n,l){let o=2/(i=Math.max(1e-4,i)),r=o*l,s=1/(1+r+.48*r*r+.235*r*r*r),c=e-t,u=t;t=e-(c=Math.sign(c)*Math.min(Math.abs(c),n*i));let d=(a.v+o*c)*l;a.v=(a.v-o*d)*s;let f=t+(c+d)*s,h=f-u;return(u-e)*h>0&&(f=u,a.v=0),{value:f,v:a.v}}function h(e,t,a){e.push(t),e.length>a&&e.shift()}function m(e){if(0===e.length)return 0;let t=[...e].sort((e,t)=>e-t),a=Math.floor(t.length/2);return t.length%2?t[a]:(t[a-1]+t[a])*.5}function p(e){let t=0,a=0,i=e.length||1;for(let i of e)t+=i.x,a+=i.y;return{x:t/i,y:a/i}}function v(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}function y(){return(0,i.jsxs)("div",{className:"absolute inset-0 overflow-hidden",style:{background:"#090909"},children:[(0,i.jsx)("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-breathe"}),(0,i.jsx)("div",{className:"absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] animate-breathe",style:{animationDelay:"1.5s"}}),(0,i.jsx)("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-breathe",style:{animationDelay:"0.8s"}}),(0,i.jsx)("div",{className:"absolute inset-0",children:[...Array(20)].map((e,t)=>(0,i.jsx)("div",{className:"absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-float",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,animationDelay:`${5*Math.random()}s`,animationDuration:`${4+6*Math.random()}s`,opacity:.2+.4*Math.random()}},t))})]})}class x extends n.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){}render(){return this.state.hasError?this.props.fallback:this.props.children}}function g(){let[e,t]=(0,n.useState)(!1),[a,l]=(0,n.useState)(!1),[o,r]=(0,n.useState)(!1);return((0,n.useEffect)(()=>{l(!0),r(window.matchMedia("(hover: none) and (pointer: coarse)").matches||window.innerWidth<768)},[]),(0,n.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||t(!0)}catch{t(!0)}},[]),a)?e?(0,i.jsx)(y,{}):(0,i.jsx)(x,{fallback:(0,i.jsx)(y,{}),children:(0,i.jsx)(u,{sensitivity:.55,lineThickness:1,linesColor:"#bedf2a",gridScale:.09,scanColor:"#dd81df",scanOpacity:.4,enablePost:!0,bloomIntensity:.6,chromaticAberration:.002,noiseIntensity:.01,lineJitter:.04})}):null}},9419:()=>{}}]);