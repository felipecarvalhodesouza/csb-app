import { useLocalSearchParams } from 'expo-router'
import {
  YStack,
  Text,
  Spinner,
} from 'tamagui'
import { useRouter } from 'expo-router'
import { useState, useCallback, useEffect } from 'react'
import Jogo from './domain/jogo'
import GameCard from './componente/game-card'
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'
import { useFocusEffect } from '@react-navigation/native'
import { Tela } from './componente/layout/tela'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomeEquipe() {
  const { equipeId, nomeEquipe, torneioId } = useLocalSearchParams<{equipeId: string, nomeEquipe: string, torneioId: string}>()
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [estatisticoId, setEstatisticoId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      return;
    }

    async function carregarEstatistico() {
      const estatistico = await apiFetch<any>(`${API_BASE_URL}/estatisticos/usuario/${userId}`);
      setEstatisticoId(estatistico?.id || null)
    }

    carregarEstatistico();
  }, [userId, jogos]);


  useEffect(() => {
    async function carregarUsuario() {
      const userId = await getUserIdFromStorage();
      setUserId(userId)
    }

    carregarUsuario();
  }, []);

  async function getUserIdFromStorage() {
    try {
      const token = await AsyncStorage.getItem('session_user');

      if (!token) {
        return null;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.roles && payload.roles.includes('ADMIN')) {
        setIsAdmin(true)
      }

      return payload.userId;
    } catch (error) {
      console.error("Erro ao ler token:", error);
      return null;
    }
  }
  
const fetchJogos = useCallback(async (options: RequestInit = {}) => {
  try {
    setLoading(true)

    const data = await apiFetch<Jogo[]>(
      `${API_BASE_URL}/torneios/${torneioId}/equipes/${equipeId}/jogos`,
      options
    )

    setJogos(data)
  } catch (error) {
    setError((error as Error).message)
  } finally {
    setLoading(false)
  }
}, [torneioId, equipeId])

useFocusEffect(
  useCallback(() => {
    fetchJogos()
  }, [fetchJogos])
)

  function handleLongPress(jogo: Jogo) {
      if(jogo.status == 'PREVISTO'){
        router.push(`/selecao-atletas-partida?jogoId=${jogo.id}&torneioId=${torneioId}`)
      } else {
        router.push(`estatisticas-ao-vivo/estatisticas-ao-vivo?jogoId=${jogo.id}`)
      }
    
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

  const jogosAoVivo = jogos.filter((jogo) => jogo.streamUrl && jogo.status === 'EM_ANDAMENTO')
  const jogosPorCategoria = agruparPorCategoria(
    jogos.filter((jogo) => !jogo.streamUrl || jogo.status !== 'EM_ANDAMENTO')
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
    <Tela title={nomeEquipe} subtitle="Calendário de Jogos" equipe={equipeId} paddingHorizontal={8}>
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
                          isAdmin={isAdmin || (jogo.estatistico && jogo.estatistico.id == estatisticoId)}
                />
              ))}
            </YStack>
          )}

          {/* Demais jogos agrupados por categoria */}
          {Object.entries(jogosPorCategoria).map(([categoriaNome, jogosCategoria]) => (
            <YStack key={categoriaNome} space="$2" mt="$3">
              <Text fontWeight="600" fontSize={16} color="$gray10" pl={8}>
                {categoriaNome}
              </Text>
              {jogosCategoria.map((jogo) => (
                <GameCard key={jogo.id} 
                          jogo={jogo} 
                          onPress={() =>  router.push(`/jogo?jogoId=${jogo.id}&categoriaNome=${jogo.categoria?.nome}`)} 
                          onLongPress={handleLongPress}
                          isAdmin={isAdmin || (jogo.estatistico && jogo.estatistico.id == estatisticoId)}
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
    </Tela>
  )
}