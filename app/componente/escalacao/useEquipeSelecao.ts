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

  function toggleCapitao(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    const atletaSelecionado = lista.find(a => a.id === atletaId)
    
    // Se o atleta já é capitão, só permite deselecionar se houver outro capitão
    if (atletaSelecionado?.capitao) {
      setter(
        lista.map(a =>
          a.id === atletaId ? { ...a, capitao: false } : a
        )
      )
      return
    }
    
    // Se o atleta não é capitão, remove o capitão anterior e define este como novo capitão
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, capitao: true } : { ...a, capitao: false }
      )
    )
  }

  function toggleConvocado(equipe: 'mandante' | 'visitante', atletaId: number) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante
    const lista = equipe === 'mandante' ? mandante : visitante
    const atletaSelecionado = lista.find(a => a.id === atletaId)
    
    // Se o atleta está sendo desconvocado e é capitão, remove o status de capitão
    if (atletaSelecionado?.convocado && atletaSelecionado?.capitao) {
      setter(
        lista.map(a =>
          a.id === atletaId ? { ...a, convocado: false, capitao: false, titular: false } : a
        )
      )
      return
    }
    
    setter(
      lista.map(a =>
        a.id === atletaId ? { ...a, convocado: !a.convocado } : a
      )
    )
  }

  function setNumero(equipe: 'mandante' | 'visitante', atletaId: number, numero: string) {
    const setter = equipe === 'mandante' ? setMandante : setVisitante;
    const lista = equipe === 'mandante' ? mandante : visitante;
    const resultado = lista.map(a =>
      a.id === atletaId ? { ...a, numeroCamisa: numero, numeroCamisaJogo: numero } : a
    );
    setter(resultado);
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
    toggleCapitao,
    toggleConvocado,
    setNumero,
    setTodosConvocados,
  }
}
