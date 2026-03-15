import React, { useState, useEffect } from 'react'
import { YStack, Separator, Spinner, Button } from 'tamagui'
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
  const { jogoId, torneioId, modo } = useLocalSearchParams<{ jogoId: string, torneioId: string, modo?: string }>()
  const isModoAtrasado = modo === 'adicionar_atrasado'
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

        if(isModoAtrasado) {
          // Preenche os atletas já convocados/titulares para modo atrasado
          setMandante(jogoData.atletasMandante || [])
          setVisitante(jogoData.atletasVisitante || [])
        }

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

        if(isModoAtrasado) {
          // Sincroniza o estado dos atletas com os já convocados/titulares do jogo
          setMandante(prev => prev.map(a => {
            const escalado = jogo.atletasMandante.find(am => am.atleta.id === a.id)
            return escalado ? { ...a, convocado: true, titular: escalado.titular, numeroCamisaJogo: escalado.numero, persistido: true } : a
          }))
          setVisitante(prev => prev.map(a => {
            const escalado = jogo.atletasVisitante.find(av => av.atleta.id === a.id)
            return escalado ? { ...a, convocado: true, titular: escalado.titular, numeroCamisaJogo: escalado.numero, persistido: true } : a
          }))
        }
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

  async function handleIncluirJogadores() {
    if (!jogo) return
    setLoading(true)
    try {


      const atletasMandante = mandante.filter(a => a.convocado && !a.persistido).map(a => ({
        atletaId: a.id,
        titular: false,
        numero: a.numero,
      }))

      const atletasVisitante = visitante.filter(a => a.convocado && !a.persistido).map(a => ({
        atletaId: a.id,
        titular: false,
        numero: a.numero,
      }))

      var inclusaoAtletasEscaladosPayload: any = {
        jogoId: jogo.id,
        atletasMandante: atletasMandante,
        atletasVisitante: atletasVisitante,
      }

      await apiPut(`${API_BASE_URL}/jogos/${jogo.id}/jogadores`, inclusaoAtletasEscaladosPayload)

      router.back() 
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
            modo={modo}
          />
        )}
        <Separator />
        {!isModoAtrasado ? (
          <IniciarJogoButton onPress={handleIniciar} disabled={isButtonDisabled()} />
        ) : (
          <Button theme="active" onPress={handleIncluirJogadores}>
            Incluir Jogadores
          </Button>
        )}
    </Tela>
  )
}