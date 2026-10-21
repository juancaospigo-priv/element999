precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform float uBrand;
uniform float uReveal;
uniform float uTurbulence;
uniform float uDepth;
uniform vec2 uMouse;
uniform vec2 uDrag;
uniform float uMouseStrength;
uniform vec2 uOrigin;
uniform vec4 uBrandRect;
uniform sampler2D uBrandMask;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash21(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 31.32);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.,0.));
  float c = hash21(i + vec2(0.,1.)), d = hash21(i + vec2(1.,1.));
  return mix(mix(a,b,s.x), mix(c,d,s.x), s.y);
}

float fbm(vec2 p) {
  float value = 0., amplitude = .5;
  mat2 turn = mat2(.8, .6, -.6, .8);
  for (int i=0; i<3; i++) {
    value += amplitude * noise(p);
    p = turn * p * 1.87 + vec2(3.7,9.2);
    amplitude *= .5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 ratio = vec2(aspect, 1.);
  vec2 p = (vUv - .5) * ratio * 1.85;
  vec2 pointer = (uMouse - .5) * ratio * 1.85;
  vec2 delta = p - pointer;
  float influence = exp(-dot(delta,delta) * 2.2);
  p -= uDrag * ratio * influence * 2.8;
  p += vec2(-delta.y,delta.x) * influence * uMouseStrength * .6;

  float t = uTime;
  float warp = uTurbulence * mix(.58,1.45,uProgress);
  vec2 q = vec2(fbm(p + vec2(.18*t, -.12*t)),
                fbm(p + vec2(4.2,1.3) + vec2(-.13*t,.1*t)));
  vec2 r = vec2(fbm(p + q * 2.6 * warp + vec2(1.7,9.2) + .25*t),
                fbm(p + q * 2.4 * warp + vec2(8.3,2.8) - .21*t));
  vec2 domain = p + r * 2.7 * warp + q * .5;
  float field = fbm(domain + vec2(.09*t, -.08*t));
  float h = clamp(field * 1.25 + .16 * length(q-r),0.,1.);

  // Screen-space derivatives give the noise surface a normal without three extra FBM passes.
  vec2 slope;
  #ifdef USE_DERIVATIVES
    slope = vec2(dFdx(h),dFdy(h)) * uResolution.y * .018;
  #else
    float e = .018;
    slope = vec2(noise(domain+vec2(e,0.))-noise(domain-vec2(e,0.)),
                 noise(domain+vec2(0.,e))-noise(domain-vec2(0.,e))) * 2.2;
  #endif
  vec3 N = normalize(vec3(-slope * uDepth, .75));
  vec3 L = normalize(vec3(-.45,.65,1.2));
  vec3 H = normalize(L + vec3(0.,0.,1.));
  float spec = pow(max(dot(N,H),0.),38.);
  float fresnel = pow(1.-max(N.z,0.),3.);

  float saturation = mix(.12,1.,smoothstep(0.,.85,uProgress));
  vec3 ink = mix(uColor0,uColor1,smoothstep(.08,.67,h));
  ink = mix(ink,uColor2,smoothstep(.35,.76,h)*saturation);
  ink = mix(ink,uColor3,smoothstep(.65,.91,h)*saturation*.85);
  ink *= .5 + .5*max(dot(N,L),0.);
  ink += uColor3 * (spec*.22 + fresnel*.08) * mix(.15,1.,uProgress);
  ink *= mix(.34,1.,smoothstep(0.,.8,uProgress));

  // The brand is a sampled font mask filled by this same moving substance.
  vec2 textUv = (vUv-uBrandRect.xy) / uBrandRect.zw + .5;
  float inside = step(0.,textUv.x)*step(textUv.x,1.)*step(0.,textUv.y)*step(textUv.y,1.);
  vec2 liquidTextUv = textUv + (r-.5) * .065 * (1.-uBrand);
  float mask = texture2D(uBrandMask,clamp(liquidTextUv,0.,1.)).r * inside;
  float inkArrival = smoothstep(1.-uBrand*.96,1.08-uBrand*.96,field);
  float brandShape = smoothstep(.25,.85,mask) * smoothstep(0.,.35,uBrand) * inkArrival;
  vec3 brandInk = mix(uColor2,uColor3,smoothstep(.25,.78,h));
  brandInk += vec3(spec*.16);
  ink *= 1.-uBrand*.72;
  ink = mix(ink,brandInk,brandShape);

  // An irregular transparent pool expands through the liquid and reveals the real page below.
  float distanceToOrigin = length((vUv-uOrigin)*ratio);
  float edge = fbm((vUv-.5)*ratio*4. + r + t*.07);
  float maxRadius = length(ratio)*1.15;
  float radius = mix(-.22,maxRadius,uReveal) + (edge-.5)*.23*sin(uReveal*3.14159265);
  float alpha = smoothstep(radius-.045,radius+.045,distanceToOrigin);
  if (uReveal<=0.) alpha=1.;
  gl_FragColor = vec4(max(ink,vec3(0.)),alpha);
}
