(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[505],{505:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>v});var n=o(5155),i=o(2634),a=o(373),r=o(1519),l=o(3553),c=o(204),s=o(2115);function v({hue:e=0,hoverIntensity:t=.2,rotateOnHover:o=!0,forceHoverState:d=!1,backgroundColor:f="#000000"}){let h=(0,s.useRef)(null),m=`
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,g=`
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);
      
      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);
      
      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);
      
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
      
      return extractAlpha(finalCol);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;return(0,s.useEffect)(()=>{let n,s=h.current;if(!s)return;let v=window.matchMedia("(hover: none) and (pointer: coarse)").matches||window.innerWidth<768?1.5:2,p=new i.A({alpha:!0,premultipliedAlpha:!1,dpr:Math.min(v,window.devicePixelRatio||1)}),x=p.gl;x.clearColor(0,0,0,0),s.appendChild(x.canvas);let y=new a.l(x),b=new r.B(x,{vertex:m,fragment:g,uniforms:{iTime:{value:0},iResolution:{value:new l.e(x.canvas.width,x.canvas.height,x.canvas.width/x.canvas.height)},hue:{value:e},hover:{value:0},rot:{value:0},hoverIntensity:{value:t},backgroundColor:{value:u(f)}}}),w=new c.e(x,{geometry:y,program:b});function C(){if(!s)return;let e=Math.min(v,window.devicePixelRatio||1),t=s.clientWidth,o=s.clientHeight;0!==t&&0!==o&&(p.setSize(t*e,o*e),x.canvas.style.width=t+"px",x.canvas.style.height=o+"px",b.uniforms.iResolution.value.set(x.canvas.width,x.canvas.height,x.canvas.width/x.canvas.height))}window.addEventListener("resize",C);let I=new ResizeObserver(()=>C());I.observe(s),C();let z=0,R=0,q=!0,L=0,A=e=>{let t=s.getBoundingClientRect(),o=e.clientX-t.left,n=e.clientY-t.top,i=t.width,a=t.height,r=Math.min(i,a),l=(o-i/2)/r*2,c=(n-a/2)/r*2;z=+(.8>Math.sqrt(l*l+c*c))},k=()=>{z=0};s.addEventListener("mousemove",A),s.addEventListener("mouseleave",k);let E=!0,T=()=>{n&&(cancelAnimationFrame(n),n=0)},_=()=>{!n&&E&&(n=requestAnimationFrame(F))},F=i=>{if(!E)return;if(n=requestAnimationFrame(F),q){q=!1,R=i,p.render({scene:w});return}let a=Math.min((i-R)*.001,.1);R=i,b.uniforms.iTime.value=.001*i,b.uniforms.hue.value=e,b.uniforms.hoverIntensity.value=t,b.uniforms.backgroundColor.value=u(f);let r=d?1:z;b.uniforms.hover.value+=(r-b.uniforms.hover.value)*.1,o&&r>.5&&(L+=.3*a),b.uniforms.rot.value=L,p.render({scene:w})};n=requestAnimationFrame(F);let B=new IntersectionObserver(e=>{(E=e[0].isIntersecting)?_():T()},{threshold:0});B.observe(s);let K=e=>{e.preventDefault(),T()},M=()=>{E&&_()};return x.canvas.addEventListener("webglcontextlost",K),x.canvas.addEventListener("webglcontextrestored",M),()=>{T(),B.disconnect(),I.disconnect(),x.canvas.removeEventListener("webglcontextlost",K),x.canvas.removeEventListener("webglcontextrestored",M),window.removeEventListener("resize",C),s.removeEventListener("mousemove",A),s.removeEventListener("mouseleave",k),s.removeChild(x.canvas),x.getExtension("WEBGL_lose_context")?.loseContext()}},[e,t,o,d,f]),(0,n.jsx)("div",{ref:h,className:"orb-container"})}function u(e){if(e.startsWith("#")){let t=parseInt(e.slice(1,3),16)/255,o=parseInt(e.slice(3,5),16)/255,n=parseInt(e.slice(5,7),16)/255;return new l.e(t,o,n)}let t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(t)return new l.e(parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255);let o=e.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);return o?function(e,t,o){let n,i,a;if(0===t)n=i=a=o;else{let r=(e,t,o)=>(o<0&&(o+=1),o>1&&(o-=1),o<1/6)?e+(t-e)*6*o:o<.5?t:o<2/3?e+(t-e)*(2/3-o)*6:e,l=o<.5?o*(1+t):o+t-o*t,c=2*o-l;n=r(c,l,e+1/3),i=r(c,l,e),a=r(c,l,e-1/3)}return new l.e(n,i,a)}(parseInt(o[1])/360,parseInt(o[2])/100,parseInt(o[3])/100):new l.e(0,0,0)}o(4363)},4363:()=>{}}]);