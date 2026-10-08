import React, { useState } from 'react';

// 1. Interface que define a prop 'onSearch' recebida pelo componente
interface SearchBarProps {
  onSearch: (cdLinha: string) => void;
}

// 2. Passa a interface para o genérico React.FC<SearchBarProps>
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [cdLinha, setCdLinha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cdLinha.trim() !== '') {
      onSearch(cdLinha.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input 
        type="text" 
        value={cdLinha}
        onChange={(e) => setCdLinha(e.target.value)} 
        placeholder="Digite a linha (ex: 110.2)"
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
      />
      
      <button 
        type="submit"
        style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Buscar
      </button>
    </form>
  );
};
