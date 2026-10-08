import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface GeoJSONLineString {
    type: 'LineString';
    coordinates: [number, number][]; // Array de pares [longitude, latitude]
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    variant?: 'info' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    actions?: ReactNode;
}

export interface Linha {
    cdLinha: string;
    sentido: number;
    linha: GeoJSONLineString;
}

export interface Horario {
    cdLinha: string;
    hora: string;
    dias_ativos: string;
}

export interface ItinerarioDescritivo {
    cdLinha: string;
    sentido: string;
    nmSequencia: number;
    nomeVia: string;
}

export interface UltimaPosicao {
    cdLinha: string;
    prefixo: string;
    pontoLocalizacao: GeoJSONLineString;
}