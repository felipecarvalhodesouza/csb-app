import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, Text, Spinner, View, Button } from 'tamagui';
import { API_BASE_URL } from '../../../utils/config';
import { Tela } from '../../componente/layout/tela';
import { apiFetch, apiPost } from '../../utils/api';
import Fase from '../../domain/fase';
import FloatingActionButton from '../../componente/FloatingActionButton';
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function FaseConsultaScreen() {
  const { faseId, torneioId, categoriaId } = useLocalSearchParams<{ faseId: string, torneioId: string, categoriaId: string }>();
  const [gerandoJogos, setGerandoJogos] = useState(false);
  const [gerarJogosMsg, setGerarJogosMsg] = useState<string | null>(null);
  const router = useRouter();
  const [fase, setFase] = useState<Fase | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFase = useCallback(async () => {
    async function fetchFase() {
      setLoading(true);
      try {
        const data = await apiFetch<Fase>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/fases/${faseId}`);
        setFase(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (faseId && torneioId && categoriaId) fetchFase();
  }, [faseId, torneioId, categoriaId]);

  useFocusEffect(
    useCallback(() => {
      fetchFase()
    }, [fetchFase])
  )

  return (
    <Tela title={`Gerenciar Fase`}>
      {loading ? (
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" color="$gray10" />
        </YStack>
      ) : (
        <>
          <View bg="$gray2" br="$8" p="$3" ai="center" mb="$4" shadowColor="#000" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.10} shadowRadius={6} elevation={4}>
            <Text fontSize={16} color="$gray10" fontWeight="500">
              Série {fase?.nome}
            </Text>
          </View>
          <YStack space="$3" bg="$gray1" br="$8" p="$4">
            {fase?.tipoFase === 'CLASSIFICACAO' && (
              <Text fontSize={15} color="$gray12" fontWeight="600">Número de classificados: <Text color="$gray10">{fase?.numeroClassificados}</Text></Text>
            )}
            <Text fontSize={15} color="$gray12" fontWeight="600">Ida e volta: <Text color={fase?.idaVolta ? '$gray10' : '$gray6'}>{fase?.idaVolta ? 'Sim' : 'Não'}</Text></Text>
            {fase?.tipoFase === 'CLASSIFICACAO' && (
              <Text fontSize={15} color="$gray12" fontWeight="600">Número de chaves: <Text color="$gray10">{fase?.chaves?.length}</Text></Text>
            )} 
            <Text fontSize={15} color="$gray12" fontWeight="600">Ordem: <Text color="$gray10">{fase?.ordem}</Text></Text>
            
            {/* Exibe as chaves e equipes */}
            {fase?.chaves && fase.chaves.length > 0 && (
              <YStack space="$4" mt="$6">
                {fase.chaves.map(chave => (
                  <View key={chave.id} bg="$gray2" br="$6" p="$3" mb="$2">
                    <Text fontSize={16} fontWeight="700" color="$gray12" mb="$2">{chave.nome}</Text>
                    {chave.equipes && chave.equipes.length > 0 ? (
                      <YStack space="$1">
                        {chave.equipes.map((equipe, idx) => (
                          <Text key={idx} fontSize={15} color="$gray10">{equipe}</Text>
                        ))}
                      </YStack>
                    ) : (
                      <Text fontSize={14} color="$gray6">Nenhuma equipe vinculada</Text>
                    )}
                  </View>
                ))}
              </YStack>
            )}

            <Button
              bg="$black"
              color="white"
              fontWeight="700"
              mt="$4"
              disabled={gerandoJogos}
              onPress={async () => {
                setGerandoJogos(true);
                setGerarJogosMsg(null);

                try{
                    await apiPost(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/fases/${faseId}/jogos`, {})
                    setGerarJogosMsg('Jogos gerados com sucesso!');
                } catch (err) {
                  setGerarJogosMsg('Erro ao gerar jogos.');
                } finally {
                  setGerandoJogos(false);
                }
              }}
            >{gerandoJogos ? 'Gerando...' : 'Gerar Jogos'}</Button>
            {gerarJogosMsg && (
              <Text color={gerarJogosMsg.includes('sucesso') ? '$green10' : '$red10'} mt="$2">{gerarJogosMsg}</Text>
            )}
          </YStack>
        </>
      )}
          <FloatingActionButton
              actions={[{
                  icon: <MaterialCommunityIcons name="plus" size={28} color="$gray12" />,
                  label: 'Vincular Equipes',
                  onPress: () => router.push(`/telas/fases/vincular-equipes?torneioId=${torneioId}&categoriaId=${categoriaId}&faseId=${faseId}`)
              }]} position={{ bottom: 30, right: 24 }}
          />
          <FloatingActionButton
              actions={[{
                  icon: <MaterialCommunityIcons name="pencil" size={28} color="$gray12" />,
                  label: 'Editar Fase',
                  onPress: () => router.push(`/telas/criar-fase/CriarFase?torneioId=${torneioId}&categoriaId=${categoriaId}&faseId=${faseId}`)
              }]} position={{ bottom: 30, right: 84 }}
          />
    </Tela>
  );
}
