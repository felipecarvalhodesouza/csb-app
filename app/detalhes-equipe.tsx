import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
  ScrollView,
  Spinner,
} from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './header'
import Footer from './footer'
import { Atleta } from './domain/atleta'

export default function EquipeDetalhesScreen() {
const router = useRouter()
const { id, nome } = useLocalSearchParams()
const nomeEquipe = Array.isArray(nome) ? nome[0] : nome
const theme = useTheme()

const [atletas, setAtletas] = useState<Atleta[]>([])
const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        if (!id){
            return
        }

        const user = await AsyncStorage.getItem('session_user')
        if (!user) {
          console.warn('Usuário não encontrado')
          return
        }

        const token = JSON.parse(user).token

        const response = await fetch(`http://192.168.1.13:8080/equipes/${id}/atletas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) throw new Error('Erro ao carregar equipe.')

        const data: Atleta[] = await response.json()
        setAtletas(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAtletas()
  }, [id])

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9">
        <Header title={nomeEquipe} subtitle="Detalhes da Equipe" />

        {loading ? (
          <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
            <Text mt="$4" fontSize={16} color="white">
              Atletas
            </Text>

            {atletas.length > 0 ? (
              atletas.map((atleta: any) => (
                <XStack
                  key={atleta.id}
                  bg="$color1"
                  p="$3"
                  br="$4"
                  ai="center"
                  space="$3"
                >
                  <MaterialIcons name="person" size={24} color="white" />
                  <Text color="white">{atleta.nome}</Text>
                  <View f={1} />
                  <Text fontSize={12} color="$gray10">
                    #{atleta.numero}
                  </Text>
                </XStack>
              ))
            ) : (
              <Text color="$gray10" mt="$2">
                Nenhum atleta cadastrado.
              </Text>
            )}
          </ScrollView>
        )}

        <Footer />
      </YStack>
    </Theme>
  )
}
