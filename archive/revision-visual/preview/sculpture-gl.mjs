// Native WebGL: smooth lighting on a segmented 3D symbol, no runtime dependency.
export function sculptureRenderer(canvas,mesh){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});
  if(!gl)return null;
  const vertex=`precision highp float;
    attribute vec3 position;attribute vec3 normal;attribute vec2 fragment;
    uniform vec3 rotation;uniform vec2 scale;uniform float intro;uniform float progress;
    varying vec3 N;varying vec3 P;varying float opacity;
    vec3 turn(vec3 p,vec3 r){float c=cos(r.x),s=sin(r.x);p.yz=mat2(c,s,-s,c)*p.yz;c=cos(r.y);s=sin(r.y);p.xz=mat2(c,-s,s,c)*p.xz;c=cos(r.z);s=sin(r.z);p.xy=mat2(c,s,-s,c)*p.xy;return p;}
    void main(){float arrival=smoothstep(fragment.x*.028,.65+fragment.x*.028,intro);float split=1.-arrival;vec3 p=position+vec3(cos(fragment.y)*split*.95,sin(fragment.y)*split*.95,split*(mod(fragment.x,2.)>.5?1.9:-1.2));
    vec3 r=rotation+vec3(0.,0.,split*.75);p=turn(p,r);N=turn(normal,r);P=p;opacity=smoothstep(0.,.22,intro)*(.35+.65*arrival);
    float perspective=4.8/(4.8-p.z);gl_Position=vec4(p.x*scale.x*perspective,-p.y*scale.y*perspective+.03,-p.z*.13,1.);}
  `;
  const fragment=`precision highp float;varying vec3 N;varying vec3 P;varying float opacity;
    void main(){vec3 n=normalize(N);vec3 v=normalize(vec3(0.,0.,4.8)-P);
    vec3 l=normalize(vec3(-.7,-.8,1.5));vec3 l2=normalize(vec3(.9,.4,.7));
    float diffuse=max(dot(n,l),0.);float side=max(dot(n,l2),0.);float fresnel=pow(1.-abs(dot(n,v)),3.);
    float spec=pow(max(dot(n,normalize(l+v)),0.),55.);float edge=pow(max(dot(n,normalize(l2+v)),0.),80.);
    vec3 color=vec3(.025,.055,.007)+vec3(.23,.44,.025)*(diffuse*.72+side*.12)+vec3(.86,1.,.59)*spec*1.4+vec3(.54,.93,.25)*edge*.8+vec3(.12,.3,.015)*fresnel*.45;
    color=pow(color,vec3(.72));gl_FragColor=vec4(color,opacity);}
  `;
  function shader(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
  const data=[];
  function normalAt(p,face){if(face.cap)return face.n;if(face.sphere){const n=[p[0]-1.07,p[1],p[2]-.1],length=Math.hypot(...n);return n.map(v=>v/length);}const a=Math.atan2(p[1],p[0]);return [(p[0]-Math.cos(a)*1.06)/.205,(p[1]-Math.sin(a)*1.06)/.205,p[2]/.205];}
  for(const face of mesh)for(const index of [0,1,2,0,2,3]){const p=face.v[index];data.push(...p,...normalAt(p,face),face.group,face.a);}
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.useProgram(program);
  for(const [name,size,offset]of [['position',3,0],['normal',3,3],['fragment',2,6]]){const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,32,offset*4);}
  const rotation=gl.getUniformLocation(program,'rotation'),scale=gl.getUniformLocation(program,'scale'),intro=gl.getUniformLocation(program,'intro');
  gl.frontFace(gl.CW);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
  return {resize(width,height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);},draw({rx,ry,rz,scaleX,scaleY,arrival}){gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform3f(rotation,rx,ry,rz);gl.uniform2f(scale,scaleX,scaleY);gl.uniform1f(intro,arrival);gl.drawArrays(gl.TRIANGLES,0,data.length/8);},dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);}};
}
