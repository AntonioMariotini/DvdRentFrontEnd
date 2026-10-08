import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../Components/SearchBar';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = (cdLinha: string) => {
        if (cdLinha.trim()) {
            navigate(`/linha/${encodeURIComponent(cdLinha.trim())}`);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>🚌 Novo Info Ônibus</h1>
            <p style={{ color: '#555', marginBottom: '20px' }}>
                Digite o código da linha para visualizar horários, itinerário e localização.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
                <SearchBar onSearch={handleSearch} />
            </div>
        </div>
    );
};