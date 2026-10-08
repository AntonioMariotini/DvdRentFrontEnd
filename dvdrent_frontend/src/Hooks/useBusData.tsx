import { useEffect, useState } from "react";
import { transitService } from "../Services/transitService";
import {
  type Linha,
  type ItinerarioDescritivo,
  type Horario,
  type UltimaPosicao,
} from "../Types/index";

export const useBusLine = (cdLinha: string) => {
  const [linha, setLinha] = useState<Linha | null>(null);
  const [itinerario, setItinerario] = useState<ItinerarioDescritivo[]>([]);
  const [horario, setHorario] = useState<Horario[]>([]);
  const [posicoes, setPosicao] = useState<UltimaPosicao[]>([]);   // ← já é array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /** --------------------------------------------------------------
   *  1️⃣ Busca completa (usada apenas na primeira renderização)
   * -------------------------------------------------------------- */
  const fetchAll = async (cdLinha: string) => {
    setLoading(true);
    setError(null);
    try {
      const [
        linhaData,
        itinerarioData,
        horarioData,
        posicaoData,
      ] = await Promise.all([
        transitService.getLinha(cdLinha),
        transitService.getItinerario(cdLinha),
        transitService.getHorario(cdLinha),
        transitService.getPosicao(cdLinha), // ainda precisamos da primeira posição
      ]);

      setLinha(linhaData && linhaData.length > 0 ? linhaData[0] : null);
      setItinerario(itinerarioData || []);
      setHorario(horarioData || []);
      setPosicao(posicaoData || []);          // array → state
    } catch (e) {
      console.error("Erro ao buscar dados do ônibus:", e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  /** --------------------------------------------------------------
   *  2️⃣ Busca somente das posições (executada a cada 30 s)
   * -------------------------------------------------------------- */
  const fetchPosicoes = async (cdLinha: string) => {
    try {
      const posicaoData = await transitService.getPosicao(cdLinha);
      setPosicao(posicaoData || []);         // sobrescreve apenas as posições
    } catch (e) {
      console.error("Erro ao atualizar posições:", e);
      // Não sobrescreve `error` geral nem `loading` – a UI continua funcional
    }
  };

  /** --------------------------------------------------------------
   *  3️⃣ Efeito principal
   * -------------------------------------------------------------- */
  useEffect(() => {
    if (!cdLinha) {
      // limpa tudo quando a linha é removida
      setLinha(null);
      setItinerario([]);
      setHorario([]);
      setPosicao([]);
      return;
    }

    // 1️⃣ Busca completa na montagem ou mudança de cdLinha
    fetchAll(cdLinha);

    // 2️⃣ Intervalo de atualização das posições a cada 30 s
    const intervalId = setInterval(() => {
      fetchPosicoes(cdLinha);
    }, 30_000); // 30 000 ms = 30 s

    // 3️⃣ Cleanup – remove o timer quando cdLinha mudar ou o componente desmontar
    return () => clearInterval(intervalId);
  }, [cdLinha]); // <-- dependência apenas do código da linha

  return { linha, itinerario, horario, posicoes, loading, error };
};
