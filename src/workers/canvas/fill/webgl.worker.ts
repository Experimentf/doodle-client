import { Coordinate } from '@/types/common';
import { convertHexToRGB } from '@/utils/colors';

import fragmentGLSL from './shaders/webgl/fragment.glsl';
import vertexGLSL from './shaders/webgl/vertex.glsl';

// Worker Fundamental
const fillWebGLWorker = self as unknown as Worker;

interface FillWebGLWorkerInput {
  imageData: ImageData;
  point: Coordinate;
  newColor: string;
  maxWidth: number;
  maxHeight: number;
}

fillWebGLWorker.onmessage = (event: MessageEvent<FillWebGLWorkerInput>) => {
  const { imageData, point, newColor, maxWidth, maxHeight } = event.data;
  const webglImageData = fillWithWebGL(
    imageData,
    point,
    newColor,
    maxWidth,
    maxHeight
  );
  fillWebGLWorker.postMessage(webglImageData);
};

function fillWithWebGL(
  imageData: ImageData,
  point: Coordinate,
  newColor: string,
  maxWidth: number,
  maxHeight: number
) {
  const { r, g, b } = convertHexToRGB(newColor);

  const offscreenCanvas = new OffscreenCanvas(maxWidth, maxHeight);

  const gl = offscreenCanvas.getContext('webgl') as WebGLRenderingContext;

  // Create and bind texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture properties
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Set the texture data to our canvas's original image data
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    maxWidth,
    maxHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imageData.data
  );

  // Create and bind a frame buffer to store render results
  const renderFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderFrameBuffer);

  // Create and bing a render buffer for rendering
  const renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, maxWidth, maxHeight);

  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.RENDERBUFFER,
    renderBuffer
  );

  // Create a vertex shader
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexGLSL);
  if (!vertexShader) return undefined;

  // Create a fragment shader
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentGLSL);
  if (!fragmentShader) return undefined;

  // Create a program with shaders
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) return undefined;
  gl.useProgram(program); // Set the current program

  // Create a position buffer to store vertex positions
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution'
  );
  gl.uniform2f(resolutionUniformLocation, maxWidth, maxHeight);

  const pointUniformLocation = gl.getUniformLocation(program, 'u_point');
  gl.uniform2f(pointUniformLocation, point.x, point.y);

  const fillColorUniformLocation = gl.getUniformLocation(
    program,
    'u_fillColor'
  );
  gl.uniform4f(fillColorUniformLocation, r, g, b, 255);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const readFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, readFrameBuffer);

  // Connect frame buffer to texture
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  const filledImageData = new Uint8Array(maxWidth * maxHeight * 4);
  gl.readPixels(
    0,
    0,
    maxWidth,
    maxHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    filledImageData
  );

  const newImageData = new ImageData(maxWidth, maxHeight);
  newImageData.data.set(filledImageData);
  return newImageData;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) return undefined;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return undefined;
  }
  return program;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  shaderSource: string
) {
  const shader = gl.createShader(type);

  if (!shader) return undefined;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(shader);
    console.error('SHADER COMPILATION ERROR:', errorMessage);
    gl.deleteShader(shader);
    return undefined;
  }
  return shader;
}

export default fillWebGLWorker;
