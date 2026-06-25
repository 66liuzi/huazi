(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20887,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(21663),n=e.i(53604),i=e.i(56850),l=e.i(80075);let r=({height:e=3.5,baseWidth:r=5.5,animationType:s="rotate",glow:u=1,offset:c={x:0,y:0},noise:m=.5,transparent:f=!0,scale:v=3.6,hueShift:h=0,colorFrequency:d=1,hoverStrength:b=2,inertia:x=.05,bloom:p=1,suspendWhenOffscreen:w=!1,timeScale:g=.5})=>{let M=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t=M.current;if(!t)return;let a=Math.max(.001,e),y=.5*Math.max(.001,r),S=Math.max(0,u),E=Math.max(0,m),B=c?.x??0,H=c?.y??0,C=Math.max(.001,v),P=Math.max(0,d||1),T=Math.max(0,p||1),R=Math.max(0,g||1),A=Math.max(0,b||1),F=Math.max(0,Math.min(1,x||.12)),I=Math.min(2,window.devicePixelRatio||1),L=new o.Renderer({dpr:I,alpha:f,antialias:!1}),j=L.gl;j.disable(j.DEPTH_TEST),j.disable(j.CULL_FACE),j.disable(j.BLEND),Object.assign(j.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),t.appendChild(j.canvas);let q=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,U=`
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
    `,W=new n.Triangle(j),N=new Float32Array(2),z=new Float32Array(2),O=new i.Program(j,{vertex:q,fragment:U,uniforms:{iResolution:{value:N},iTime:{value:0},uHeight:{value:a},uBaseHalf:{value:y},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:S},uOffsetPx:{value:z},uNoise:{value:E},uSaturation:{value:f?1.5:1},uScale:{value:C},uHueShift:{value:h||0},uColorFreq:{value:P},uBloom:{value:T},uCenterShift:{value:.25*a},uInvBaseHalf:{value:1/y},uInvHeight:{value:1/a},uMinAxis:{value:Math.min(y,a)},uPxScale:{value:1/(.1*(j.drawingBufferHeight||1)*C)},uTimeScale:{value:R}}}),D=new l.Mesh(j,{geometry:W,program:O}),_=()=>{let e=t.clientWidth||1,a=t.clientHeight||1;L.setSize(e,a),N[0]=j.drawingBufferWidth,N[1]=j.drawingBufferHeight,z[0]=B*I,z[1]=H*I,O.uniforms.uPxScale.value=1/(.1*(j.drawingBufferHeight||1)*C)},k=new ResizeObserver(_);k.observe(t),_();let $=new Float32Array(9),G=(e,t,a,o)=>{let n=Math.cos(e),i=Math.sin(e),l=Math.cos(t),r=Math.sin(t),s=Math.cos(a),u=Math.sin(a);return o[0]=n*s+i*r*u,o[1]=l*u,o[2]=-i*s+n*r*u,o[3]=-n*u+i*r*s,o[4]=l*s,o[5]=i*u+n*r*s,o[6]=i*l,o[7]=-r,o[8]=n*l,o},K=E<1e-6,V=0,X=performance.now(),Y=()=>{V||(V=requestAnimationFrame(ev))},J=()=>{V&&(cancelAnimationFrame(V),V=0)},Q=(.3+.6*Math.random())*1,Z=(.2+.7*Math.random())*1,ee=(.1+.5*Math.random())*1,et=Math.random()*Math.PI*2,ea=Math.random()*Math.PI*2,eo=0,en=0,ei=0,el=0,er=0,es=(e,t,a)=>e+(t-e)*a,eu={x:0,y:0,inside:!0},ec=()=>{eu.inside=!1},em=()=>{eu.inside=!1},ef=null;"hover"===s?(ef=e=>{let t,a,o,n;t=Math.max(1,window.innerWidth),a=Math.max(1,window.innerHeight),o=(e.clientX-.5*t)/(.5*t),n=(e.clientY-.5*a)/(.5*a),eu.x=Math.max(-1,Math.min(1,o)),eu.y=Math.max(-1,Math.min(1,n)),eu.inside=!0,Y()},window.addEventListener("pointermove",ef,{passive:!0}),window.addEventListener("mouseleave",ec),window.addEventListener("blur",em),O.uniforms.uUseBaseWobble.value=0):"3drotate"===s?O.uniforms.uUseBaseWobble.value=0:O.uniforms.uUseBaseWobble.value=1;let ev=e=>{let t=(e-X)*.001;O.uniforms.iTime.value=t;let a=!0;if("hover"===s){el=(eu.inside?-eu.x:0)*(.6*A),er=(eu.inside?eu.y:0)*(.6*A);let e=en,t=ei;eo=es(eo,el,F),en=es(e,er,F),ei=es(t,0,.1),O.uniforms.uRot.value=G(eo,en,ei,$),K&&1e-4>Math.abs(eo-el)&&1e-4>Math.abs(en-er)&&1e-4>Math.abs(ei)&&(a=!1)}else if("3drotate"===s){let e=t*R;eo=e*Z,en=.6*Math.sin(e*Q+et),ei=.5*Math.sin(e*ee+ea),O.uniforms.uRot.value=G(eo,en,ei,$),R<1e-6&&(a=!1)}else $[0]=1,$[1]=0,$[2]=0,$[3]=0,$[4]=1,$[5]=0,$[6]=0,$[7]=0,$[8]=1,O.uniforms.uRot.value=$,R<1e-6&&(a=!1);L.render({scene:D}),V=a?requestAnimationFrame(ev):0};w&&new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)?Y():J()}).observe(t),Y();let eh=e=>{e.preventDefault(),J()},ed=()=>{Y()};return j.canvas.addEventListener("webglcontextlost",eh),j.canvas.addEventListener("webglcontextrestored",ed),()=>{J(),k.disconnect(),j.canvas.removeEventListener("webglcontextlost",eh),j.canvas.removeEventListener("webglcontextrestored",ed),"hover"===s&&ef&&window.removeEventListener("pointermove",ef),window.removeEventListener("mouseleave",ec),window.removeEventListener("blur",em),j.canvas.parentElement===t&&t.removeChild(j.canvas)}},[e,r,s,u,m,c?.x,c?.y,v,f,h,d,g,b,x,p,w]),(0,t.jsx)("div",{className:"prism-container",ref:M})};function s(){return(0,t.jsxs)("div",{className:"absolute inset-0 overflow-hidden",style:{background:"#090909"},children:[(0,t.jsx)("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-breathe"}),(0,t.jsx)("div",{className:"absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] animate-breathe",style:{animationDelay:"1.5s"}}),(0,t.jsx)("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-breathe",style:{animationDelay:"0.8s"}}),(0,t.jsx)("div",{className:"absolute inset-0",children:[...Array(20)].map((e,a)=>(0,t.jsx)("div",{className:"absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-float",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,animationDelay:`${5*Math.random()}s`,animationDuration:`${4+6*Math.random()}s`,opacity:.2+.4*Math.random()}},a))})]})}class u extends a.default.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){}render(){return this.state.hasError?this.props.fallback:this.props.children}}e.s(["default",0,function(){let[e,o]=(0,a.useState)(!1),[n,i]=(0,a.useState)(!1);return((0,a.useEffect)(()=>{i(!0)},[]),(0,a.useEffect)(()=>{try{let e=document.createElement("canvas");e.getContext("webgl")||e.getContext("experimental-webgl")||o(!0)}catch{o(!0)}},[]),n)?e?(0,t.jsx)(s,{}):(0,t.jsx)(u,{fallback:(0,t.jsx)(s,{}),children:(0,t.jsx)(r,{animationType:"hover",timeScale:.4,height:3.5,baseWidth:5.5,scale:3,hueShift:.8,colorFrequency:1.2,noise:0,glow:1.2,bloom:1,hoverStrength:2.5,inertia:.06,transparent:!0})}):null}],20887)},61349,e=>{e.n(e.i(20887))}]);