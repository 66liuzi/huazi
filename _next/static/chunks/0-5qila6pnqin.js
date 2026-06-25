(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20887,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(21663),n=e.i(53604),i=e.i(56850),l=e.i(80075);let r=({height:e=3.5,baseWidth:r=5.5,animationType:s="rotate",glow:u=1,offset:c={x:0,y:0},noise:m=.5,transparent:f=!0,scale:h=3.6,hueShift:v=0,colorFrequency:d=1,hoverStrength:b=2,inertia:x=.05,bloom:p=1,suspendWhenOffscreen:w=!1,timeScale:g=.5,maxDpr:M=2})=>{let S=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t=S.current;if(!t)return;let a=Math.max(.001,e),y=.5*Math.max(.001,r),E=Math.max(0,u),B=Math.max(0,m),T=c?.x??0,H=c?.y??0,C=Math.max(.001,h),P=Math.max(0,d||1),R=Math.max(0,p||1),A=Math.max(0,g||1),F=Math.max(0,b||1),I=Math.max(0,Math.min(1,x||.12)),L=Math.min(M,window.devicePixelRatio||1),j=new o.Renderer({dpr:L,alpha:f,antialias:!1}),q=j.gl;q.disable(q.DEPTH_TEST),q.disable(q.CULL_FACE),q.disable(q.BLEND),Object.assign(q.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),t.appendChild(q.canvas);let U=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,W=`
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

        const int STEPS = 80;
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

        // Breathing glow — multi-octave pulsing for organic brightness rhythm
        float breathe = 1.0 + 0.28 * (
          sin(iTime * uTimeScale * 0.37 + 0.7) *
          cos(iTime * uTimeScale * 0.53 - 0.3)
        );
        col = clamp(col * breathe, 0.0, 1.0);

        gl_FragColor = vec4(col, o.a);
      }
    `,N=new n.Triangle(q),z=new Float32Array(2),D=new Float32Array(2),O=new i.Program(q,{vertex:U,fragment:W,uniforms:{iResolution:{value:z},iTime:{value:0},uHeight:{value:a},uBaseHalf:{value:y},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:E},uOffsetPx:{value:D},uNoise:{value:B},uSaturation:{value:f?1.5:1},uScale:{value:C},uHueShift:{value:v||0},uColorFreq:{value:P},uBloom:{value:R},uCenterShift:{value:.25*a},uInvBaseHalf:{value:1/y},uInvHeight:{value:1/a},uMinAxis:{value:Math.min(y,a)},uPxScale:{value:1/(.1*(q.drawingBufferHeight||1)*C)},uTimeScale:{value:A}}}),_=new l.Mesh(q,{geometry:N,program:O}),k=()=>{let e=t.clientWidth||1,a=t.clientHeight||1;j.setSize(e,a),z[0]=q.drawingBufferWidth,z[1]=q.drawingBufferHeight,D[0]=T*L,D[1]=H*L,O.uniforms.uPxScale.value=1/(.1*(q.drawingBufferHeight||1)*C)},$=new ResizeObserver(k);$.observe(t),k();let G=new Float32Array(9),K=(e,t,a,o)=>{let n=Math.cos(e),i=Math.sin(e),l=Math.cos(t),r=Math.sin(t),s=Math.cos(a),u=Math.sin(a);return o[0]=n*s+i*r*u,o[1]=l*u,o[2]=-i*s+n*r*u,o[3]=-n*u+i*r*s,o[4]=l*s,o[5]=i*u+n*r*s,o[6]=i*l,o[7]=-r,o[8]=n*l,o},V=B<1e-6,X=0,Y=performance.now(),J=()=>{X||(X=requestAnimationFrame(ev))},Q=()=>{X&&(cancelAnimationFrame(X),X=0)},Z=(.3+.6*Math.random())*1,ee=(.2+.7*Math.random())*1,et=(.1+.5*Math.random())*1,ea=Math.random()*Math.PI*2,eo=Math.random()*Math.PI*2,en=0,ei=0,el=0,er=0,es=0,eu=(e,t,a)=>e+(t-e)*a,ec={x:0,y:0,inside:!0},em=()=>{ec.inside=!1},ef=()=>{ec.inside=!1},eh=null;"hover"===s?(eh=e=>{let t,a,o,n;t=Math.max(1,window.innerWidth),a=Math.max(1,window.innerHeight),o=(e.clientX-.5*t)/(.5*t),n=(e.clientY-.5*a)/(.5*a),ec.x=Math.max(-1,Math.min(1,o)),ec.y=Math.max(-1,Math.min(1,n)),ec.inside=!0,J()},window.addEventListener("pointermove",eh,{passive:!0}),window.addEventListener("mouseleave",em),window.addEventListener("blur",ef),O.uniforms.uUseBaseWobble.value=1):"3drotate"===s?O.uniforms.uUseBaseWobble.value=0:O.uniforms.uUseBaseWobble.value=1;let ev=e=>{let t=(e-Y)*.001;O.uniforms.iTime.value=t;let a=!0;if("hover"===s){let e=.08*Math.sin(.28*t),o=.25*Math.sin(.42*t+1.1)+.15*Math.cos(.73*t+3.4)+.1*Math.sin(.31*t+5.2),n=.08*Math.sin(.22*t+2.8);er=e+(ec.inside?-ec.x:0)*(.6*F),es=o+(ec.inside?ec.y:0)*(.6*F);let i=ei,l=el;en=eu(en,er,I),ei=eu(i,es,I),el=eu(l,n,.1),O.uniforms.uRot.value=K(en,ei,el,G),V&&1e-4>Math.abs(en-er)&&1e-4>Math.abs(ei-es)&&1e-4>Math.abs(el-n)&&(a=!1)}else if("3drotate"===s){let e=t*A;en=e*ee,ei=.6*Math.sin(e*Z+ea),el=.5*Math.sin(e*et+eo),O.uniforms.uRot.value=K(en,ei,el,G),A<1e-6&&(a=!1)}else G[0]=1,G[1]=0,G[2]=0,G[3]=0,G[4]=1,G[5]=0,G[6]=0,G[7]=0,G[8]=1,O.uniforms.uRot.value=G,A<1e-6&&(a=!1);j.render({scene:_}),X=a?requestAnimationFrame(ev):0};w&&new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)?J():Q()}).observe(t),J();let ed=e=>{e.preventDefault(),Q()},eb=()=>{J()};return q.canvas.addEventListener("webglcontextlost",ed),q.canvas.addEventListener("webglcontextrestored",eb),()=>{Q(),$.disconnect(),q.canvas.removeEventListener("webglcontextlost",ed),q.canvas.removeEventListener("webglcontextrestored",eb),"hover"===s&&eh&&window.removeEventListener("pointermove",eh),window.removeEventListener("mouseleave",em),window.removeEventListener("blur",ef),q.canvas.parentElement===t&&t.removeChild(q.canvas)}},[e,r,s,u,m,c?.x,c?.y,h,f,v,d,g,b,x,p,w]),(0,t.jsx)("div",{className:"prism-container",ref:S})};function s(){return(0,t.jsxs)("div",{className:"absolute inset-0 overflow-hidden",style:{background:"#090909"},children:[(0,t.jsx)("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-breathe"}),(0,t.jsx)("div",{className:"absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] animate-breathe",style:{animationDelay:"1.5s"}}),(0,t.jsx)("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-breathe",style:{animationDelay:"0.8s"}}),(0,t.jsx)("div",{className:"absolute inset-0",children:[...Array(20)].map((e,a)=>(0,t.jsx)("div",{className:"absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-float",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,animationDelay:`${5*Math.random()}s`,animationDuration:`${4+6*Math.random()}s`,opacity:.2+.4*Math.random()}},a))})]})}class u extends a.default.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){}render(){return this.state.hasError?this.props.fallback:this.props.children}}e.s(["default",0,function(){let[e,o]=(0,a.useState)(!1),[n,i]=(0,a.useState)(!1),[l,c]=(0,a.useState)(!1);return((0,a.useEffect)(()=>{i(!0),c(window.matchMedia("(hover: none) and (pointer: coarse)").matches||window.innerWidth<768)},[]),(0,a.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||o(!0)}catch{o(!0)}},[]),n)?e?(0,t.jsx)(s,{}):(0,t.jsx)(u,{fallback:(0,t.jsx)(s,{}),children:(0,t.jsx)(r,{animationType:"hover",timeScale:.55,height:3.5,baseWidth:5.5,scale:l?2.5:3.2,hueShift:.35,colorFrequency:2.2,noise:.02,glow:l?.8:1.1,bloom:l?.6:.8,hoverStrength:l?1.5:2.5,inertia:.06,transparent:!0,maxDpr:l?1.25:2})}):null}],20887)},61349,e=>{e.n(e.i(20887))}]);