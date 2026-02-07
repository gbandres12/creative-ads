
import React, { useState, useRef } from 'react';
import { Brand } from '../types';
import { supabase } from '../supabaseClient';
import { Plus, Edit2, Trash2, Camera, Type, Loader2, Upload, X as CloseIcon, Palette, FileText } from 'lucide-react';

interface BrandKitProps {
  brands: Brand[];
  onUpdate: () => void;
}

const BrandKit: React.FC<BrandKitProps> = ({ brands, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFont, setUploadingFont] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    primaryColor: '#6366f1',
    secondaryColor: '#f43f5e',
    fontFamily: 'Inter',
    logoUrl: '',
    fontFileUrl: ''
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!supabase || !event.target.files || event.target.files.length === 0) return;
      setUploadingLogo(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `logos/${Math.random()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, logoUrl: publicUrl }));
    } catch (error: any) {
      alert('Erro ao fazer upload do logo: ' + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!supabase || !event.target.files || event.target.files.length === 0) return;
      setUploadingFont(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `fonts/${Math.random()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, fontFileUrl: publicUrl }));
    } catch (error: any) {
      alert('Erro ao fazer upload da fonte: ' + error.message);
    } finally {
      setUploadingFont(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsSaving(true);

    const payload = {
      name: formData.name,
      primary_color: formData.primaryColor,
      secondary_color: formData.secondaryColor,
      font_family: formData.fontFamily,
      logo_url: formData.logoUrl,
      font_file_url: formData.fontFileUrl
    };

    try {
      if (editingBrand) {
        await supabase.from('brands').update(payload).eq('id', editingBrand.id);
      } else {
        await supabase.from('brands').insert([payload]);
      }
      setIsAdding(false);
      setEditingBrand(null);
      onUpdate();
    } catch (error: any) {
      alert('Erro ao salvar marca: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (confirm('Tem certeza que deseja excluir esta identidade visual?')) {
      await supabase.from('brands').delete().eq('id', id);
      onUpdate();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      primaryColor: '#6366f1',
      secondaryColor: '#f43f5e',
      fontFamily: 'Inter',
      logoUrl: '',
      fontFileUrl: ''
    });
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
            onClick={() => { resetForm(); setIsAdding(true); }}
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
            <div className="flex gap-6 justify-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                      {uploadingLogo ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                      <span className="text-[10px] font-bold mt-1 uppercase">Logo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                  </div>
                </div>
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </div>

              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
                  onClick={() => fontInputRef.current?.click()}
                >
                  {formData.fontFileUrl ? (
                    <div className="text-indigo-400 flex flex-col items-center">
                      <FileText size={24} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Pronta</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                      {uploadingFont ? <Loader2 size={24} className="animate-spin" /> : <Type size={24} />}
                      <span className="text-[10px] font-bold mt-1 uppercase">Fonte</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                  </div>
                </div>
                <input type="file" ref={fontInputRef} className="hidden" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome da Marca</label>
              <input 
                type="text" required
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
                  <input type="color" className="h-10 w-12 bg-slate-950 border border-slate-800 rounded p-1 cursor-pointer" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                  <input type="text" className="flex-1 bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-slate-100" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cor Secundária</label>
                <div className="flex gap-2">
                  <input type="color" className="h-10 w-12 bg-slate-950 border border-slate-800 rounded p-1 cursor-pointer" value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} />
                  <input type="text" className="flex-1 bg-slate-950 px-4 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-slate-100" value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome da Família (Fallback)</label>
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
              <button type="button" disabled={isSaving} onClick={() => { setIsAdding(false); setEditingBrand(null); }} className="flex-1 px-4 py-2.5 border border-slate-800 text-slate-400 rounded-lg font-semibold hover:bg-slate-800 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSaving || uploadingLogo || uploadingFont} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2">
                {(isSaving || uploadingLogo || uploadingFont) && <Loader2 className="animate-spin" size={18} />}
                {isSaving ? 'Salvando...' : 'Salvar Marca'}
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
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                      {brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 font-bold">{brand.name.charAt(0)}</div>}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">{brand.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Type size={12} /> {brand.fontFamily} {brand.fontFileUrl && '(Customizada)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingBrand(brand); setFormData(brand); }} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(brand.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: brand.secondaryColor }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: brand.primaryColor }} />{brand.primaryColor}</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: brand.secondaryColor }} />{brand.secondaryColor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {brands.length === 0 && !isAdding && !editingBrand && (
        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <Palette className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-500">Nenhuma marca cadastrada. Comece adicionando uma identidade visual.</p>
        </div>
      )}
    </div>
  );
};

export default BrandKit;
