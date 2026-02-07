
import React, { useState, useRef, useEffect } from 'react';
import { Brand, Platform, GenerationInput, GeneratedAsset } from '../types';
import { generateContent } from '../geminiService';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  Sparkles, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  Layout, 
  Image as ImageIcon,
  Type as TypeIcon
} from 'lucide-react';

interface GeneratorProps {
  brands: Brand[];
}

const Generator: React.FC<GeneratorProps> = ({ brands }) => {
  const [activeBrandId, setActiveBrandId] = useState(brands[0]?.id || '');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional e Empolgante');
  const [cta, setCta] = useState('Clique no link da bio!');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ caption: string, overlayText: string, imageUrl: string } | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeBrand = brands.find(b => b.id === activeBrandId);

  const handleGenerate = async () => {
    if (!activeBrand) return;
    setIsGenerating(true);
    setResult(null);
    setFinalImage(null);

    try {
      const data = await generateContent({
        brandId: activeBrandId,
        platform,
        topic,
        tone,
        cta
      }, activeBrand);
      
      setResult(data);
    } catch (error) {
      console.error("Geração falhou", error);
      alert("Ocorreu um erro durante a geração. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (result && canvasRef.current && activeBrand) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = result.imageUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = activeBrand.primaryColor + 'CC'; 
        ctx.fillRect(img.width * 0.05, img.height - (img.height * 0.25), img.width * 0.9, img.height * 0.18);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(img.width / 15)}px ${activeBrand.fontFamily}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = result.overlayText.toUpperCase();
        ctx.fillText(text, img.width / 2, img.height - (img.height * 0.16));

        ctx.beginPath();
        ctx.arc(img.width * 0.1, img.height * 0.1, img.width * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = activeBrand.secondaryColor;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(img.width / 20)}px sans-serif`;
        ctx.fillText(activeBrand.name.charAt(0), img.width * 0.1, img.height * 0.1);

        const dataUrl = canvas.toDataURL('image/png');
        setFinalImage(dataUrl);
        
        const newAsset: GeneratedAsset = {
          id: Math.random().toString(36).substr(2, 9),
          brandId: activeBrandId,
          platform,
          topic,
          imageUrl: result.imageUrl,
          textContent: result.caption,
          finalOutputUrl: dataUrl,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        const saved = JSON.parse(localStorage.getItem('creative_ai_assets') || '[]');
        localStorage.setItem('creative_ai_assets', JSON.stringify([newAsset, ...saved]));
      };
    }
  }, [result, activeBrand]);

  const copyToClipboard = () => {
    if (result?.caption) {
      navigator.clipboard.writeText(result.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const platforms: { id: Platform, name: string, icon: any }[] = [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Gerador de IA</h1>
        <p className="text-slate-400 mt-2">Crie conteúdo de marca otimizado para plataformas em segundos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Selecione a Marca</label>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBrandId(b.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      activeBrandId === b.id 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm' 
                        : 'border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Plataforma Alvo</label>
              <div className="grid grid-cols-4 gap-3">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        platform === p.id 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm' 
                          : 'border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                      title={p.name}
                    >
                      <Icon size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{p.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Tópico / Promoção</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-950 px-4 py-3 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all text-slate-100 placeholder-slate-600"
                  placeholder="Ex: Promoção de verão para nossa nova coleção de relógios de luxo"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Tom de Voz</label>
                <input 
                  type="text"
                  className="w-full bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100"
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Chamada para Ação (CTA)</label>
                <input 
                  type="text"
                  className="w-full bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100"
                  value={cta}
                  onChange={e => setCta(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all shadow-xl ${
                isGenerating || !topic
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Gerando Mágica...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Criar Conteúdo
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[600px] border border-slate-800">
            <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-400 text-sm ml-2 font-medium">Visualização em Tempo Real - {platform}</span>
              </div>
              <div className="flex gap-2">
                {finalImage && (
                  <a 
                    href={finalImage} 
                    download={`creative-ai-${platform}.png`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Baixar Imagem"
                  >
                    <Download size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {!result && !isGenerating && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale">
                  <Layout size={64} className="text-slate-600" />
                  <div>
                    <p className="text-slate-400 font-bold text-xl">Janela de Pré-visualização</p>
                    <p className="text-slate-500 text-sm">Configure as opções para ver a mágica acontecer</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-pulse" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">O Gemini está Criando...</p>
                    <p className="text-slate-500 text-sm mt-1 italic">"Planejando conceitos específicos para sua marca..."</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="relative group">
                    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-square flex items-center justify-center">
                      {!finalImage ? (
                        <img src={result.imageUrl} alt="Base" className="w-full h-full object-cover" />
                      ) : (
                        <img src={finalImage} alt="Final composite" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="absolute -left-12 top-10 flex items-center gap-2 text-indigo-500/60 whitespace-nowrap -rotate-90 origin-right pointer-events-none">
                      <ImageIcon size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Imagem Base</span>
                    </div>
                    <div className="absolute -left-12 bottom-20 flex items-center gap-2 text-pink-500/60 whitespace-nowrap -rotate-90 origin-right pointer-events-none">
                      <TypeIcon size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Sobreposição</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Legenda Sugerida</h3>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        <span className="text-[10px] font-bold uppercase">{copied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {result.caption}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
