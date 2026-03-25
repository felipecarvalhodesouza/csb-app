import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { FlatList } from 'react-native';
import Jogo from './domain/jogo';
import Torneio from './domain/torneio';
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'
import { YStack, Text, Spinner } from 'tamagui';
import {Tela } from './componente/layout/tela';
import GameCard from './componente/game-card';
import { Page } from './types/page';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TorneiosScreen() {
  const router = useRouter()
  const params = useLocalSearchParams();
  const modalidadeId = params.id;
  const [torneioEmAndamento, setTorneioEmAndamento] = useState<Torneio | null>(null);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [estatisticoId, setEstatisticoId] = useState<string | null>(null)

  const fetchTorneioEmAndamento = useCallback(async () => {
    try {
      const data = await apiFetch<Torneio[]>(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`);
      const torneio = data.find(t => t.status === 'EM_ANDAMENTO');
      setTorneioEmAndamento(torneio || null);
    } catch (error) {
      console.error('Error fetching torneio:', error);
    }
  }, [modalidadeId]);

  const fetchJogos = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    if (!torneioEmAndamento || reachedLimit) return;
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const data = await apiFetch<Page<Jogo>>(`${API_BASE_URL}/torneios/${torneioEmAndamento.id}/jogos?page=${pageNum}&size=5&sort=data,desc`);

      setJogos(prevJogos => {
        const newContent = append ? [...prevJogos, ...data.content] : data.content;

        if (newContent.length >= 50) {
          setReachedLimit(true);
          setHasMore(false);
          return newContent.slice(0, 50);
        }

        setHasMore(data.content.length === 5);
        return newContent;
      });

      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching jogos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [torneioEmAndamento, reachedLimit]);

  useEffect(() => {
    fetchTorneioEmAndamento();
  }, [fetchTorneioEmAndamento]);

  useEffect(() => {
    if (torneioEmAndamento) {
      fetchJogos();
    }
  }, [torneioEmAndamento, fetchJogos]);

  function handleLongPress(jogo: Jogo) {
    if (jogo.status == 'PREVISTO') {
      router.push(`/selecao-atletas-partida?jogoId=${jogo.id}&torneioId=${torneioEmAndamento.id}`)
    } else {
      router.push(`estatisticas-ao-vivo/estatisticas-ao-vivo?jogoId=${jogo.id}`)
    }
  }

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

  const renderItem = ({ item }: { item: Jogo }) => (
    <>
    <GameCard
      jogo={item}
      onPress={() =>
        router.push({
          pathname: '/splash-patrocinador',
          params: { next: `/jogo?jogoId=${item.id}` },
        })
      }
      onLongPress={() => handleLongPress(item)}
      isAdmin={isAdmin || (item.estatistico && item.estatistico.id == estatisticoId)}
      categoria={item.categoria.nome}
    />
    </>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <YStack jc="center" ai="center" p="$4">
        <Spinner size="small" color="$blue10" />
        <Text fontSize={14} color="$gray10" mt="$2">Carregando mais jogos...</Text>
      </YStack>
    );
  };

  const onEndReached = () => {
    if (hasMore && !loadingMore && torneioEmAndamento && !reachedLimit) {
      fetchJogos(page + 1, true);
    }
  };

  return (
    <Tela title="Últimos Jogos" subtitle={torneioEmAndamento?.nome} scroll={false}>
      {loading ? (
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" color="$blue10" />
        </YStack>
      ) : !torneioEmAndamento ? (
        <YStack f={1} jc="center" ai="center" px="$4">
          <Text fontSize={16} color="$gray10" textAlign="center">
            Nenhum torneio em andamento encontrado para esta modalidade
          </Text>
        </YStack>
      ) : jogos.length === 0 ? (
        <YStack f={1} jc="center" ai="center" px="$4">
          <Text fontSize={16} color="$gray10" textAlign="center">
            Nenhum jogo encontrado para este torneio
          </Text>
        </YStack>
      ) : (
        <YStack flex={1}>
          <FlatList
            data={jogos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }} // alinhado
          />
          {reachedLimit && (
            <YStack jc="center" ai="center" p="$4">
              <Text fontSize={14} color="$gray10" textAlign="center">
                Limite de 50 jogos exibidos atingido. Acesse a categoria para uma visão geral do campeonato.
              </Text>
            </YStack>
          )}
        </YStack>
      )}
    </Tela>
  );
}
