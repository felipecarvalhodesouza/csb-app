import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Tabs, XStack, ScrollView } from 'tamagui'
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
      const COL = {
        pos: { flexBasis: 0, flexGrow: 1, flexShrink: 1 },
        name: { flexBasis: 0, flexGrow: 2, flexShrink: 1 },
        stat: { flexBasis: 0, flexGrow: 1, flexShrink: 1 }
      }
    const [tab, setTab] = useState<'jogos' | 'classificacao'>('jogos');
    const [classificacao, setClassificacao] = useState<any[]>([]);
    const [loadingClassificacao, setLoadingClassificacao] = useState(false);
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
        fetchJogos();
      }
    }, [fetchJogos])
  )

  useEffect(() => {
    if (tab === 'classificacao' && categoriaId && torneioId) {
      setLoadingClassificacao(true);
      apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/fases/classificacao`)
        .then(data => setClassificacao(data))
        .catch(() => setClassificacao([]))
        .finally(() => setLoadingClassificacao(false));
    }
  }, [tab, categoriaId, torneioId]);

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
      <Tabs
        value={tab}
        onValueChange={v => setTab(v as 'jogos' | 'classificacao')}
        ml="$4"
        mr="$4"
      >
        <Tabs.List
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          mb="$2"
        >
          <Tabs.Tab value="jogos" flex={1}>
            <Text>Jogos</Text>
          </Tabs.Tab>
          <Tabs.Tab value="classificacao" flex={1}>
            <Text>Classificação</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {tab === 'jogos' && jogosAoVivo.length > 0 && (
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

        {tab === 'jogos' && jogosNormais.length > 0 ? (
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
        ) : (tab === 'jogos' && jogosNormais.length === 0 ? (
          <YStack jc="center" ai="center" mt="$6">
            <Text fontSize="$4" color="$gray10">
              Categoria sem jogos vinculados.
            </Text>
          </YStack>
        ) : null)}

      {tab === 'classificacao' && (
        <YStack space="$4" mt="$4">
          {loadingClassificacao ? (
            <YStack f={1} jc="center" ai="center">
              <Spinner size="large" />
            </YStack>
          ) : (
            <ScrollView>
              {classificacao.length === 0 ? (
                <Text color="$gray10">Nenhuma classificação disponível.</Text>
              ) : (
                classificacao.map((fase, idxFase) => (
                  <YStack key={idxFase} mb="$6">
                    <Text fontSize={18} fontWeight="700" color="$gray12" mb="$2">{fase.nomeFase}</Text>
                    {fase.classificacaoChaves.map((chave, idxChave) => (
                      <YStack key={idxChave} mb="$4">
                        <Text fontSize={16} fontWeight="700" color="$gray12" mb="$2">{chave.chave}</Text>
                        <XStack bg="$gray5" p="$2">
                          <Text {...COL.pos} textAlign="center" fontWeight="600">POS</Text>
                          <Text {...COL.name} fontWeight="600">Equipe</Text>
                          <Text {...COL.stat} textAlign="center" fontWeight="600">JGS</Text>
                          <Text {...COL.stat} textAlign="center" fontWeight="600">VIT</Text>
                          <Text {...COL.stat} textAlign="center" fontWeight="600">DER</Text>
                        </XStack>
                        {chave.classificacao.map((item, i) => (
                          <XStack
                            key={i}
                            p="$2"
                            bg={i % 2 === 0 ? '$background' : '$gray2'}
                          >
                            <Text {...COL.pos} textAlign="center">{item.posicao}</Text>
                            <Text {...COL.name} numberOfLines={1} ellipsizeMode="tail">{item.equipe}</Text>
                            <Text {...COL.stat} textAlign="center">{item.jogos}</Text>
                            <Text {...COL.stat} textAlign="center">{item.vitorias}</Text>
                            <Text {...COL.stat} textAlign="center">{item.derrotas}</Text>
                          </XStack>
                        ))}
                      </YStack>
                    ))}
                  </YStack>
                ))
              )}
            </ScrollView>
          )}
        </YStack>
      )}
  </Tela>
  )
}