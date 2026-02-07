
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BrandKit from './pages/BrandKit';
import Generator from './pages/Generator';
import { Brand } from './types';
import { LayoutDashboard, Palette, Zap, Menu, X, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Painel', path: '/', icon: LayoutDashboard },
    { name: 'Identidade Visual', path: '/brands', icon: Palette },
    { name: 'Gerador de IA', path: '/generate', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-20 md:hidden"
          onClick={toggle}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 w-64 transform transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">CreativeAI</h1>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && toggle()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-400'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors font-medium">
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('creative_ai_brands');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Minha Marca',
        primaryColor: '#6366f1',
        secondaryColor: '#f43f5e',
        fontFamily: 'Montserrat',
        logoUrl: 'https://picsum.photos/100/100?random=1'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('creative_ai_brands', JSON.stringify(brands));
  }, [brands]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
        <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">C</div>
              <span className="font-bold text-slate-100">CreativeAI</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>
          
          <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/brands" element={<BrandKit brands={brands} setBrands={setBrands} />} />
              <Route path="/generate" element={<Generator brands={brands} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
