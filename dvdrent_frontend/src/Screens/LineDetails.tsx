import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBusLine } from '../Hooks/useBusData';
import { BusMap } from '../Components/BusMap';

export const LineDetails: React.FC = () => {
    const [showHorarios, setShowHorarios] = useState(false);
    const [showItinerario, setShowItinerario] = useState(false);

    const { cdLinha } = useParams<{ cdLinha: string }>();
    const navigate = useNavigate();

    const { linha, itinerario = [], horario = [], posicoes, loading, error } = useBusLine(cdLinha || '');

    const itinerarioIda = itinerario.filter(ponto =>
        ponto.sentido && ponto.sentido.toUpperCase().includes('IDA')
    );

    const itinerarioVolta = itinerario.filter(ponto =>
        ponto.sentido && ponto.sentido.toUpperCase().includes('VOLTA')
    );

    // Detect circular routes: if no ida or volta points but itinerary exists, treat as circular
    const isCircular = itinerarioIda.length === 0 && itinerarioVolta.length === 0 && itinerario.length > 0;
    const itinerarioCircular = isCircular ? itinerario : [];

    return (
        <div style={{ padding: '24px', maxWidth: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '8px 16px',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: '1px solid #007bff',
                    backgroundColor: '#fff',
                    color: '#007bff',
                    fontWeight: 'bold'
                }}
            >
                ← Voltar para Busca
            </button>

            <h2>Detalhes da Linha: {cdLinha}</h2>

            {loading && <div style={{ padding: '20px', color: '#555' }}>Carregando dados da linha {cdLinha}...</div>}

            {error && (
                <div style={{ padding: '16px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '20px' }}>
                    Erro ao carregar os dados: {error.message}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Mapa Interativo OpenStreetMap */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '12px' }}>📍 Rota e Posição em Tempo Real</h3>
                        <BusMap linha={linha} posicoes={posicoes} />
                    </div>

                    {/* Seção de Horários */}
                    <div style={{ marginBottom: '28px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '8px', overflow: 'hidden' }}>
                        {/* Cabeçalho Clicável */}
                        <div
                            onClick={() => setShowHorarios(!showHorarios)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                        >
                            <h3 style={{ margin: '0 auto' }}>🕒 Horários</h3>
                            <span style={{ fontSize: '14px', color: '#666' }}>{showHorarios ? '▲' : '▼'}</span>
                        </div>

                        {/* Conteúdo Retrátil */}
                        {showHorarios && (
                            <div style={{ padding: '0 16px 16px 16px' }}>
                                {horario.length === 0 ? (
                                    <p style={{ color: '#777' }}>Nenhum horário encontrado para esta linha.</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', margin: 0 }}>
                                        {horario.map((item, index) => (
                                            <li key={index} style={{ padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.hora}</div>
                                                <div style={{ fontSize: '11px', color: '#666' }}>{item.dias_ativos}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Seção de Itinerário Descritivo */}
                    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                        {/* Cabeçalho Clicável */}
                        <div
                            onClick={() => setShowItinerario(!showItinerario)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                        >
                            <h3 style={{ margin: '0 auto' }}>🗺️ Itinerário Descritivo</h3>
                            <span style={{ fontSize: '14px', color: '#666' }}>{showItinerario ? '▲' : '▼'}</span>
                        </div>

                        {/* Conteúdo Retrátil */}
                        {showItinerario && (
                            <div style={{ padding: '0 16px 16px 16px' }}>
                                {itinerario.length === 0 ? (
                                    <p style={{ color: '#777' }}>Nenhum itinerário descritivo encontrado.</p>
                                ) : (
                                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                        {isCircular ? (
                                            /* Rota Circular */
                                            <div style={{ flex: 1, minWidth: '250px' }}>
                                                <h4 style={{ color: '#6f42c1', borderBottom: '2px solid #6f42c1', paddingBottom: '8px' }}>
                                                    Sentido: Circular
                                                </h4>
                                                <ol style={{ paddingLeft: '20px' }}>
                                                    {itinerarioCircular.map((ponto, index) => (
                                                        <li key={`cic-${index}`} style={{ padding: '6px 0', borderBottom: index < itinerarioCircular.length - 1 ? '1px solid #eee' : 'none' }}>
                                                            <strong>{ponto.nomeVia}</strong>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        ) : (
                                            /* Layout para Ida/Volta */
                                            <>
                                                {/* Coluna da IDA */}
                                                <div style={{ flex: 1, minWidth: '250px' }}>
                                                    <h4 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>
                                                        Sentido: Ida
                                                    </h4>
                                                    {itinerarioIda.length > 0 ? (
                                                        <ol style={{ paddingLeft: '20px' }}>
                                                            {itinerarioIda.map((ponto, index) => (
                                                                <li key={`ida-${index}`} style={{ padding: '6px 0', borderBottom: index < itinerarioIda.length - 1 ? '1px solid #eee' : 'none' }}>
                                                                    <strong>{ponto.nomeVia}</strong>
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    ) : (
                                                        <p style={{ color: '#777', fontSize: '14px' }}>Sem dados de ida.</p>
                                                    )}
                                                </div>

                                                {/* Coluna da VOLTA */}
                                                <div style={{ flex: 1, minWidth: '250px' }}>
                                                    <h4 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '8px' }}>
                                                        Sentido: Volta
                                                    </h4>
                                                    {itinerarioVolta.length > 0 ? (
                                                        <ol style={{ paddingLeft: '20px' }}>
                                                            {itinerarioVolta.map((ponto, index) => (
                                                                <li key={`volta-${index}`} style={{ padding: '6px 0', borderBottom: index < itinerarioVolta.length - 1 ? '1px solid #eee' : 'none' }}>
                                                                    <strong>{ponto.nomeVia}</strong>
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    ) : (
                                                        <p style={{ color: '#777', fontSize: '14px' }}>Sem dados de volta.</p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};