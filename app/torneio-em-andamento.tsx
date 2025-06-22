import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native';
import { Torneio } from './domain/torneio';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TorneiosScreen() {
  const router = useRouter()
  const params = useLocalSearchParams();
  const id = params.id;
  const [torneioEmAndamento, setTorneioEmAndamento] = useState<Torneio | null>(null);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  
  useEffect(() => {
    const fetchTorneios = async (options:RequestInit = {}) => {
      try {
          const token = await AsyncStorage.getItem('session_user');
          const headers = {
          ...(options.headers || {}),
          'Authorization': `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(`http://localhost:8080/torneios/modalidade/${id}`, {...options, headers})
        const data = (await response.json()) as Torneio[];
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
      router.replace(`/selecionar-equipe?torneio=${torneioEmAndamento}`)
    }
  }, [torneioEmAndamento])

  if (torneioEmAndamento) {
    return null
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {torneios.map((torneio) => (
        <Text key={torneio} style={{ marginBottom: 8 }}>
          {torneio}
        </Text>
      ))}
    </ScrollView>
  )
}
