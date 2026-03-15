import { useState } from 'react'
import { Atleta } from '../../domain/atleta'

export function useEquipeSelecao() {
  const [mandante, setMandante] = useState<Atleta[]>([])
  const [visitante, setVisitante] = useState<Atleta[]>([])

  function toggleTitular(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, titular: !a.titular } : a
      )
    )
  }

  function toggleConvocado(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, convocado: !a.convocado } : a
      )
    )
  }

  function setNumero(equipe: 'mandante' | 'visitante', atletaId: number, numero: string) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, numero } : a
      )
    )
  }

  function setTodosConvocados(equipe: 'mandante' | 'visitante', valor: boolean) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante;
    const lista = equipe === 'mandante' ? mandante : visitante;
    const maxJogadores = 12;
    if (valor) {
      // Seleciona até o limite máximo
      let count = 0;
      setter(
        lista.map(a => {
          if (count < maxJogadores) {
            count++;
            return { ...a, convocado: true };
          }
          return { ...a, convocado: false };
        })
      );
    } else {
      setter(
        lista.map(a => {
          if (!valor && a.titular) {
            return { ...a, convocado: true };
          }
          return { ...a, convocado: valor };
        })
      );
    }
  }

  return {
    mandante,
    setMandante,
    visitante,
    setVisitante,
    toggleTitular,
    toggleConvocado,
    setNumero,
    setTodosConvocados,
  }
}
