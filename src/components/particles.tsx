'use client';
import React, { useRef, useEffect } from 'react';
import { useMousePosition } from '@/utils/mouse';

interface ParticlesProps {
  className?: string;
  quantity?: number;
}

// 顶点着色器
const vertexShader = `
  attribute vec2 position;
  attribute float size;
  attribute float alpha;
  
  uniform vec2 resolution;
  uniform vec2 mousePos;
  uniform float dpr;
  uniform float time;
  
  varying float vAlpha;
  varying float vGlow;
  
  void main() {
    vec2 pos = position;
    vec2 mouse = mousePos;
    vec2 normPos = pos;
    
    // 减小作用范围和力度
    float dist = distance(normPos, mouse) / dpr;
    float force = max(0.0, 1.0 - dist * 0.005); // 增大系数以减小作用范围
    force = force * force * (3.0 - 2.0 * force); // 保持平滑过渡
    
    // 减小光晕范围
    float glow = smoothstep(100.0, 0.0, dist); // 从200降到100
    vGlow = glow * 0.3; // 降低光晕强度
    
    // 减小力的作用强度
    vec2 dir = normalize(mouse - normPos);
    pos += dir * force * 30.0 * dpr; // 从50降到30
    
    // 位置转换
    vec2 clipSpace = (pos / resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    
    // 减小粒子大小变化
    gl_PointSize = size * dpr * (1.0 + force * 0.3); // 从0.5降到0.3
    vAlpha = alpha * (1.0 - force * 0.2); // 从0.3降到0.2
  }
`;

// 片段着色器
const fragmentShader = `
  precision highp float;
  varying float vAlpha;
  varying float vGlow;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // 基础粒子
    float alpha = smoothstep(0.5, 0.4, dist) * vAlpha;
    
    // 光晕效果
    float glow = exp(-dist * 3.0) * vGlow;
    vec3 color = vec3(1.0);
    color += glow * vec3(0.8, 0.9, 1.0);
    
    gl_FragColor = vec4(color, alpha + glow);
  }
`;

export default function Particles({ className = '', quantity = 500 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();
  const mouse = useRef({ x: 0, y: 0 });
  const particlesData = useRef<{
    positions: Float32Array;
    sizes: Float32Array;
    alphas: Float32Array;
    velocities: Float32Array;
  }>();
  const glRef = useRef<WebGLRenderingContext>();
  const programRef = useRef<WebGLProgram>();
  const animationFrameId = useRef<number>();

  // 初始化 WebGL
  const initGL = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // 创建着色器程序
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    programRef.current = program;
    gl.useProgram(program);

    // 初始化粒子数据
    initParticles();
    setupBuffers(gl, program);
  };

  // 创建着色器程序
  const createProgram = (
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  };

  // 创建着色器
  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // 初始化粒子数据
  const initParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const positions = new Float32Array(quantity * 2);
    const sizes = new Float32Array(quantity);
    const alphas = new Float32Array(quantity);
    const velocities = new Float32Array(quantity * 2);

    // 计算网格大小
    const cols = Math.floor(Math.sqrt(quantity));
    const rows = Math.ceil(quantity / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let i = 0; i < quantity; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const i2 = i * 2;

      // 在网格内随机分布，但保持一定的均匀性
      positions[i2] = (col + 0.2 + Math.random() * 0.6) * cellWidth;
      positions[i2 + 1] = (row + 0.2 + Math.random() * 0.6) * cellHeight;

      // 随机大小，但保持在合理范围内
      sizes[i] = Math.random() * 1.5 + 0.5;

      // 随机透明度，但避免过于透明
      alphas[i] = Math.random() * 0.4 + 0.1;

      // 随机速度，但控制在较小范围内
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.1 + 0.05;
      velocities[i2] = Math.cos(angle) * speed;
      velocities[i2 + 1] = Math.sin(angle) * speed;
    }

    particlesData.current = { positions, sizes, alphas, velocities };
  };

  // 设置缓冲区
  const setupBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!particlesData.current) return;
    const { positions, sizes, alphas } = particlesData.current;

    // 位置缓冲区
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // 大小缓冲区
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const sizeLoc = gl.getAttribLocation(program, 'size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // 透明度缓冲区
    const alphaBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
    const alphaLoc = gl.getAttribLocation(program, 'alpha');
    gl.enableVertexAttribArray(alphaLoc);
    gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0);
  };

  // 更新粒子位置
  const updateParticles = () => {
    if (!particlesData.current || !canvasRef.current) return;
    const { positions, velocities } = particlesData.current;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    for (let i = 0; i < quantity; i++) {
      const i2 = i * 2;

      // 更新位置
      positions[i2] += velocities[i2];
      positions[i2 + 1] += velocities[i2 + 1];

      // 边界处理：使用环绕而不是随机重置
      if (positions[i2] < 0) {
        positions[i2] = width;
      } else if (positions[i2] > width) {
        positions[i2] = 0;
      }

      if (positions[i2 + 1] < 0) {
        positions[i2 + 1] = height;
      } else if (positions[i2 + 1] > height) {
        positions[i2 + 1] = 0;
      }

      // 添加轻微的随机运动
      velocities[i2] += (Math.random() - 0.5) * 0.01;
      velocities[i2 + 1] += (Math.random() - 0.5) * 0.01;

      // 限制速度范围
      const speed = Math.sqrt(velocities[i2] ** 2 + velocities[i2 + 1] ** 2);
      if (speed > 0.2) {
        velocities[i2] *= 0.2 / speed;
        velocities[i2 + 1] *= 0.2 / speed;
      }
    }
  };

  // 渲染循环
  const render = () => {
    if (!glRef.current || !programRef.current || !canvasRef.current || !particlesData.current)
      return;

    const gl = glRef.current;
    const program = programRef.current;

    // 更新粒子位置
    updateParticles();

    // 更新位置缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, particlesData.current.positions, gl.DYNAMIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // 设置 uniform 变量
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionLoc, canvasRef.current.width, canvasRef.current.height);

    const mousePosLoc = gl.getUniformLocation(program, 'mousePos');
    gl.uniform2f(mousePosLoc, mouse.current.x, mouse.current.y);

    const dprLoc = gl.getUniformLocation(program, 'dpr');
    gl.uniform1f(dprLoc, window.devicePixelRatio || 1);

    // 清除画布并绘制
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, quantity);

    animationFrameId.current = requestAnimationFrame(render);
  };

  // 处理鼠标移动
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    mouse.current = {
      x: (mousePosition.x - rect.left) * dpr,
      y: (mousePosition.y - rect.top) * dpr,
    };
  }, [mousePosition]);

  // 初始化和清理
  useEffect(() => {
    initGL();
    render();

    const handleResize = () => {
      if (!canvasRef.current || !glRef.current) return;

      const canvas = canvasRef.current;
      const gl = glRef.current;
      const dpr = window.devicePixelRatio || 1;

      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
