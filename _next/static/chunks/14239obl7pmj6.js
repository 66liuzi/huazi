(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,53470,e=>{"use strict";var t=e.i(22789),a=e.i(12323),o=e.i(88513),n=e.i(2865),i=e.i(96719),r=e.i(84222);let l=({height:e=3.5,baseWidth:l=5.5,animationType:s="rotate",glow:u=1,offset:c={x:0,y:0},noise:m=.5,transparent:f=!0,scale:h=3.6,hueShift:d=0,colorFrequency:v=1,hoverStrength:x=2,inertia:b=.05,bloom:p=1,suspendWhenOffscreen:w=!1,timeScale:g=.5,maxDpr:M=2,onBackgroundColor:y})=>{let S=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t=S.current;if(!t)return;let a=Math.max(.001,e),B=.5*Math.max(.001,l),E=Math.max(0,u),H=Math.max(0,m),C=c?.x??0,P=c?.y??0,T=Math.max(.001,h),A=Math.max(0,v||1),R=Math.max(0,p||1),F=Math.max(0,g||1),I=Math.max(0,x||1),L=Math.max(0,Math.min(1,b||.12)),U=Math.min(M,window.devicePixelRatio||1),W=new o.Renderer({dpr:U,alpha:f,antialias:!1}),j=W.gl;j.disable(j.DEPTH_TEST),j.disable(j.CULL_FACE),j.disable(j.BLEND),Object.assign(j.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),t.appendChild(j.canvas);let q=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,N=`
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `,D=new n.Triangle(j),z=new Float32Array(2),O=new Float32Array(2),_=new i.Program(j,{vertex:q,fragment:N,uniforms:{iResolution:{value:z},iTime:{value:0},uHeight:{value:a},uBaseHalf:{value:B},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:E},uOffsetPx:{value:O},uNoise:{value:H},uSaturation:{value:f?1.5:1},uScale:{value:T},uHueShift:{value:d||0},uColorFreq:{value:A},uBloom:{value:R},uCenterShift:{value:.25*a},uInvBaseHalf:{value:1/B},uInvHeight:{value:1/a},uMinAxis:{value:Math.min(B,a)},uPxScale:{value:1/(.1*(j.drawingBufferHeight||1)*T)},uTimeScale:{value:F}}}),k=new r.Mesh(j,{geometry:D,program:_}),G=()=>{let e=t.clientWidth||1,a=t.clientHeight||1;W.setSize(e,a),z[0]=j.drawingBufferWidth,z[1]=j.drawingBufferHeight,O[0]=C*U,O[1]=P*U,_.uniforms.uPxScale.value=1/(.1*(j.drawingBufferHeight||1)*T)},$=new ResizeObserver(G);$.observe(t),G();let K=new Float32Array(9),V=(e,t,a,o)=>{let n=Math.cos(e),i=Math.sin(e),r=Math.cos(t),l=Math.sin(t),s=Math.cos(a),u=Math.sin(a);return o[0]=n*s+i*l*u,o[1]=r*u,o[2]=-i*s+n*l*u,o[3]=-n*u+i*l*s,o[4]=r*s,o[5]=i*u+n*l*s,o[6]=i*r,o[7]=-l,o[8]=n*r,o},Y=H<1e-6,X=0,J=performance.now(),Q=new Uint8Array(4),Z=0,ee=()=>{X||(X=requestAnimationFrame(eb))},et=()=>{X&&(cancelAnimationFrame(X),X=0)},ea=(.3+.6*Math.random())*1,eo=(.2+.7*Math.random())*1,en=(.1+.5*Math.random())*1,ei=Math.random()*Math.PI*2,er=Math.random()*Math.PI*2,el=0,es=0,eu=0,ec=0,em=0,ef=(e,t,a)=>e+(t-e)*a,eh={x:0,y:0,inside:!0},ed=()=>{eh.inside=!1},ev=()=>{eh.inside=!1},ex=null;"hover"===s?(ex=e=>{let t,a,o,n;t=Math.max(1,window.innerWidth),a=Math.max(1,window.innerHeight),o=(e.clientX-.5*t)/(.5*t),n=(e.clientY-.5*a)/(.5*a),eh.x=Math.max(-1,Math.min(1,o)),eh.y=Math.max(-1,Math.min(1,n)),eh.inside=!0,ee()},window.addEventListener("pointermove",ex,{passive:!0}),window.addEventListener("mouseleave",ed),window.addEventListener("blur",ev),_.uniforms.uUseBaseWobble.value=0):"3drotate"===s?_.uniforms.uUseBaseWobble.value=0:_.uniforms.uUseBaseWobble.value=1;let eb=e=>{let t=(e-J)*.001;_.uniforms.iTime.value=t;let a=!0;if("hover"===s){ec=(eh.inside?-eh.x:0)*(.6*I),em=(eh.inside?eh.y:0)*(.6*I);let e=es,t=eu;el=ef(el,ec,L),es=ef(e,em,L),eu=ef(t,0,.1),_.uniforms.uRot.value=V(el,es,eu,K),Y&&1e-4>Math.abs(el-ec)&&1e-4>Math.abs(es-em)&&1e-4>Math.abs(eu)&&(a=!1)}else if("3drotate"===s){let e=t*F;el=e*eo,es=.6*Math.sin(e*ea+ei),eu=.5*Math.sin(e*en+er),_.uniforms.uRot.value=V(el,es,eu,K),F<1e-6&&(a=!1)}else K[0]=1,K[1]=0,K[2]=0,K[3]=0,K[4]=1,K[5]=0,K[6]=0,K[7]=0,K[8]=1,_.uniforms.uRot.value=K,F<1e-6&&(a=!1);if(W.render({scene:k}),y&&Z%6==0){let e=Math.floor(j.drawingBufferWidth/2),t=Math.floor(j.drawingBufferHeight/2);j.readPixels(e,t,1,1,j.RGBA,j.UNSIGNED_BYTE,Q),y({r:Q[0],g:Q[1],b:Q[2]})}Z++,X=a?requestAnimationFrame(eb):0};w&&new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)?ee():et()}).observe(t),ee();let ep=e=>{e.preventDefault(),et()},ew=()=>{ee()};return j.canvas.addEventListener("webglcontextlost",ep),j.canvas.addEventListener("webglcontextrestored",ew),()=>{et(),$.disconnect(),j.canvas.removeEventListener("webglcontextlost",ep),j.canvas.removeEventListener("webglcontextrestored",ew),"hover"===s&&ex&&window.removeEventListener("pointermove",ex),window.removeEventListener("mouseleave",ed),window.removeEventListener("blur",ev),j.canvas.parentElement===t&&t.removeChild(j.canvas)}},[e,l,s,u,m,c?.x,c?.y,h,f,d,v,g,x,b,p,w,M,y]),(0,t.jsx)("div",{className:"prism-container",ref:S})};function s(){return(0,t.jsxs)("div",{className:"absolute inset-0 overflow-hidden",style:{background:"#090909"},children:[(0,t.jsx)("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-breathe"}),(0,t.jsx)("div",{className:"absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] animate-breathe",style:{animationDelay:"1.5s"}}),(0,t.jsx)("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-breathe",style:{animationDelay:"0.8s"}}),(0,t.jsx)("div",{className:"absolute inset-0",children:[...Array(20)].map((e,a)=>(0,t.jsx)("div",{className:"absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-float",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,animationDelay:`${5*Math.random()}s`,animationDuration:`${4+6*Math.random()}s`,opacity:.2+.4*Math.random()}},a))})]})}class u extends a.default.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){}render(){return this.state.hasError?this.props.fallback:this.props.children}}e.s(["default",0,function({onBackgroundColor:e}){let[o,n]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),[c,m]=(0,a.useState)(!1);return((0,a.useEffect)(()=>{r(!0),m(window.matchMedia("(hover: none) and (pointer: coarse)").matches||window.innerWidth<768)},[]),(0,a.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||n(!0)}catch{n(!0)}},[]),i)?o?(0,t.jsx)(s,{}):(0,t.jsx)(u,{fallback:(0,t.jsx)(s,{}),children:(0,t.jsx)(l,{animationType:"hover",timeScale:.55,height:3.5,baseWidth:5.5,scale:c?2.5:3.2,hueShift:.35,colorFrequency:2.2,noise:.02,glow:c?1.5:1.8,bloom:c?1.1:1.5,hoverStrength:c?1.5:2.5,inertia:.06,transparent:!0,maxDpr:c?1.25:2,onBackgroundColor:e})}):null}],53470)},21674,e=>{e.n(e.i(53470))}]);