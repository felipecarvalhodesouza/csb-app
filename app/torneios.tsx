import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Spinner,
} from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getFavoriteModality } from '../utils/preferences'
import { API_BASE_URL } from '../utils/config'
import Torneio from './domain/torneio'
import { apiFetch } from './utils/api'
import { Tela } from './componente/layout/tela'

export default function TorneiosScreen() {
  const router = useRouter()
  const { mode } = useLocalSearchParams()

  const [torneios, setTorneios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTorneios = async (options:RequestInit = {}) => {
    try {

      const modality = await getFavoriteModality()
      const data = await apiFetch(`${API_BASE_URL}/torneios/modalidade/${modality}`, options) as Torneio[];

      setTorneios(data)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTorneios()
  }, [])

  const handleSelecionar = (torneioId: number, nomeTorneio: string) => {
    router.replace(`/categorias?torneio=${torneioId}&nomeTorneio=${nomeTorneio}&mode=${mode}`)
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

          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
            {torneios.map((torneio) => {
              const isEmAndamento = torneio.status === 'EM_ANDAMENTO'

              return (
                <XStack
                  key={torneio.id}
                  bg={isEmAndamento ? '$color1' : '$color2'}
                  p="$4"
                  br="$4"
                  ai="center"
                  onPress={() => handleSelecionar(torneio.id, torneio.nome)}
                  hoverStyle={{ bg: isEmAndamento ? '$color2' : '$color3' }}
                  pressStyle={{ bg: isEmAndamento ? '$color3' : '$color4' }}
                >
                  <View
                    bg={isEmAndamento ? '$blue10' : '$gray7'}
                    p="$3"
                    br="$10"
                    mr="$3"
                    ai="center"
                    jc="center"
                  >
                    <MaterialCommunityIcons name="trophy" size={24} color={isEmAndamento ? "yellow" : "white"} />
                  </View>

                  <YStack maxWidth="100%" flexShrink={1}>
                    <Text fontSize={16} color="white">{torneio.nome}</Text>
                    <Text fontSize={12} color="$gray10">
                      {isEmAndamento ? 'Torneio em andamento' : `Status: ${torneio.status}`}
                    </Text>
                  </YStack>

                  <View f={1} />
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </XStack>
              )
            })}
          </ScrollView>
          )
        )}
    </Tela>
  )
}
