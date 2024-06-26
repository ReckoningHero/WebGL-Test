// Vertex shader source code
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
  }`;

// Fragment shader source code
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_Color;
  void main(){
    gl_FragColor = u_Color;
  }`;

// Array of colors
var colors = [
  [1.0, 0.0, 0.0, 1.0], // Red
  [0.0, 1.0, 0.0, 1.0], // Green
  [0.0, 0.0, 1.0, 1.0]  // Blue
];

// Index to keep track of current color
var currentColorIndex = 0;
var vertexBuffer; // Buffer for storing vertex data

function main(){
  // Retrieve the canvas element
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  // Check if WebGL context was successfully retrieved
  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  // Initialize shaders
  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  // Initialize vertex buffer
  vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Get the storage location of attribute variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Set up click event listener
  canvas.onmousedown = function(ev){ 
    click(ev, gl, canvas, a_Position); 
  };

  // Set clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev, gl, canvas, a_Position){
  // Check if we need to reset the color index
  if(currentColorIndex >= colors.length){
    currentColorIndex = 0;
  }

  // Set the color
  var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  gl.uniform4fv(u_Color, colors[currentColorIndex]);
  currentColorIndex++;

  // Calculate the coordinates relative to canvas
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Define the vertices of the triangle
  var vertices = new Float32Array([
    x + 0.1, y - 0.1, 0.0,
    x + 0.1, y + 0.1, 0.0,
    x - 0.1, y - 0.1, 0.0
  ]);

  // Update vertex buffer data
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Clear canvas and draw the triangle
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}


  
function rightclick(ev, gl){
  if(g_points[index]){
    index++;
  }
  angle += 10.0;
  draw(gl);
}

function initVertexBuffers(gl, vertices, colors){
  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
    console.log('Failed to get location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  //Translation
  /*var transformMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.5,
    0.0, 1.0, 0.0, -0.2,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);*/
  var radian = angle * Math.PI / 180.0;
  var cosB = Math.cos(radian);
  var sinB = Math.sin(radian);
  var transformMatrix = new Float32Array([
    cosB, -sinB, 0.0, 0.0,
    sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  var u_TransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix');
  if(!u_TransformMatrix){ console.log('Failed to get location of u_TransformMatrix'); }
  gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(!a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  //gl.uniform4f(u_FragColor, 1.0, 0.0 + (index / 3.0), 0.0, 1.0);
  return n;
}

var index = 0;
var angle = 0.0;
var g_points = [];
var g_colors = [];
function click(ev, gl, canvas){
  if(ev.buttons == 1){
    var x = ev.clientX;
    var y = ev.clientY;
    var z = 0.0;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    if(ev.ctrlKey){
      z = -0.5;
    }else if(ev.shiftKey){
      z = -1.0;
    }

    if(g_points.length <= index){
      var arrayPoints = [];
      g_points.push(arrayPoints);
      var arrayColors = [];
      g_colors.push(arrayColors);
    }

    g_points[index].push(x);
    g_points[index].push(y);
    g_points[index].push(z);

    g_colors[index].push(50);
    g_colors[index].push(50);
    g_colors[index].push(50);

    draw(gl);
  }
}

function draw(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < g_points.length; i++){
    var n = initVertexBuffers(gl, new Float32Array(g_points[i]), new Float32Array(g_colors[i])) / 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}
