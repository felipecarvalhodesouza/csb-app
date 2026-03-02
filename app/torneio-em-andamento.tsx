import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import Torneio from './domain/torneio';
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'
import { YStack, Text, Spinner } from 'tamagui';
import {Tela } from './componente/layout/tela';

export default function TorneiosScreen() {
  const router = useRouter()
  const params = useLocalSearchParams();
  const id = params.id;
  const [torneioEmAndamento, setTorneioEmAndamento] = useState<Torneio | null>(null);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTorneios = async (options:RequestInit = {}) => {
      try {
        const data = await apiFetch(`${API_BASE_URL}/torneios/modalidade/${id}`, options) as Torneio[];
        const torneioEmAndamento = data.find(torneio => torneio.status === 'EM_ANDAMENTO');

        if (torneioEmAndamento) {
          setTorneioEmAndamento(torneioEmAndamento);
        } else {
          setTorneios(data);
        }
      } catch (error) {
        console.error('Error fetching torneios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTorneios()
  }, [])

  useEffect(() => {
    if (torneioEmAndamento) {
      router.replace(`/selecionar-equipe?torneio=${torneioEmAndamento.id}`)
    }
  }, [torneioEmAndamento])

  if (torneioEmAndamento) {
    return null
  }

  return (
    <Tela title="Torneios" scroll={false}>
        {loading ? (
          <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : (

          torneios.length === 0 ? (
            <YStack f={1} jc="center" ai="center" px="$4">
              <Text fontSize={16} color="$gray10" textAlign="center">
                Nenhum torneio cadastrado nessa modalidade
              </Text>
            </YStack>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {torneios.map((torneio) => (
                <Text key={torneio.id} style={{ marginBottom: 8 }}>
                  {torneio.nome}
                </Text>
              ))}
            </ScrollView>
          )
        )}
    </Tela>
  )
}
