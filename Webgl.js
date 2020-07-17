/*
precision is how many float point the shader has
vec[int] is a vector of int values
uniforms are constants between shaders
attribute static variable?
varying dynamic variables?
*/
const vertexShaderText = `
attribute vec2 position;
attribute vec3 vertColor;
varying vec3 fragColor;
void main() {
  fragColor = vertColor;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const fragmentShaderText = `
precision mediump float;
varying vec3 fragColor;
void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}
`;
//js arrays are a default 64 float while webgl is expecting 32
const vert = new Float32Array([
  -0.5,  0.5,
  -0.5, -0.5,
   0.5, -0.5,
]);
const vertColor = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  ]);
const can = document.createElement("canvas");
const gl = can.getContext("webgl2");
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();
//buffer(creates memory for gpu)
const vertBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

//Resize window
document.body.appendChild(can);
can.width = window.innerWidth;
can.height = window.innerHeight;
gl.viewport(0, 0, can.width, can.height);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

//shaders
gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
//if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) console.error("Error", gl.getShaderInfoLog(vertexShader));
gl.compileShader(fragmentShader);

//program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// program.position = gl.getAttribLocation(program, "position");
//gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);
const positionAttribLocation = gl.getAttribLocation(program, "position");
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

// program.color = gl.getUniformLocation(program, "color");
// gl.uniform4fv(program.color, [0, 1, 0, 1.0]);
const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertColor, gl.STATIC_DRAW);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorAttribLocation);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);