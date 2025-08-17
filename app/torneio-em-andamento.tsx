import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native';
import Torneio from './domain/torneio';
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'

export default function TorneiosScreen() {
  const router = useRouter()
  const params = useLocalSearchParams();
  const id = params.id;
  const [torneioEmAndamento, setTorneioEmAndamento] = useState<Torneio | null>(null);
  const [torneios, setTorneios] = useState<Torneio[]>([]);

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
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {torneios.map((torneio) => (
        <Text key={torneio.id} style={{ marginBottom: 8 }}>
          {torneio.nome}
        </Text>
      ))}
    </ScrollView>
  )
}
