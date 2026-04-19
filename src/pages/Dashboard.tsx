import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Zap, AlertTriangle, ShieldCheck, Crosshair, BarChart3, Clock, Info } from 'lucide-react';
import { detectDiseases, DetectionResult } from '../lib/gemini';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setDetections([]);
    setInferenceTime(0);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUri(result);

      const img = new Image();
      img.onload = () => {
        setImageObj(img);
      };
      img.src = result;

      // Run inference
      runInference(result, file.type);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'image/webp': ['.webp'] },
    maxFiles: 1,
  } as any);

  const runInference = async (base64String: string, mimeType: string) => {
    setIsDetecting(true);
    const start = performance.now();
    try {
      const results = await detectDiseases(base64String, mimeType);
      setDetections(results);
    } catch (err) {
      console.error(err);
      setError("Inference failed. Ensure API keys are valid or try another image.");
    } finally {
      const end = performance.now();
      setInferenceTime(end - start);
      setIsDetecting(false);
    }
  };

  const drawOverlay = useCallback(() => {
    if (!canvasRef.current || !imageObj || !canvasContainerRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const containerWidth = canvasContainerRef.current.clientWidth;
    const containerHeight = canvasContainerRef.current.clientHeight;

    const scale = Math.min(containerWidth / imageObj.width, containerHeight / imageObj.height);
    const scaledWidth = imageObj.width * scale;
    const scaledHeight = imageObj.height * scale;

    canvasRef.current.width = scaledWidth;
    canvasRef.current.height = scaledHeight;

    // Draw Image
    ctx.drawImage(imageObj, 0, 0, scaledWidth, scaledHeight);

    // Draw Detections
    if (isDetecting) {
      const t = Date.now() / 1000;
      const scanY = (Math.sin(t * 2) * 0.5 + 0.5) * scaledHeight;
      ctx.fillStyle = 'rgba(0, 255, 102, 0.2)';
      ctx.fillRect(0, 0, scaledWidth, scanY);
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(scaledWidth, scanY);
      ctx.stroke();
      requestAnimationFrame(drawOverlay);
      return;
    }

    detections.forEach((det) => {
      const [ymin, xmin, ymax, xmax] = det.bbox;
      const x = Math.max(0, xmin * scaledWidth);
      const y = Math.max(0, ymin * scaledHeight);
      const w = Math.min(scaledWidth - x, (xmax - xmin) * scaledWidth);
      const h = Math.min(scaledHeight - y, (ymax - ymin) * scaledHeight);

      const isDisease = !det.label.toLowerCase().includes('healthy') && !det.label.toLowerCase().includes('normal');
      const boxColor = isDisease ? '#ff3366' : '#00ff66';

      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      
      ctx.shadowColor = boxColor;
      ctx.shadowBlur = 10;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      const labelText = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
      ctx.font = 'bold 12px "JetBrains Mono"';
      const textMetrics = ctx.measureText(labelText);
      const textWidth = textMetrics.width;

      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y > 24 ? y - 24 : y, textWidth + 12, 24);

      ctx.fillStyle = '#161616';
      ctx.fillText(labelText, x + 6, (y > 24 ? y - 24 : y) + 16);
    });
  }, [imageObj, detections, isDetecting]);

  useEffect(() => {
    let animationFrame: number;
    if (isDetecting || imageObj) {
      drawOverlay();
      if (isDetecting) {
         animationFrame = requestAnimationFrame(drawOverlay);
      }
    }
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [drawOverlay, isDetecting, imageObj]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-1 overflow-hidden"
    >
      {/* Left Sidebar - Controls */}
      <aside className="w-72 flex flex-col border-r border-[#2b2b2b] bg-[#101010]">
        <div className="panel-header flex items-center justify-between">
          <span>Input Source</span>
          <ImageIcon className="h-4 w-4" />
        </div>
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div 
            {...getRootProps()} 
            className={cn(
              "flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all",
              isDragActive ? "border-[#00ff66] bg-[rgba(0,255,102,0.05)]" : "border-[#2b2b2b] bg-[#161616] hover:border-[#444]"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className={cn("mb-4 h-12 w-12", isDragActive ? "text-[#00ff66]" : "text-[#555]")} />
            <p className="font-mono text-sm text-[#909090]">Drag & drop an image</p>
            <p className="mt-2 text-xs text-[#00ff66]">Browse locally</p>
            <p className="mt-2 font-mono text-[10px] text-[#555]">JPG, PNG supported</p>
          </div>
        </div>
      </aside>

      {/* Center Canvas Area */}
      <section className="flex flex-1 flex-col bg-[#080808]">
        <div className="panel-header flex items-center justify-between border-b border-[#2b2b2b] bg-[#101010]">
          <span>Live Detection Feed</span>
          <Crosshair className="h-4 w-4" />
        </div>
        <div className="relative flex flex-1 items-center justify-center p-4" ref={canvasContainerRef}>
          {!imageUri && !isDragActive && (
              <div className="flex flex-col items-center justify-center text-[#555]">
                <ImageIcon className="mb-4 h-16 w-16" />
                <p className="font-mono text-sm">Awaiting video or image sequence...</p>
              </div>
          )}
          {error && (
            <div className="absolute top-4 left-4 right-4 z-10 bg-[#ff3366]/20 border border-[#ff3366] text-[#ff3366] px-4 py-3 rounded text-sm font-mono flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> {error}
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className={cn("max-h-full max-w-full rounded shadow-2xl transition-opacity", 
              isDetecting ? "opacity-80" : "opacity-100", 
              imageUri ? "block" : "hidden"
            )} 
          />
        </div>
      </section>

      {/* Right Sidebar - Logic & Data */}
      <aside className="w-[360px] flex flex-col border-l border-[#2b2b2b] bg-[#101010]">
        
        {/* Top Half: Detection List */}
        <div className="flex flex-col flex-1 max-h-[50%] overflow-hidden border-b border-[#2b2b2b]">
          <div className="panel-header flex items-center justify-between shadow-sm">
            <span>Detection Results</span>
            <BarChart3 className="h-4 w-4" />
          </div>
          
          <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-[100px_1fr_40px] gap-2 p-2 border-b border-[#2b2b2b] bg-[#161616] font-mono text-[10px] text-[#777] uppercase tracking-wider sticky top-0 z-10">
                <div className="pl-2">Vegetable</div>
                <div>Class</div>
                <div className="text-right">Conf</div>
              </div>
              
              <div className="flex flex-col">
                {detections.length === 0 && !isDetecting && imageObj && !error && (
                  <div className="p-6 text-center text-[#555] font-mono text-xs flex flex-col items-center">
                    <ShieldCheck className="h-8 w-8 mb-2 text-[#00ff66]/50" />
                    No anomalies detected. Healthy pattern matched.
                  </div>
                )}

                {isDetecting && (
                  <div className="p-6 text-center text-[#00ff66] font-mono text-xs flex flex-col items-center animate-pulse">
                    Scanning neural features...
                  </div>
                )}

                {detections.map((det, i) => {
                  const isDisease = !det.label.toLowerCase().includes('healthy') && !det.label.toLowerCase().includes('normal');
                  
                  return (
                  <div key={i} className="grid grid-cols-[100px_1fr_40px] gap-2 items-center border-b border-[#2b2b2b] p-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors w-full font-mono text-[0.85rem]">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={cn("inline-block h-2 w-2 rounded-full flex-shrink-0", isDisease ? "bg-[#ff3366]" : "bg-[#00ff66]")} />
                        <span className="truncate text-[#a0a0a0]">{det.vegetable}</span>
                      </div>
                      <div className="truncate text-[#f0f0f0]">
                        {det.label}
                      </div>
                      <div className="text-right text-[#909090] shrink-0">
                        {(det.confidence * 100).toFixed(0)}%
                      </div>
                  </div>
                )})}
              </div>
          </div>
        </div>

        {/* Bottom Half: Preventive Tips */}
        <div className="flex flex-col flex-1 max-h-[50%] overflow-hidden bg-[#0c0c0c]">
          <div className="panel-header flex items-center justify-between border-b border-[#2b2b2b] bg-[#101010]">
            <span>Treatment & Prevention</span>
            <ShieldCheck className="h-4 w-4 text-[#00ff66]" />
          </div>
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
            {detections.length === 0 && !isDetecting && (
              <div className="text-center text-[#555] font-mono text-xs py-8">
                Awaiting imagery to generate tailored recommendations...
              </div>
            )}
            
            {isDetecting && (
              <div className="text-center text-[#909090] font-mono text-xs py-8 animate-pulse">
                Synthesizing agricultural guidance...
              </div>
            )}

            {detections.filter(d => d.preventiveTips).map((det, i) => {
               const isDisease = !det.label.toLowerCase().includes('healthy') && !det.label.toLowerCase().includes('normal');
               return (
               <div key={`tip-${i}`} className="flex flex-col gap-2 rounded-lg bg-[#161616] border border-[#2b2b2b] p-3 shadow-md">
                  <div className="flex justify-between items-start border-b border-[#2b2b2b]/50 pb-2 mb-1">
                     <div className="flex flex-col">
                       <span className="text-[10px] text-[#777] uppercase font-mono tracking-wider">{det.vegetable}</span>
                       <span className={cn("font-mono text-xs font-bold", isDisease ? "text-[#ff3366]" : "text-[#00ff66]")}>{det.label}</span>
                     </div>
                     {isDisease ? (
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-[#ff3366]" />
                      ) : (
                        <Info className="h-4 w-4 flex-shrink-0 text-[#00ff66]" />
                      )}
                  </div>
                  <span className="text-[12px] text-[#b0b0b0] font-sans leading-relaxed">
                    {det.preventiveTips}
                  </span>
               </div>
            )})}
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
