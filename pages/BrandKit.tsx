
import React, { useState } from 'react';
import { Brand } from '../types';
import { Plus, Edit2, Trash2, Camera, Type } from 'lucide-react';

interface BrandKitProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

const BrandKit: React.FC<BrandKitProps> = ({ brands, setBrands }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    primaryColor: '#6366f1',
    secondaryColor: '#f43f5e',
    fontFamily: 'Inter',
    logoUrl: 'https://picsum.photos/100/100'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      setBrands(brands.map(b => b.id === editingBrand.id ? { ...editingBrand, ...formData } as Brand : b));
    } else {
      const newBrand: Brand = {
        ...formData as Brand,
        id: Math.random().toString(36).substr(2, 9),
      };
      setBrands([...brands, newBrand]);
    }
    setIsAdding(false);
    setEditingBrand(null);
    setFormData({ name: '', primaryColor: '#6366f1', secondaryColor: '#f43f5e', fontFamily: 'Inter', logoUrl: 'https://picsum.photos/100/100' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta identidade visual?')) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Identidade Visual</h1>
          <p className="text-slate-400 mt-2">Defina sua identidade de marca para garantir consistência na IA.</p>
        </div>
        {!isAdding && !editingBrand && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={20} />
            Nova Marca
          </button>
        )}
      </header>

      {(isAdding || editingBrand) ? (
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-slate-100">{editingBrand ? 'Editar Marca' : 'Criar Marca'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome da Marca</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-100"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Acme Studio"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cor Primária</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    className="h-10 w-12 bg-slate-950 border border-slate-800 rounded p-1 cursor-pointer"
                    value={formData.primaryColor}
                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className="flex-1 bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-slate-100"
                    value={formData.primaryColor}
                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cor Secundária</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    className="h-10 w-12 bg-slate-950 border border-slate-800 rounded p-1 cursor-pointer"
                    value={formData.secondaryColor}
                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className="flex-1 bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-slate-100"
                    value={formData.secondaryColor}
                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Família de Fontes</label>
              <select 
                className="w-full bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100"
                value={formData.fontFamily}
                onChange={e => setFormData({...formData, fontFamily: e.target.value})}
              >
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="Montserrat">Montserrat (Modern)</option>
                <option value="Playfair Display">Playfair Display (Serif)</option>
                <option value="Roboto Mono">Roboto Mono (Monospace)</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingBrand(null); }}
                className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-400 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md"
              >
                Salvar Marca
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-700">
                      {brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} /> : <Camera className="text-slate-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">{brand.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Type size={12} /> {brand.fontFamily}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setEditingBrand(brand); setFormData(brand); }}
                      className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(brand.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: brand.secondaryColor }} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: brand.primaryColor }} />
                    {brand.primaryColor}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: brand.secondaryColor }} />
                    {brand.secondaryColor}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandKit;
