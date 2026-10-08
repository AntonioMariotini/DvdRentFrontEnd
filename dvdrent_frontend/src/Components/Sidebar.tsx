import React, { useState, useEffect } from 'react';
import { useModules } from '../hooks/useModules';
import { useApp } from '../app/AppProvider';
import {
  LayoutDashboard,
  Building2,
  Shield,
  ShieldCheck,
  Server,
  Users,
  Key,
  ChevronDown,
  ChevronRight,
  Route,
  Bus,
  FileText,
  CreditCard,
  Lock,
  Terminal,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Building2,
  Shield,
  ShieldCheck,
  Server,
  Users,
  Key,
  Route,
  Bus,
  FileText,
  CreditCard,
  Lock,
  Terminal
};

const IconRenderer: React.FC<{ name?: string; className?: string; size?: number; style?: React.CSSProperties }> = ({ name, className, size = 20, style }) => {
  if (!name) return null;
  const Component = iconMap[name];
  if (!Component) return <Shield className={className} size={size} style={style} />;
  return <Component className={className} size={size} style={style} />;
};

export const Sidebar: React.FC = () => {
  const { modulos } = useModules();
  const { activeModuleId, activeSubMenuId, navegarPara, sidebarOpen, toggleSidebar } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    suop: true,
    cdp: true,
    sif: true
  });

  // Track window resizing locally for responsive layouts
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false); // Collapsing icons doesn't make sense on drawer
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Determine rendering layout style
  const sidebarStyle: React.CSSProperties = isMobile
    ? {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '260px',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      background: 'var(--semob-sidebar-bg)',
      borderRight: '1px solid var(--semob-sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 2000,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: sidebarOpen ? '0 0 25px rgba(0, 0, 0, 0.5)' : 'none',
    }
    : {
      width: collapsed ? '70px' : '260px',
      background: 'var(--semob-sidebar-bg)',
      borderRight: '1px solid var(--semob-sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 50,
      flexShrink: 0
    };

  return (
    <>
      {/* Dimmed Overlay on Mobile when Sidebar drawer is active */}
      {isMobile && sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      <aside style={sidebarStyle}>
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--semob-sidebar-border)',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, var(--semob-primary) 0%, var(--semob-accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
              }}
            >
              S
            </div>
            {(!collapsed || isMobile) && (
              <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease-in-out' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '0.5px' }}>SISMOB</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--semob-sidebar-text-active)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  BOILERPLATE DF
                </span>
              </div>
            )}
          </div>

          {/* Close button on Mobile drawer */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Modules list */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto'
          }}
        >
          {modulos.map((mod) => {
            const isModuleActive = activeModuleId === mod.id;
            const hasSubmenus = mod.subMenus && mod.subMenus.length > 0;
            const isExpanded = expandedModules[mod.id];

            return (
              <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* Module Main Entry */}
                <button
                  onClick={() => {
                    if (hasSubmenus) {
                      toggleExpand(mod.id);
                    } else {
                      navegarPara(mod.id, null);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: isModuleActive && !hasSubmenus ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isModuleActive ? 'var(--semob-sidebar-text-active)' : 'var(--semob-sidebar-text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    fontWeight: isModuleActive ? 600 : 500,
                    fontSize: '0.9rem'
                  }}
                  title={collapsed && !isMobile ? mod.nome : undefined}
                >
                  {/* Active Indicator bar */}
                  {isModuleActive && !hasSubmenus && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        height: '70%',
                        width: '3px',
                        background: '#3b82f6',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}

                  <IconRenderer name={mod.icone} className="flex-shrink-0" />

                  {(!collapsed || isMobile) && (
                    <>
                      <span style={{ marginLeft: '0.75rem', flex: 1 }}>{mod.nome}</span>
                      {hasSubmenus && (
                        isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </>
                  )}
                </button>

                {/* Submenus Render */}
                {hasSubmenus && isExpanded && (!collapsed || isMobile) && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingLeft: '1.25rem',
                      borderLeft: '1px solid var(--semob-sidebar-border)',
                      marginLeft: '1.25rem',
                      gap: '0.2rem',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    {mod.subMenus?.map((sub) => {
                      const isSubActive = activeSubMenuId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => navegarPara(mod.id, sub.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            background: isSubActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            color: isSubActive ? 'var(--semob-sidebar-text-active)' : 'var(--semob-sidebar-text)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.82rem',
                            fontWeight: isSubActive ? 600 : 500,
                            transition: 'all 0.2s'
                          }}
                        >
                          <IconRenderer name={sub.icone} size={14} style={{ marginRight: '0.5rem' }} />
                          <span>{sub.titulo}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse Trigger Button (Hidden on Mobile) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              border: 'none',
              background: 'none',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-end',
              color: '#475569',
              cursor: 'pointer',
              borderTop: '1px solid var(--semob-sidebar-border)',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f1f5f9' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
          >
            {collapsed ? <ChevronRightIcon size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </aside>
    </>
  );
};
export default Sidebar;
