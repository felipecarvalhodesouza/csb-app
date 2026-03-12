import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import {
  YStack,
  Text,
  Spinner,
  Button,
} from 'tamagui'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import Jogo from './domain/jogo'
import GameCard from './componente/game-card'
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'
import { Tela } from './componente/layout/tela'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CategoriaJogosScreen() {
  const { torneioId, categoriaId, nomeCategoria, nomeTorneio } = useLocalSearchParams<{ torneioId:string, categoriaId: string, nomeCategoria:string, nomeTorneio: string}>()
  const router = useRouter()

  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [estatisticoId, setEstatisticoId] = useState<string | null>(null)
  
  useEffect(() => {
    if(!userId) {
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
      if(payload.roles && payload.roles.includes('ADMIN')) {
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
          const data = await apiFetch<Jogo[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/jogos`)
          setJogos(data)
        } catch (err: any) {
          setError(err.message || 'Erro desconhecido.')
        } finally {
          setLoading(false)
        }
  }, [torneioId, categoriaId])

  useFocusEffect(
    useCallback(() => {
      if (categoriaId && torneioId) {
        fetchJogos()
      }
    }, [fetchJogos])
  )

  const jogosAoVivo = jogos.filter((jogo) => jogo.transmissao?.toLowerCase() === 'live')
  const jogosNormais = jogos.filter((jogo) => jogo.transmissao?.toLowerCase() !== 'live')

  function handleLongPress(jogo: Jogo) {
      if(jogo.status == 'PREVISTO'){
        router.push(`/selecao-atletas-partida?jogoId=${jogo.id}&torneioId=${torneioId}`)
      } else {
        router.push(`estatisticas-ao-vivo/estatisticas-ao-vivo?jogoId=${jogo.id}`)
      }
  }


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
    <Tela title={nomeTorneio} subtitle={nomeCategoria}>
                    
          {/* Ao Vivo */}
          {jogosAoVivo.length > 0 && (
            <YStack mb="$4" space>
              <Text fontSize={16} fontWeight="600" color="$red10">
                AO VIVO
              </Text>
              {jogosAoVivo.map((jogo) => (
                <GameCard
                  key={jogo.id}
                  jogo={jogo}
                  onPress={() =>
                    router.push({
                      pathname: '/splash-patrocinador',
                      params: { next: `/jogo?jogoId=${jogo.id}` },
                    })
                  }
                  onLongPress={() => handleLongPress(jogo)}
                  isAdmin={isAdmin || (jogo.estatistico && jogo.estatistico.id == estatisticoId)}
                />
              ))}
            </YStack>
          )}

          {/* Demais jogos */}
          {jogosNormais.length > 0 ? (
            jogosNormais.map((jogo) => (
              <GameCard
                key={jogo.id}
                jogo={jogo}
                onPress={() =>
                  router.push({
                    pathname: '/splash-patrocinador',
                    params: { next: `/jogo?jogoId=${jogo.id}` },
                  })
                }
                onLongPress={() => handleLongPress(jogo)}
                isAdmin={isAdmin || (jogo.estatistico && jogo.estatistico.id == estatisticoId)}
              />
            ))
          ) : (
            <YStack jc="center" ai="center" mt="$6">
              <Text fontSize="$4" color="$gray10">
                Categoria sem jogos vinculados.
              </Text>
            </YStack>
          )}
  </Tela>
  )
}