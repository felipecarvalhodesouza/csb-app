import { useLocalSearchParams } from 'expo-router'
import {
  YStack,
  Text,
  Theme,
  ScrollView,
  Spinner,
} from 'tamagui'
import { useRouter } from 'expo-router'
import Footer from './footer'
import Header from './header'
import { useEffect, useState } from 'react'
import Jogo from './domain/jogo'
import GameCard from './componente/game-card'
import { apiFetch } from './utils/api'

export default function HomeEquipe() {
  const { equipeId, nomeEquipe, torneioId } = useLocalSearchParams<{equipeId: string, nomeEquipe: string, torneioId: string}>()
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  

  useEffect(() => {
    const fetchJogos = async (options: RequestInit = {}) => {
      try {
        const data = await apiFetch<Jogo[]>(`http://192.168.1.13:8080/torneios/${torneioId}/equipes/${equipeId}/jogos`, options)
        setJogos(data)
      } catch (error) {
        console.error('Error fetching jogos:', error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchJogos()
  }, [])

  function handleLongPress(jogo: Jogo) {
    router.push(`/selecao-atletas-partida?jogoId=${jogo.id}&torneioId=${torneioId}`)
  }

  function agruparPorCategoria(jogos: Jogo[]) {
    const agrupado: { [categoriaNome: string]: Jogo[] } = {}

    jogos.forEach((jogo) => {
      const nomeCategoria = jogo.categoria?.nome || 'Sem Categoria'
      if (!agrupado[nomeCategoria]) {
        agrupado[nomeCategoria] = []
      }
      agrupado[nomeCategoria].push(jogo)
    })

    return agrupado
  }

  const jogosAoVivo = jogos.filter((jogo) => jogo.streamUrl?.toLowerCase() === 'live')
  const jogosPorCategoria = agruparPorCategoria(
    jogos.filter((jogo) => jogo.streamUrl?.toLowerCase() !== 'live')
  )

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text color="$red10">{error}</Text>
      </YStack>
    )
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header title={nomeEquipe} subtitle="Calendário de Jogos" />
    
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          space="$4"
        >
          {/* Ao Vivo */}
          {jogosAoVivo.length > 0 && (
            <YStack mb="$4" space>
              <Text fontSize={16} fontWeight="600" color="$red10">
                AO VIVO
              </Text>
              {jogosAoVivo.map((jogo) => (
                <GameCard key={jogo.id} 
                          jogo={jogo} 
                          onPress={() =>  router.push(`/jogo?jogoId=${jogo.id}&categoriaNome=${jogo.categoria?.nome}`)} 
                          onLongPress={handleLongPress}
                          isAdmin={true}
                />
              ))}
            </YStack>
          )}

          {/* Demais jogos agrupados por categoria */}
          {Object.entries(jogosPorCategoria).map(([categoriaNome, jogosCategoria]) => (
            <YStack key={categoriaNome} space="$2" mt="$3">
              <Text fontWeight="600" fontSize={16} color="$gray10">
                {categoriaNome}
              </Text>
              {jogosCategoria.map((jogo) => (
                <GameCard key={jogo.id} 
                          jogo={jogo} 
                          onPress={() =>  router.push(`/jogo?jogoId=${jogo.id}&categoriaNome=${jogo.categoria?.nome}`)} 
                          onLongPress={handleLongPress}
                          isAdmin={true}
                />
              ))}
            </YStack>
          ))}

          {jogos.length === 0 && (
              <YStack f={1} jc="center" ai="center" px="$4">
              <Text fontSize={16} color="$gray10" textAlign="center">
                Nenhum jogo encontrado para esta equipe.
              </Text>
            </YStack>
          )}
        </ScrollView>

        <Footer />
      </YStack>
    </Theme>
  )
}