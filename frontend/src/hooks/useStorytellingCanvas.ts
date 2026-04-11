import { useEffect, useRef } from 'react';
import type { ProductKey } from '../types';

const FRAME_START = 50;
const TOTAL_FRAMES = 192;

type FrameSets = Record<ProductKey, HTMLImageElement[]>;

const frameFolders: Record<ProductKey, string> = {
  shilajit: '/moon333',
  kashmiriSaffron: '/moon2222',
  iraniSaffron: '/ezgif-2fae6b36993927b6-jpg',
  kashmiriAlmonds: '/moon2222',
  walnuts: '/moon333',
  kashmiriGhee: '/ezgif-2fae6b36993927b6-jpg'
};

export function useStorytellingCanvas(activeProduct: ProductKey) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameSetsRef = useRef<FrameSets>({
    shilajit: [],
    kashmiriSaffron: [],
    iraniSaffron: [],
    kashmiriAlmonds: [],
    walnuts: [],
    kashmiriGhee: []
  });
  const loadedCountRef = useRef<Record<ProductKey, number>>({
    shilajit: 0,
    kashmiriSaffron: 0,
    iraniSaffron: 0,
    kashmiriAlmonds: 0,
    walnuts: 0,
    kashmiriGhee: 0
  });
  const currentFrameRef = useRef(FRAME_START);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const updateCanvasSize = () => {
      if (!canvasRef.current || !ctxRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvasRef.current.getBoundingClientRect();

      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      ctxRef.current.setTransform(1, 0, 0, 1, 0, 0);
      ctxRef.current.scale(dpr, dpr);
      canvasRef.current.style.width = `${rect.width}px`;
      canvasRef.current.style.height = `${rect.height}px`;

      drawFrame(currentFrameRef.current, activeProduct);
    };

    const preloadProductFrames = (product: ProductKey) => {
      if (frameSetsRef.current[product].length > 0) return;

      for (let i = 1; i <= TOTAL_FRAMES; i += 1) {
        const img = new Image();
        const frameNumber = String(i).padStart(3, '0');
        img.src = `${frameFolders[product]}/ezgif-frame-${frameNumber}.jpg`;
        img.onload = () => {
          loadedCountRef.current[product] += 1;
          if (product === activeProduct && (i === currentFrameRef.current + 1 || loadedCountRef.current[product] === TOTAL_FRAMES)) {
            drawFrame(currentFrameRef.current, activeProduct);
          }
        };

        frameSetsRef.current[product].push(img);
      }
    };

    const drawFrame = (frameIndex: number, product: ProductKey) => {
      const images = frameSetsRef.current[product];
      const img = images[frameIndex];
      const context = ctxRef.current;
      const targetCanvas = canvasRef.current;

      if (!img || !img.complete || !context || !targetCanvas) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = targetCanvas.width / dpr;
      const canvasHeight = targetCanvas.height / dpr;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const imgAspect = img.width / img.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const updateFrameOnScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = window.innerHeight * 0.2;
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
      const frameRange = TOTAL_FRAMES - FRAME_START;
      const frameIndex = FRAME_START + Math.floor(scrollFraction * frameRange);

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex, activeProduct);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        updateFrameOnScroll();
        ticking = false;
      });
      ticking = true;
    };

    preloadProductFrames(activeProduct);

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [activeProduct]);

  useEffect(() => {
    const images = frameSetsRef.current[activeProduct];
    if (!images.length) return;

    const current = images[currentFrameRef.current];
    if (current?.complete && canvasRef.current && ctxRef.current) {
      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = canvasRef.current.width / dpr;
      const canvasHeight = canvasRef.current.height / dpr;
      const imgAspect = current.width / current.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctxRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
      ctxRef.current.drawImage(current, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [activeProduct]);

  return canvasRef;
}
