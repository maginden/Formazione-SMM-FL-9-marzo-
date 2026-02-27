'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Target, 
  MessageSquare, 
  Edit3, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Layout,
  ListChecks,
  Rocket,
  Users,
  Palette,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Save,
  Upload,
  Image as ImageIcon,
  FileJson,
  FileCode,
  FileArchive,
  Video,
  Zap,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  User,
  Smile,
  Headphones,
  PlayCircle,
  ExternalLink,
  Brain,
  Search,
  ShoppingBag,
  Star,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';

// --- Types ---
interface LessonData {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  objectives: string[];
  message: string;
  teacher: string;
  teacherRole: string;
  email: string;
  logoUrl?: string;
  podcastUrl?: string;
  videoUrl?: string;
}

const steps = [
  { id: 'intro', title: 'Benvenuti' },
  { id: 'concept', title: 'Piano vs Calendario' },
  { id: 'visual', title: 'Il Potere del Visual' },
  { id: 'neuro', title: 'Neuroscienze 2024' },
  { id: 'identity', title: 'Identità & Social' },
  { id: 'journey', title: 'Il Viaggio del Cliente' },
  { id: 'metrics', title: 'Metriche vs KPI' },
  { id: 'market', title: 'Analisi Mercato (UC 1655)' },
  { id: 'offer', title: 'Configurazione Offerta (UC 1656)' },
  { id: 'luxury', title: 'Marketing del Lusso & Digital' },
  { id: 'strategy', title: 'Il Piano Editoriale' },
  { id: 'rubriche', title: 'Rubriche Creative' },
  { id: 'calendar', title: 'Il Calendario Operativo' },
  { id: 'exercise', title: 'Esercitazione' },
];

// --- Initial Data ---
const INITIAL_DATA: LessonData = {
  title: "Marketing & Comunicazione Online",
  subtitle: "Lecce, Lunedì 2 Marzo 2026",
  date: "02 Marzo 2026",
  time: "14:30 - 20:30",
  location: "Forum Lab, Lecce",
  objectives: [
    "Comprendere le fasi di un piano di comunicazione",
    "Configurazione Offerta (UC 1656)",
    "Identificare le nuove regole del marketing digitale",
    "Saper definire obiettivi SMART e KPI",
    "Utilizzare l'AI per l'ottimizzazione dei processi"
  ],
  message: "Dal sogno al segno.\nDal segno a un universo da abitare",
  teacher: "Mari Indennitate",
  teacherRole: "aka Veravox",
  email: "veravox@indennitatedigital.it",
  logoUrl: "https://pbs.twimg.com/profile_images/2027150076972273664/dcIvrP9l_400x400.jpg",
  podcastUrl: "https://open.spotify.com/show/3R6qX7X2X5X5X5",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};

// --- Components ---

const EditableText = ({ 
  value, 
  onChange, 
  isEditing, 
  className,
  multiline = false 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
}) => {
  if (isEditing) {
    return multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full bg-white/10 border border-white/20 rounded p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500", className)}
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full bg-white/10 border border-white/20 rounded p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500", className)}
      />
    );
  }
  return <span className={className}>{value}</span>;
};

export default function Presentation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<LessonData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const slideRef = React.useRef<HTMLDivElement>(null);

  const updateField = (field: keyof LessonData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lezione-${data.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setData(json);
        } catch (err) {
          alert("Errore nel caricamento del file JSON");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToPdf = async () => {
    if (!slideRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(slideRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#fdfdfd',
      });
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [img.width, img.height]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
      pdf.save(`lezione-${steps[currentStep].title.toLowerCase()}.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Errore durante l'esportazione in PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPpptx = async () => {
    if (!slideRef.current) return;
    setIsExporting(true);
    try {
      const pptxgen = (await import('pptxgenjs')).default;
      const dataUrl = await htmlToImage.toPng(slideRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#fdfdfd',
      });
      
      const pres = new pptxgen();
      const slide = pres.addSlide();
      
      slide.addImage({ 
        data: dataUrl, 
        x: 0, 
        y: 0, 
        w: '100%', 
        h: '100%' 
      });
      
      pres.writeFile({ fileName: `lezione-${steps[currentStep].title.toLowerCase()}.pptx` });
    } catch (err) {
      console.error("PPTX Export failed", err);
      alert("Errore durante l'esportazione in PPTX.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllToHtml = async () => {
    setIsExporting(true);
    const originalStep = currentStep;
    const slidesHtml: string[] = [];

    try {
      // Collect HTML for all slides
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        // Wait for React to render the slide
        await new Promise(resolve => setTimeout(resolve, 600)); 
        
        if (slideRef.current) {
          // Clone the content to avoid issues with live DOM
          const content = slideRef.current.innerHTML;
          slidesHtml.push(`
            <div class="slide-page">
              <div class="slide-header">Slide ${i + 1}: ${steps[i].title}</div>
              <div class="slide-content">
                ${content}
              </div>
            </div>
          `);
        }
      }

      const html = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Full Presentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; background: #f1f5f9; padding: 40px 20px; margin: 0; }
      .slide-page { 
        max-width: 1152px; 
        margin: 0 auto 60px; 
        background: white; 
        border-radius: 40px; 
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); 
        overflow: hidden;
        position: relative;
        min-height: 600px;
      }
      .slide-header {
        background: #0f172a;
        color: white;
        padding: 12px 30px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.15em;
      }
      .slide-content {
        padding: 40px;
      }
      @media print {
        body { padding: 0; background: white; }
        .slide-page { margin: 0; box-shadow: none; page-break-after: always; border-radius: 0; border-bottom: 1px solid #eee; }
        .slide-header { background: #eee; color: #333; }
      }
      /* Ensure some basic styles that might be missing from Tailwind CDN if not used in static HTML */
      .font-display { font-family: 'Inter', sans-serif; font-weight: 700; }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 60px;">
      <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">${data.title}</h1>
      <p style="color: #64748b; font-size: 18px;">Masterclass by ${data.teacher}</p>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">${data.date} - ${data.location}</p>
    </div>
    
    ${slidesHtml.join('')}
    
    <div style="text-align: center; padding: 60px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
      Generato da Formula Lab - Social Media Marketing Masterclass<br>
      Docente: ${data.teacher} (${data.email})
    </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `presentazione-completa-${data.title.toLowerCase().replace(/\s+/g, '-')}.html`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("HTML Export failed", err);
      alert("Errore durante l'esportazione in HTML.");
    } finally {
      setCurrentStep(originalStep);
      setIsExporting(false);
    }
  };

  const exportAllToZip = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    const originalStep = currentStep;

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        // Wait for React to render and animations to settle
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        if (slideRef.current) {
          const dataUrl = await htmlToImage.toPng(slideRef.current, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#fdfdfd',
          });
          const base64Data = dataUrl.split(',')[1];
          zip.file(`slide-${String(i + 1).padStart(2, '0')}-${steps[i].id}.png`, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `immagini-lezione-${data.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Export failed", err);
      alert("Errore durante l'esportazione dello ZIP.");
    } finally {
      setCurrentStep(originalStep);
      setIsExporting(false);
    }
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = value;
    updateField('objectives', newObjectives);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <label className="relative group cursor-pointer">
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-emerald-500 transition-colors">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={20} className="text-slate-400 group-hover:text-emerald-500" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 size={10} />
            </div>
          </label>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              FL
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Formula Lab</h2>
              <p className="text-xs text-slate-500 font-medium">Garanzia Giovani - Lecce</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                currentStep === idx 
                  ? "bg-white text-emerald-700 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-4 mr-4">
            <button 
              onClick={saveToJson}
              title="Salva Dati (JSON)"
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <FileJson size={18} />
              <span className="hidden xl:inline text-xs font-bold">JSON</span>
            </button>
            <label className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer">
              <input type="file" accept=".json" onChange={uploadFromJson} className="hidden" />
              <Upload size={18} />
              <span className="hidden xl:inline text-xs font-bold">CARICA</span>
            </label>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all",
              isEditing 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Edit3 size={16} />
            <span className="hidden sm:inline">{isEditing ? "Salva" : "Modifica"}</span>
          </button>
          
          <button 
            onClick={exportToPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button 
            onClick={exportToPpptx}
            disabled={isExporting}
            title="Esporta Slide Corrente (PPTX)"
            className="flex items-center gap-2 px-3 py-2 bg-emerald-900 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Activity size={16} />
            )}
            <span className="hidden lg:inline">PPTX</span>
          </button>

          <button 
            onClick={exportAllToHtml}
            disabled={isExporting}
            title="Esporta Tutta la Presentazione (HTML)"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileCode size={16} />
            )}
            <span className="hidden lg:inline">HTML</span>
          </button>

          <button 
            onClick={exportAllToZip}
            disabled={isExporting}
            title="Esporta Tutte le Slide come Immagini (ZIP)"
            className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileArchive size={16} />
            )}
            <span className="hidden lg:inline">ZIP</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10" ref={slideRef}>
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="intro-slide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Main Header Card */}
              <div className="bg-slate-950 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 border-[1px] border-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute top-0 right-0 w-96 h-96 border-[1px] border-white/10 rounded-full -mr-48 -mt-48" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[1px] border-white/10 rounded-full -mr-64 -mt-64" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Garanzia Giovani - Forum Lab
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight">
                    <EditableText 
                      value={data.title} 
                      onChange={(v) => updateField('title', v)} 
                      isEditing={isEditing} 
                    />
                  </h1>
                  
                  <p className="text-xl text-slate-400 font-light">
                    <EditableText 
                      value={data.subtitle} 
                      onChange={(v) => updateField('subtitle', v)} 
                      isEditing={isEditing} 
                    />
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {data.podcastUrl && (
                      <a 
                        href={data.podcastUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold hover:bg-white/20 transition-colors"
                      >
                        <Headphones size={14} className="text-emerald-400" />
                        Podcast
                      </a>
                    )}
                    {data.videoUrl && (
                      <a 
                        href={data.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold hover:bg-white/20 transition-colors"
                      >
                        <PlayCircle size={14} className="text-red-400" />
                        Video Lezione
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Calendar, label: "DATA", value: data.date, field: 'date' },
                  { icon: Clock, label: "ORARIO", value: data.time, field: 'time' },
                  { icon: MapPin, label: "LUOGO", value: data.location, field: 'location' },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-semibold text-slate-900">
                        <EditableText 
                          value={item.value} 
                          onChange={(v) => updateField(item.field as any, v)} 
                          isEditing={isEditing} 
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Objectives */}
                <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Target className="text-emerald-600" />
                      Obiettivi della Lezione
                    </h3>
                    <Smile className="text-amber-400 opacity-50" size={24} />
                  </div>
                  <ul className="space-y-4">
                    {data.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                          <ChevronRight size={12} />
                        </div>
                        <EditableText 
                          value={obj} 
                          onChange={(v) => updateObjective(idx, v)} 
                          isEditing={isEditing} 
                          className="text-slate-600 leading-relaxed text-sm"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Message */}
                <div className="bg-emerald-600 p-8 rounded-[32px] text-white flex flex-col justify-between shadow-lg shadow-emerald-200 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                    <User size={160} />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <MessageSquare />
                      Messaggio per gli Studenti
                    </h3>
                    <p className="text-xl font-display italic leading-relaxed opacity-90">
                      <EditableText 
                        value={data.message} 
                        onChange={(v) => updateField('message', v)} 
                        isEditing={isEditing} 
                        multiline
                      />
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                      {data.teacher.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">
                        <EditableText 
                          value={data.teacher} 
                          onChange={(v) => updateField('teacher', v)} 
                          isEditing={isEditing} 
                        />
                      </p>
                      <p className="text-xs opacity-70">
                        <EditableText 
                          value={data.teacherRole} 
                          onChange={(v) => updateField('teacherRole', v)} 
                          isEditing={isEditing} 
                        />
                      </p>
                      <p className="text-[10px] opacity-50 mt-0.5 font-mono">
                        <EditableText 
                          value={data.email} 
                          onChange={(v) => updateField('email', v)} 
                          isEditing={isEditing} 
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 py-10"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Piano vs Calendario</h2>
                <p className="text-slate-500 text-lg">La differenza fondamentale tra strategia ed esecuzione.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layout size={80} />
                  </div>
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Layout size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Il Piano Editoriale (PED)</h3>
                  <p className="text-slate-600 leading-relaxed">
                    È la tua <strong>sceneggiatura</strong>. Definisce il &quot;cosa&quot;, il &quot;perché&quot; e il &quot;per chi&quot;. È il documento strategico che guida la narrazione del brand.
                  </p>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Metafora Visiva</p>
                    <p className="text-xs italic text-indigo-700">Come il copione di un film: scrive i dialoghi, le scene e il finale prima ancora di accendere la camera.</p>
                  </div>
                  <ul className="space-y-3 pt-2">
                    {["Obiettivi di business", "Analisi del Target", "Tone of Voice", "Contenuti Pilastro"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-indigo-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar size={80} />
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">Il Calendario Editoriale</h3>
                  <p className="text-slate-600 leading-relaxed">
                    È il tuo <strong>piano di riprese</strong>. Definisce il &quot;quando&quot; e il &quot;dove&quot;. È lo strumento operativo per la gestione quotidiana dei contenuti.
                  </p>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Metafora Visiva</p>
                    <p className="text-xs italic text-emerald-700">Come l&apos;ordine del giorno sul set: dice a che ora arriva l&apos;attore, dove si posiziona la luce e quando si grida &quot;Azione!&quot;.</p>
                  </div>
                  <ul className="space-y-3 pt-2">
                    {["Date e orari di pubblicazione", "Canali (IG, TikTok, FB)", "Copywriting finale", "Asset grafici pronti"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Lightbulb size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Metafora per Creativi</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Il Piano Editoriale è il progetto architettonico di una casa. Il Calendario Editoriale è il cronoprogramma del cantiere che dice quando arrivano i mattoni e quando si monta il tetto.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-visual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Neuromarketing Visivo</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Il Cervello Preferisce le Immagini</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <ImageIcon size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                    <h3 className="text-6xl font-black text-blue-400 mb-2">&quot;60.000x&quot;?</h3>
                    <p className="text-xl font-medium leading-tight mb-4">Il cervello processa le immagini molto velocemente, ma la cifra &quot;60.000x&quot; è un mito suggestivo.</p>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        &quot;Il cervello riconosce una struttura linguistica in circa 150ms, una velocità paragonabile alla percezione visiva complessa. Entrambi i sistemi sono straordinariamente rapidi.&quot;
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-3xl font-bold text-slate-900 mb-1">90%</p>
                      <p className="text-xs text-slate-500 leading-snug">Delle informazioni trasmesse al cervello sono visive.</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-3xl font-bold text-slate-900 mb-1">80%</p>
                      <p className="text-xs text-slate-500 leading-snug">Ricordiamo ciò che vediamo, contro il 20% di ciò che leggiamo.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">La Battaglia per l&apos;Attenzione</h3>
                  <p className="text-slate-600">In un contesto di &quot;Overload Informativo&quot;, l&apos;attenzione è la risorsa più scarsa.</p>
                  
                  <div className="space-y-4">
                    <div className="relative h-12 bg-slate-100 rounded-full overflow-hidden flex items-center px-6">
                      <div className="absolute left-0 top-0 h-full bg-slate-400 w-[100%]" />
                      <span className="relative z-10 text-xs font-bold text-white">Anno 2000: 12 Secondi</span>
                    </div>
                    <div className="relative h-12 bg-slate-100 rounded-full overflow-hidden flex items-center px-6">
                      <div className="absolute left-0 top-0 h-full bg-blue-500 w-[66%]" />
                      <span className="relative z-10 text-xs font-bold text-white">Oggi: 8 Secondi</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    {[
                      { title: "Selezione Percettiva", desc: "Ignoriamo la maggior parte degli stimoli non rilevanti." },
                      { title: "Vigilanza Percettiva", desc: "Notiamo ciò che risponde a un bisogno attuale." },
                      { title: "Adattamento", desc: "Gli stimoli troppo familiari vengono ignorati (Banner Blindness)." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Strategie per Social Media</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      title: "Hook nei Video", 
                      desc: "I primi 3 secondi sono vitali: usa un 'gancio' visivo o testuale immediato.",
                      icon: Video
                    },
                    { 
                      title: "Stop-Scrolling", 
                      desc: "Colori vivaci e contrasti forti catturano l'attenzione durante lo scrolling.",
                      icon: Zap
                    },
                    { 
                      title: "Gerarchia Visiva", 
                      desc: "Guida l'occhio verso l'elemento chiave usando dimensioni e posizionamento.",
                      icon: Eye
                    },
                    { 
                      title: "Coerenza di Brand", 
                      desc: "Usa stili visuali costanti per essere riconosciuto istantaneamente.",
                      icon: Palette
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="text-blue-600">
                        <item.icon size={18} />
                      </div>
                      <p className="font-bold text-xs text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Lightbulb size={24} />
                  </div>
                  <p className="text-sm text-blue-900/70 leading-relaxed italic">
                    &quot;L&apos;immagine evoca, la parola descrive. In un mondo che corre, chi non colpisce l&apos;occhio non raggiunge il cuore.&quot;
                    <span className="block mt-1 font-bold text-[10px] uppercase tracking-widest">— Fonte: Tesi Luiss (G. Scanagatta)</span>
                  </p>
                </div>
                
                <div className="pt-4 border-t border-blue-100 flex items-start gap-3">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Disclaimer: Verificate, sempre.</p>
                    <p className="text-xs text-blue-700/70 leading-relaxed">
                      Nota rispetto alla soglia dell&apos;attenzione: davvero così? Cerca con Google... 
                      <a 
                        href="https://www.ok-salute.it/psicologia/soglia-di-attenzione-ormai-solo-a-8-secondi/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 underline hover:text-blue-800"
                      >
                        Approfondisci qui
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-neuro-2024"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Neuroscienze 2024</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Mito vs Realtà Scientifica</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <AlertCircle size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-indigo-900">La Verità in 150ms</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Il cervello riconosce la struttura di una frase in circa <b>150 millisecondi</b> (un battito di ciglia). Questa rapidità è paragonabile alla percezione di una scena visiva complessa.
                    </p>
                    <p className="text-sm text-slate-500 italic">
                      La comprensione linguistica &quot;a colpo d&apos;occhio&quot; opera in modo simile al riconoscimento visivo: rapido e automatico.
                    </p>
                  </div>

                  <div className="bg-indigo-900 text-white p-8 rounded-[32px] shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Perché il mito dei &quot;60.000x&quot;?</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      È una cifra suggestiva e facile da ricordare, utile in contesti motivazionali, ma <b>non ha basi neuroscientifiche</b>. Entrambi i sistemi sono rapidissimi, ma con funzioni diverse.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-slate-400">🔍 Studi Rilevanti (2024)</h3>
                  <div className="space-y-4">
                    {[
                      { source: "NYU", title: "Scanning, Scrolling and Swiping", desc: "Riconoscimento frase in 150ms, simile al visivo." },
                      { source: "Neuroscience News", title: "Sentence Structures as Fast as Visual Scenes", desc: "Comprensione istantanea comparabile alla percezione visiva." },
                      { source: "AAU", title: "Rapid Processing of Short Messages", desc: "Testi brevi processati quasi alla stessa velocità delle immagini." },
                      { source: "ACL Anthology", title: "Hierarchical Processing", desc: "Rappresentazione gerarchica e parallela di info visive e linguistiche." }
                    ].map((study, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">{study.source}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{study.title}</p>
                        <p className="text-xs text-slate-500">{study.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Psicologia Social</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Dimmi cosa &apos;Likki&apos;...</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                  <Users size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold">La Costruzione dell&apos;Identità</h3>
                  <p className="text-slate-600 leading-relaxed">
                    I &quot;Mi Piace&quot; non sono solo approvazione, sono mattoni del nostro <strong>Self-concept</strong>. Usiamo i brand e le immagini per dire al mondo chi siamo (o chi vorremmo essere).
                  </p>
                  
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="absolute w-40 h-40 bg-blue-200/40 rounded-full flex items-center justify-center border-2 border-blue-300 -translate-x-12 -translate-y-8 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-blue-800 uppercase">Actual Self</span>
                    </div>
                    <div className="absolute w-40 h-40 bg-pink-200/40 rounded-full flex items-center justify-center border-2 border-pink-300 translate-x-12 -translate-y-8 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-pink-800 uppercase">Ideal Self</span>
                    </div>
                    <div className="absolute w-40 h-40 bg-emerald-200/40 rounded-full flex items-center justify-center border-2 border-emerald-300 translate-y-12 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Social Self</span>
                    </div>
                    <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 z-10">
                      <span className="text-[8px] font-black text-slate-900 text-center leading-none">ENGAGE<br/>MENT</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8">
                  <h4 className="text-xl font-bold text-pink-400">La Scienza del &apos;Like&apos;</h4>
                  <div className="space-y-6">
                    {[
                      { label: "Volti", value: "+38%", desc: "Le immagini con volti umani ricevono più like." },
                      { label: "Luminosità", value: "+24%", desc: "Le immagini chiare performano meglio delle scure." },
                      { label: "Colore", value: "Blu > Rosso", desc: "Il blu genera un effetto calmante e di fiducia." },
                      { label: "Timing", value: "Sera/Weekend", desc: "Quando il cervello è in modalità &quot;svago&quot;." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <span className="text-xl font-black text-pink-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step-journey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Customer Journey</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Oltre l&apos;Acquisto</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 relative">
                  <Rocket size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <User size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Il Nuovo Viaggio Visivo</h3>
                  <div className="space-y-2">
                    {[
                      { step: "Inspire", desc: "Crea il desiderio (Pinterest style)", color: "bg-slate-100" },
                      { step: "Introduce", desc: "Presenta la soluzione", color: "bg-slate-200" },
                      { step: "Inform", desc: "Dettagli tecnici e valore", color: "bg-slate-300" },
                      { step: "Buy", desc: "L&apos;atto della conversione", color: "bg-slate-900 text-white" },
                      { step: "Celebrate", desc: "La condivisione (Instagram style)", color: "bg-emerald-500 text-white" }
                    ].map((item, i) => (
                      <div key={i} className={cn("p-4 rounded-2xl flex items-center justify-between transition-transform hover:scale-[1.02]", item.color)}>
                        <span className="font-bold uppercase tracking-widest text-xs">{item.step}</span>
                        <span className="text-xs opacity-70 italic">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <Palette size={20} />
                      <h4 className="font-bold">Aspirazione (Pinterest)</h4>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed">
                      &quot;Cosa vorrei possedere&quot;. È la fase di scoperta e curatela dei desideri. Qui il brand deve essere pura ispirazione visiva.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <CheckCircle2 size={20} />
                      <h4 className="font-bold">Celebrazione (Instagram)</h4>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed">
                      &quot;Cosa ho comprato&quot;. È la fase del Social Proof e dell&apos;UGC (User Generated Content). Il cliente diventa ambasciatore.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex gap-6 items-center">
                <div className="shrink-0 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center relative">
                  <Target size={28} />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <Smile size={12} className="text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Show, don&apos;t tell.</h4>
                  <p className="text-slate-400 text-sm italic leading-relaxed">
                    &quot;Il viaggio non finisce con l&apos;acquisto. La fase di Celebration trasforma il cliente in un narratore del tuo brand.&quot;
                    <span className="block mt-1 font-bold text-[10px] uppercase tracking-widest">— Fonte: Tesi Luiss (G. Scanagatta)</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div
              key="step-metrics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Misurazione & Analisi</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Metriche vs KPI</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <BarChart3 size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Activity size={20} />
                      <h3 className="text-xl font-bold">Le Metriche (I Dati)</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sono misurazioni quantitative di un&apos;attività. Ci dicono <strong>cosa sta succedendo</strong>, ma non necessariamente se stiamo andando bene.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {["Visualizzazioni", "Like", "Follower", "Click"].map((m, i) => (
                        <div key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 border border-slate-100">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-md space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Target size={20} />
                      <h3 className="text-xl font-bold">I KPI (Gli Obiettivi)</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Key Performance Indicators. Sono le metriche che contano davvero per il tuo business. Ci dicono <strong>se stiamo raggiungendo il successo</strong>.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {["Tasso di Conversione", "Costo per Lead", "ROI", "Engagement Rate"].map((k, i) => (
                        <div key={i} className="px-4 py-2 bg-blue-50 rounded-xl text-xs font-bold text-blue-700 border border-blue-100">
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                  </div>
                  
                  <h4 className="text-2xl font-display font-medium text-blue-400 relative z-10">Infografica KPI Principali</h4>
                  
                  <div className="space-y-6 relative z-10">
                    {[
                      { label: "Awareness", icon: Eye, value: "Reach / Impression", color: "text-purple-400" },
                      { label: "Consideration", icon: MessageSquare, value: "Engagement / Click", color: "text-blue-400" },
                      { label: "Conversion", icon: ShoppingBag, value: "Sales / Signups", color: "text-emerald-400" },
                      { label: "Loyalty", icon: Star, value: "Retention / LTV", color: "text-amber-400" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                        <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                          <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
                            <span className={cn("text-sm font-bold", item.color)}>{item.value}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${85 - i * 15}%` }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                              className={cn("h-full bg-current", item.color)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <User size={20} />
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      &quot;Le metriche sono vanità, i KPI sono sanità.&quot; — Ricorda di guardare oltre i numeri superficiali.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-4">
                <h4 className="text-amber-800 font-bold flex items-center gap-2">
                  <Lightbulb size={20} />
                  Termini Trasversali
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { term: "Benchmark", desc: "Confronto con il mercato" },
                    { term: "Funnel", desc: "Percorso di conversione" },
                    { term: "Insight", desc: "Verità nascosta nei dati" },
                    { term: "Optimization", desc: "Miglioramento continuo" }
                  ].map((t, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold text-sm text-amber-900">{t.term}</p>
                      <p className="text-[10px] text-amber-700/70">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 7 && (
            <motion.div
              key="step-market"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Competenza UC 1655</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Analizzare il Mercato</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <MapPin size={32} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <User size={48} />
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Paesaggio (I Competitor)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chi altro sta dipingendo su questa tela? Analizzare i competitor non serve a copiare, ma a trovare lo spazio vuoto dove il tuo brand può brillare.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cosa cercare:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Il loro stile visivo</li>
                      <li>• Cosa dicono (e cosa NON dicono)</li>
                      <li>• Come interagiscono</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Smile size={48} />
                  </div>
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <Rocket size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Vento (I Trend)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    In che direzione soffia il gusto del pubblico? I trend sono correnti che possono spingere la tua barca, ma attento a non perdere la tua identità.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Strumenti:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Pinterest Trends</li>
                      <li>• Google Trends</li>
                      <li>• Osservazione Social</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Target size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Il Terreno (I Bisogni)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Cosa cercano davvero le persone? Non vendiamo solo oggetti o servizi, ma soluzioni a desideri estetici o funzionali insoddisfatti.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Focus:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Problemi da risolvere</li>
                      <li>• Emozioni da suscitare</li>
                      <li>• Valori condivisi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                  <MapPin size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Metafora Visiva: La Mappa della Spedizione</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Analizzare il mercato è come disegnare la mappa prima di una spedizione in terre ignote. Non ti dice dove andare, ma ti mostra dove sono le montagne insormontabili e dove si trovano le oasi di acqua fresca.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 8 && (
            <motion.div
              key="step-offer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Competenza UC 1656</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Configurare l&apos;Offerta</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 relative">
                  <Palette size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                    <Smile size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Layout size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Il &quot;Cosa&quot;: Prodotto o Servizio</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Non vendi solo un oggetto, vendi un&apos;esperienza. Definisci le caratteristiche tecniche, ma soprattutto il <strong>valore aggiunto</strong> che offri.
                    </p>
                    <ul className="space-y-2 pt-2">
                      {["Qualità dei materiali", "Design unico", "Personalizzazione", "Assistenza post-vendita"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                          <CheckCircle2 size={16} className="text-blue-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Target size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Il &quot;Quanto&quot;: Strategia di Prezzo</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Il prezzo comunica il posizionamento. È un brand di lusso o accessibile? Considera i costi, ma anche il valore percepito dal cliente.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Costi</p>
                        <p className="text-xs text-slate-600 italic">Materiali + Tempo + Spese fisse</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valore</p>
                        <p className="text-xs text-slate-600 italic">Unicità + Brand + Emozione</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Lightbulb size={120} />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h4 className="text-2xl font-display font-medium text-emerald-400">Metafora Visiva: Il Menù dello Chef</h4>
                    <p className="text-slate-400 italic leading-relaxed">
                      &quot;Configurare l&apos;offerta è come creare il menù di un ristorante stellato. Non elenchi solo gli ingredienti, ma racconti una storia attraverso i piatti, decidi l&apos;ordine delle portate e crei abbinamenti che lasciano il segno.&quot;
                    </p>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <h5 className="font-bold text-sm uppercase tracking-widest text-slate-500">Gli Ingredienti del Successo:</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { title: "L'Antipasto (Entry Level)", desc: "Un servizio/prodotto accessibile per farti conoscere." },
                        { title: "Il Piatto Forte (Core Offer)", desc: "Il tuo cavallo di battaglia, ciò per cui sei famoso." },
                        { title: "Il Dessert (Upselling)", desc: "Quel tocco in più che completa l'esperienza del cliente." }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                          <h6 className="font-bold text-emerald-400 text-sm">{item.title}</h6>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl relative z-10">
                    <p className="text-xs text-emerald-400 font-medium">
                      <strong>Ricorda:</strong> Un&apos;offerta chiara riduce l&apos;attrito all&apos;acquisto. Se il cliente deve pensare troppo, probabilmente non comprerà.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 9 && (
            <motion.div
              key="step-luxury"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Insight: Tesi Luiss</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Lusso & Digital Transformation</h2>
                </div>
                <div className="shrink-0 w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 relative">
                  <Rocket size={32} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-purple-100 flex items-center justify-center shadow-sm">
                    <User size={16} className="text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Storytelling Emozionale</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Nel lusso non si vende un prodotto, ma un sogno. Il digitale permette di raccontare l&apos;eredità del brand (Heritage) attraverso video immersivi e storie quotidiane.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Esempio Gucci:</p>
                    <p className="text-xs text-slate-500 italic">L&apos;uso di estetiche massimaliste e collaborazioni con artisti digitali per parlare alle nuove generazioni (Gen Z).</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Omnicanalità</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    L&apos;esperienza deve essere fluida: dal sito web alla boutique fisica, fino ai social. Il cliente è al centro di un ecosistema dove ogni tocco è coerente.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Focus:</p>
                    <p className="text-xs text-slate-500 italic">Personalizzazione estrema e servizi digitali esclusivi (Virtual Try-on, Personal Shopper online).</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Nuova Esclusività</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Oggi l&apos;esclusività non è solo &quot;prezzo alto&quot;, ma condivisione di valori. Sostenibilità ed etica sono diventati i nuovi pilastri del desiderio nel lusso.
                  </p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trend:</p>
                    <p className="text-xs text-slate-500 italic">Trasparenza della filiera e impegno sociale come leve di marketing fondamentali.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                  <Palette size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Lezione dalla Tesi</h4>
                  <p className="text-slate-400 italic leading-relaxed">
                    &quot;Il marketing del lusso nell&apos;era digitale non deve temere la tecnologia, ma usarla per amplificare l&apos;aura di mistero e desiderio che circonda il brand, rendendo l&apos;esclusività accessibile... ma solo nello sguardo.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 10 && (
            <motion.div
              key="step-strategy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Fase Strategica</div>
                  <h2 className="text-4xl md:text-5xl font-display font-medium">Costruire il Piano di Lancio</h2>
                </div>
                <Rocket className="text-slate-200" size={64} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Users, title: "Il Protagonista", subtitle: "Target", desc: "Ogni storia ha un eroe. Chi è il tuo? Cosa sogna? Quale drago deve sconfiggere?", color: "bg-blue-50 text-blue-600" },
                  { icon: Target, title: "La Bussola", subtitle: "Obiettivi", desc: "Senza nord si gira a vuoto. Awareness? Lead? Vendite? Segui la rotta SMART.", color: "bg-red-50 text-red-600" },
                  { icon: Palette, title: "La Colonna Sonora", subtitle: "Tone of Voice", desc: "È il mood che avvolge tutto. Amichevole? Istituzionale? Ironico? Rock o Jazz?", color: "bg-purple-50 text-purple-600" },
                  { icon: ListChecks, title: "Le Stanze della Mostra", subtitle: "Rubriche", desc: "Come organizzi il percorso del visitatore nel tuo mondo creativo?", color: "bg-emerald-50 text-emerald-600" },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.subtitle}</p>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl space-y-4">
                <h4 className="text-amber-800 font-bold flex items-center gap-2">
                  <AlertCircle size={20} />
                  Consiglio da Pro: Non lanciare nel vuoto!
                </h4>
                <p className="text-amber-900/70 text-sm leading-relaxed">
                  Per un brand creativo, il lancio deve essere un <strong>evento narrativo</strong>. Inizia a creare curiosità (Teasing) almeno 15 giorni prima. Mostra il &quot;dietro le quinte&quot;, i bozzetti, la ricerca dei materiali. Coinvolgi le persone nel processo creativo.
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 11 && (
            <motion.div
              key="step-rubriche"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Rubriche per Brand Creativi</h2>
                <p className="text-slate-500 text-lg">Esempi pratici per valorizzare la sensibilità visiva.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    title: "The Process", 
                    subtitle: "Il Bozzetto", 
                    content: "Timelapse di un&apos;illustrazione, moodboard di interior design, la scelta dei tessuti. Umanizza il lavoro.",
                    example: "Reel: 15 secondi di pennellate veloci.",
                    metaphor: "Mostra il bozzetto prima del quadro finito: le persone amano il viaggio, non solo la meta."
                  },
                  { 
                    title: "Inspiration", 
                    subtitle: "La Bacheca dei Sogni", 
                    content: "Artisti che amiamo, architetture iconiche, palette colori naturali. Posiziona il brand culturalmente.",
                    example: "Carousel: 5 foto di architettura brutalista.",
                    metaphor: "Condividi le tue lenti: come vedi il mondo e cosa nutre la tua creatività ogni giorno."
                  },
                  { 
                    title: "The Why", 
                    subtitle: "Le Radici", 
                    content: "Perché abbiamo scelto quel materiale? Quale emozione vogliamo trasmettere? Crea connessione profonda.",
                    example: "Post: Foto macro del dettaglio di un mobile.",
                    metaphor: "Le radici dell&apos;albero: ciò che non si vede ma che rende solida e viva tutta la chioma."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group">
                    <div className="h-32 bg-slate-900 p-6 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Palette size={64} className="text-white" />
                      </div>
                      <h4 className="text-white text-xl font-bold relative z-10">{item.title}</h4>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest relative z-10">{item.subtitle}</p>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                        <p className="text-xs italic text-slate-400 border-l-2 border-emerald-500 pl-3">{item.metaphor}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Esempio Pratico</p>
                        <p className="text-xs font-medium text-slate-700">{item.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 12 && (
            <motion.div
              key="step-calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-medium">Il Calendario Operativo</h2>
                <p className="text-slate-500 text-lg">Dalla strategia alla tabella di marcia.</p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giorno</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Canale</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rubrica</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenuto / Copy</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { day: "Lunedì 02", channel: "Instagram Reel", topic: "The Process", content: "Timelapse creazione logo. 'Come nasce un'identità visiva'.", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700" },
                      { day: "Martedì 03", channel: "IG Stories", topic: "Daily Life", content: "Sondaggio: 'Quale palette preferite per il nuovo progetto?'", status: "In Corso", statusColor: "bg-amber-100 text-amber-700" },
                      { day: "Giovedì 05", channel: "LinkedIn", topic: "The Why", content: "Articolo: L'importanza del design sostenibile oggi.", status: "Da Fare", statusColor: "bg-slate-100 text-slate-700" },
                      { day: "Venerdì 06", channel: "TikTok", topic: "Inspiration", content: "Tour dello studio creativo con musica lo-fi.", status: "Pronto", statusColor: "bg-emerald-100 text-emerald-700" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-sm">{row.day}</td>
                        <td className="p-4 text-sm text-slate-600">{row.channel}</td>
                        <td className="p-4 text-sm font-medium text-emerald-600">{row.topic}</td>
                        <td className="p-4 text-sm text-slate-500 max-w-xs">{row.content}</td>
                        <td className="p-4">
                          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", row.statusColor)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <User size={64} />
                  </div>
                  <h4 className="font-bold flex items-center gap-2 text-red-600">
                    <AlertCircle size={18} />
                    Errori da Evitare
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Pubblicare senza un obiettivo chiaro.</li>
                    <li>• Non rispondere ai commenti (il social è dialogo!).</li>
                    <li>• Usare immagini di bassa qualità (per voi è un peccato mortale).</li>
                    <li>• Essere troppo auto-referenziali.</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Smile size={64} />
                  </div>
                  <h4 className="font-bold flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                    Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Mantieni una coerenza visiva (Grid aesthetics).</li>
                    <li>• Scrivi copy che parlino al cuore del target.</li>
                    <li>• Analizza i dati ogni mese per aggiustare il tiro.</li>
                    <li>• Sperimenta nuovi formati (Reel, Carousel, Live).</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 13 && (
            <motion.div
              key="step-exercise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10 py-10"
            >
              <div className="bg-slate-900 rounded-[48px] p-10 md:p-20 text-white text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
                  <div className="absolute bottom-20 right-20 w-64 h-64 border border-white rounded-full" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="inline-block px-4 py-1 bg-emerald-500 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest relative">
                    Esercitazione Pratica
                    <div className="absolute -top-6 -right-6">
                      <Smile size={32} className="text-emerald-400" />
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-medium">Ora tocca a voi!</h2>
                  <p className="text-emerald-400 font-display text-xl italic">&quot;Costruite il vostro palcoscenico: il brand è lo show, voi siete i registi.&quot;</p>
                </div>

                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[32px] text-left space-y-6 relative z-10">
                  <p className="text-xl leading-relaxed text-slate-200">
                    Scegliete un brand immaginario (o il vostro progetto personale) nel settore <strong>Design, Illustrazione o Moda</strong>.
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Task:</h4>
                    <ol className="space-y-4 text-slate-300">
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                        Definisci 3 rubriche fisse che valorizzino il tuo talento visivo.
                      </li>
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                        Crea il calendario editoriale per la prima settimana di lancio.
                      </li>
                      <li className="flex gap-4">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                        Descrivi brevemente l&apos;asset visivo (foto/video) per ogni post.
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="pt-8 relative z-10">
                  <p className="text-emerald-400 font-display text-2xl italic">&quot;Il miglior modo per imparare il marketing è farlo.&quot;</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-slate-200 p-6 sticky bottom-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={20} />
            Indietro
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentStep === i ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-200"
                )} 
              />
            ))}
          </div>

          <button 
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            {currentStep === steps.length - 1 ? "Fine" : "Avanti"}
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
