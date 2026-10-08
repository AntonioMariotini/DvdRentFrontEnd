import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type Linha, type UltimaPosicao } from '../Types';

// Ícone personalizado para o ônibus
const busIcon = L.divIcon({
    className: 'custom-bus-marker',
    html: `
        <div style="
            background-color: #007bff;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(40, 167, 69, 0.7);
            border: 2px solid white;
            font-size: 18px;
        ">
            🚌
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const startIcon = L.divIcon({
    className: 'custom-start-marker',
    html: `
        <div style="
            background-color: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 1px solid white;
        ">
            Início
        </div>
    `,
    iconSize: [50, 24],
    iconAnchor: [25, 12],
});

const endIcon = L.divIcon({
    className: 'custom-end-marker',
    html: `
        <div style="
            background-color: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 1px solid white;
        ">
            Fim
        </div>
    `,
    iconSize: [40, 24],
    iconAnchor: [25, 12],
});

interface BusMapProps {
    linha?: Linha | null;
    posicoes?: UltimaPosicao[]; // Aceita uma lista de ônibus
}

// Tipo auxiliar para cada ônibus processado
interface BusItem {
    id: string | number;
    coords: [number, number];
    raw: UltimaPosicao;
}

// Ajusta o zoom e foco do mapa considerando a rota e TODOS os ônibus
const MapRecenter: React.FC<{ polylineCoords: [number, number][]; buses: BusItem[] }> = ({ polylineCoords, buses }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([]);

        if (polylineCoords.length > 0) {
            polylineCoords.forEach((coord) => bounds.extend(coord));
        }

        if (buses.length > 0) {
            buses.forEach((bus) => bounds.extend(bus.coords));
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [polylineCoords, buses, map]);

    return null;
};

export const BusMap: React.FC<BusMapProps> = ({ linha, posicoes = [] }) => {
    // Converter coordenadas GeoJSON da Polyline [lng, lat] -> [lat, lng]
    const polylineCoords: [number, number][] = React.useMemo(() => {
        if (!linha?.linha?.coordinates) return [];
        return linha.linha.coordinates.map((coord) => [coord[1], coord[0]]);
    }, [linha]);

    // Tratar a lista de ônibus e converter coordenadas [lng, lat] -> [lat, lng]
    const buses: BusItem[] = React.useMemo(() => {
        return posicoes
            .map((pos, index) => {
                const coords = pos.pontoLocalizacao?.coordinates;
                if (!coords) return null;

                let latLng: [number, number];
                if (Array.isArray(coords[0])) {
                    const first = coords[0] as unknown as [number, number];
                    latLng = [first[1], first[0]];
                } else {
                    const point = coords as unknown as [number, number];
                    latLng = [point[1], point[0]];
                }

                return {
                    id: pos.prefixo || index,
                    coords: latLng,
                    raw: pos,
                };
            })
            .filter((item): item is BusItem => item !== null);
    }, [posicoes]);

    const defaultCenter: [number, number] =
        buses.length > 0
            ? buses[0].coords
            : polylineCoords.length > 0
            ? polylineCoords[0]
            : [-15.7942, -47.8822];

    return (
        <div style={{ height: '720px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ajuste automático considerando a linha e todos os ônibus */}
                <MapRecenter polylineCoords={polylineCoords} buses={buses} />

                {/* Linha da Rota */}
                {polylineCoords.length > 0 && (
                    <>
                        <Polyline
                            positions={polylineCoords}
                            pathOptions={{ color: '#007bff', weight: 5, opacity: 0.8 }}
                        />
                        <Marker position={polylineCoords[0]} icon={startIcon}>
                            <Popup>Início da Linha {linha?.cdLinha}</Popup>
                        </Marker>
                        <Marker position={polylineCoords[polylineCoords.length - 1]} icon={endIcon}>
                            <Popup>Fim da Linha {linha?.cdLinha}</Popup>
                        </Marker>
                    </>
                )}

                {/* Renderizar TODOS os ônibus ativos */}
                {buses.map((bus) => (
                    <Marker key={bus.id} position={bus.coords} icon={busIcon}>
                        <Popup>
                            <div>
                                <strong>🚌 Ônibus {bus.raw.prefixo ? `(Prefixo ${bus.raw.prefixo})` : ''}</strong>
                                <br />
                                Linha: {linha?.cdLinha || bus.raw.cdLinha}
                                <br />
                                Localização: {bus.coords[0].toFixed(5)}, {bus.coords[1].toFixed(5)}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};