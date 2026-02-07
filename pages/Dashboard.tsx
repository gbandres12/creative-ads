
import React, { useState, useEffect } from 'react';
import { GeneratedAsset } from '../types';
import { Clock, Image as ImageIcon, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<GeneratedAsset[]>(() => {
    const saved = localStorage.getItem('creative_ai_assets');
    return saved ? JSON.parse(saved) : [];
  });

  const stats = [
    { name: 'Total de Ativos', value: assets.length, icon: ImageIcon, color: 'bg-blue-600' },
    { name: 'Marcas Ativas', value: '2', icon: CheckCircle, color: 'bg-green-600' },
    { name: 'Taxa de Engajamento', value: '12.5%', icon: TrendingUp, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Painel</h1>
        <p className="text-slate-400 mt-2">Bem-vindo de volta! Veja o que está acontecendo com seus ativos criativos.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Generations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Criações Recentes</h2>
          <button className="text-indigo-400 font-semibold text-sm hover:underline">Ver Tudo</button>
        </div>
        
        {assets.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="text-slate-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Nenhum ativo ainda</h3>
            <p className="text-slate-500 mt-1 mb-6">Comece a gerar conteúdo de alta qualidade com IA para suas marcas.</p>
            <a href="#/generate" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block shadow-lg shadow-indigo-500/20">
              Criar Primeiro Ativo
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.slice(0, 6).map((asset) => (
              <div key={asset.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden">
                  <img src={asset.imageUrl} alt={asset.topic} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-100 border border-slate-800">
                    {asset.platform}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-100 truncate">{asset.topic}</h4>
                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{new Date(asset.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
