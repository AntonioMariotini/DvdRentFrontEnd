import { apiFetch } from './api';
import { type Linha, type ItinerarioDescritivo, type Horario, type UltimaPosicao } from '../Types/index';

export const transitService = {

    getLinha: (cdLinha: string) =>
        apiFetch<Linha[]>(`/linhas?cdLinha=${cdLinha}`),

    getItinerario: (cdLinha: string) =>
        apiFetch<ItinerarioDescritivo[]>(`/itinerario-descritivo?cdLinha=${cdLinha}`),

    getHorario: (cdLinha: string) =>
        apiFetch<Horario[]>(`/horario?cdLinha=${cdLinha}`),

    getPosicao: (cdLinha?: string) =>
        apiFetch<UltimaPosicao[]>(`/ultima-posicao?cdLinha=${cdLinha}`),
}