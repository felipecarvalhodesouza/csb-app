import React, { useState, useEffect } from 'react'
import { YStack, Separator, Spinner } from 'tamagui'
import Jogo from './domain/jogo'
import { Atleta } from './domain/atleta'
import { apiFetch, apiPut } from './utils/api'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import { API_BASE_URL } from '../utils/config'
import { Tela } from './componente/layout/tela'
import { EquipeSelecao } from './componente/escalacao/EquipeSelecao'
import { EquipeTabs } from './componente/escalacao/EquipeTabs'
import { IniciarJogoButton } from './componente/escalacao/IniciarJogoButton'
import { useEquipeSelecao } from './componente/escalacao/useEquipeSelecao'
type GameEditScreenProps = {
  onIniciar: (jogoEditado: Jogo) => void
}

export default function GameEditScreen({
  onIniciar
}: GameEditScreenProps) {
  const { jogoId, torneioId } = useLocalSearchParams()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [loading, setLoading] = useState(true)
  const { mandante, setMandante,
          visitante, setVisitante,
          toggleTitular, toggleConvocado,
          setNumero, setTodosConvocados
        } = useEquipeSelecao()
  const [tab, setTab] = useState<'mandante' | 'visitante'>('mandante')
  const router = useRouter()

  useEffect(() => {
    async function fetchJogo() {
      setLoading(true)
      try {
        const jogoData = await apiFetch<Jogo>(`${API_BASE_URL}/jogos/${jogoId}`)
        setJogo(jogoData)
      } finally {
        setLoading(false)
      }
    }
    fetchJogo()
  }, [jogoId])

  useEffect(() => {
    async function fetchAtletas() {
      setLoading(true)
      if (!jogo) return
      try {
        const [mandanteAtletas, visitanteAtletas] = await Promise.all([
          apiFetch<Atleta[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${jogo.categoria.id}/equipes/${jogo.mandante.id}/atletas`),
          apiFetch<Atleta[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${jogo.categoria.id}/equipes/${jogo.visitante.id}/atletas`),
        ])
        setMandante(mandanteAtletas)
        setVisitante(visitanteAtletas)
      } finally {
        setLoading(false)
      }
    }
    fetchAtletas()
  }, [jogo])

  async function handleIniciar() {
    if (!jogo) return
    setLoading(true)
    try {

      var jogoEditado: any = {
        jogoId: jogo.id,
        atletasMandante: mandante.filter(a => a.convocado).map(a => ({
          atletaId: a.id,
          titular: !!a.titular,
          numero: a.numero,
        })),
        atletasVisitante: visitante.filter(a => a.convocado).map(a => ({
          atletaId: a.id,
          titular: !!a.titular,
          numero: a.numero,
        })),
      }

      await apiPut(`${API_BASE_URL}/jogos/${jogo.id}`, jogoEditado)

      // Sucesso: navega para a tela de estatísticas ao vivo
      router.replace(`estatisticas-ao-vivo/estatisticas-ao-vivo?jogoId=${jogo.id}`)
    } catch (e) {
      alert('Erro ao iniciar o jogo')
    } finally {
      setLoading(false)
    }
  }

  function isButtonDisabled() {
    // 5 titulares em cada time
    const mandanteTitulares = mandante.filter(a => a.titular).length
    const visitanteTitulares = visitante.filter(a => a.titular).length

    // Números de camiseta únicos entre convocados
    const hasNumeroRepetido = (lista: Atleta[]) => {
      const numeros = lista.filter(a => a.convocado && a.numero).map(a => a.numero)
      return numeros.some((num, idx, arr) => arr.indexOf(num) !== idx)
    }

    return (
      loading ||
      mandanteTitulares !== 5 ||
      visitanteTitulares !== 5 ||
      hasNumeroRepetido(mandante) ||
      hasNumeroRepetido(visitante)
    )
  }

  if (loading || !jogo) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <Tela title='Seleção de Atletas'>
      <YStack p="$4" space="$4">
        <EquipeTabs
          tab={tab}
          setTab={setTab}
          mandanteNome={String(jogo.mandante.nome)}
          visitanteNome={String(jogo.visitante.nome)}
        />
        <Separator />
        {['mandante', 'visitante'].includes(tab) && (
          <EquipeSelecao
            atletas={tab === 'mandante' ? mandante : visitante}
            onToggleTitular={id => toggleTitular(tab, id)}
            onToggleConvocado={id => toggleConvocado(tab, id)}
            onSetNumero={(id, num) => setNumero(tab, id, num)}
            onSetTodosConvocados={valor => setTodosConvocados(tab, valor)}
            maxTitulares={5}
            maxJogadores={12}
            equipeNome={tab === 'mandante' ? jogo.mandante.nome : jogo.visitante.nome}
          />
        )}
        <Separator />
        <IniciarJogoButton onPress={handleIniciar} disabled={isButtonDisabled()} />
      </YStack>
    </Tela>
  )
}