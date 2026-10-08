import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../app/AppProvider';
import { useModules } from '../hooks/useModules';
import { Sun, Moon, LogOut, ChevronDown, ChevronUp, Menu } from 'lucide-react';

export const Headerbar: React.FC = () => {
  const { usuario, fazerLogout } = useAuth();
  const { theme, toggleTheme, activeModuleId, activeSubMenuId, toggleSidebar } = useApp();
  const { modulos } = useModules();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find active module/submenu title
  const activeMod = modulos.find(m => m.id === activeModuleId);
  const activeSub = activeMod?.subMenus?.find(s => s.id === activeSubMenuId);
  
  const titleDisplay = activeSub 
    ? `${activeMod?.nome} ❯ ${activeSub.titulo}`
    : (activeMod?.nome || 'Sistema SISMOB');
  
  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header
      style={{
        background: 'var(--semob-header-bg)',
        borderBottom: '1px solid var(--semob-header-border)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'background-color 0.3s, border-color 0.3s'
      }}
    >
      {/* Title / Breadcrumb / Mobile Hamburger Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
        <button
          onClick={toggleSidebar}
          className="show-mobile-flex"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--semob-text)',
            cursor: 'pointer',
            padding: '0.25rem',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.25rem'
          }}
          title="Alternar Menu"
        >
          <Menu size={20} />
        </button>

        <h2 
          className="header-title"
          style={{ 
            fontSize: '0.92rem', 
            fontWeight: 700, 
            color: 'var(--semob-text)', 
            margin: 0,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          {titleDisplay}
        </h2>
      </div>

      {/* Action utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--semob-text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            borderRadius: '50%'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--semob-text)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--semob-text-muted)' }}
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '20px', background: 'var(--semob-border)' }} />

        {/* Profile Dropdown Container */}
        {usuario && (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                color: 'var(--semob-text)',
                textAlign: 'left'
              }}
            >
              {/* User initials bubble */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--semob-primary) 0%, var(--semob-accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  boxShadow: '0 2px 5px rgba(37, 99, 235, 0.15)'
                }}
              >
                {getInitials(usuario.nome)}
              </div>

              {/* User text names - hidden on small mobile devices */}
              <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--semob-text)' }}>{usuario.nome.split(' ')[0]}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--semob-text-muted)' }}>{usuario.cargo}</span>
              </div>
              
              {dropdownOpen ? <ChevronUp size={14} style={{ color: 'var(--semob-text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--semob-text-muted)' }} />}
            </button>

            {/* Dropdown Overlay */}
            {dropdownOpen && (
              <div
                className="animate-scale-up"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '260px',
                  borderRadius: '0.75rem',
                  background: 'var(--semob-surface)',
                  border: '1px solid var(--semob-border)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  zIndex: 100
                }}
              >
                {/* Header Profile */}
                <div style={{ borderBottom: '1px solid var(--semob-border)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--semob-text)', fontWeight: 700 }}>{usuario.nome}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--semob-text-muted)', wordBreak: 'break-all' }}>{usuario.email}</span>
                </div>

                {/* Meta details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--semob-text-muted)' }}>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Matrícula:</span>
                    <strong style={{ color: 'var(--semob-text)' }}>{usuario.matricula}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Perfil:</span>
                    <strong style={{ color: 'var(--semob-text)' }}>{usuario.cargo}</strong>
                  </div>
                  <div className="hide-mobile" style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Dpto:</span>
                    <strong style={{ color: 'var(--semob-text)' }}>{usuario.departamento}</strong>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={fazerLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <LogOut size={14} />
                  Sair do Sistema
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Headerbar;
