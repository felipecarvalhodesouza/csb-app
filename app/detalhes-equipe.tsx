import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  ScrollView,
  Spinner,
  Button,
} from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './header'
import Footer from './footer'
import { Atleta } from './domain/atleta'
import { API_BASE_URL } from '../utils/config'
import { Edit3 } from '@tamagui/lucide-icons'
import { GestureResponderEvent } from 'react-native'

export default function EquipeDetalhesScreen() {
const { id, nome } = useLocalSearchParams()
const nomeEquipe = Array.isArray(nome) ? nome[0] : nome

const [atletas, setAtletas] = useState<Atleta[]>([])
const [loading, setLoading] = useState(true)
const [perfil, setPerfil] = useState<string | null>(null)
const router = useRouter()

  useEffect(() => {
    const fetchPerfil = async () => {
      const session = await AsyncStorage.getItem('session_user')
      if (session) {
        const user = JSON.parse(session)
        setPerfil(user.role)
      }
    }
    fetchPerfil()
  }, [])

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

        const response = await fetch(`${API_BASE_URL}/equipes/${id}/atletas`, {
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

  const getHeaderProps = () => {
    let headerProps: { title: string; button?: React.ReactNode } = {
      title: nomeEquipe || 'Detalhes da Equipe',
    }

    if (perfil === 'ADMIN') {
      headerProps.button = (
        <Button icon={Edit3} onPress={handleEditar}></Button>
      )
    }
    return headerProps
  }

  function handleEditar(event: GestureResponderEvent): void {
    router.push(`admin/editar-equipe?id=${id}`)
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9">
        <Header {...getHeaderProps()}/>

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
function handleEditar(event: GestureResponderEvent): void {
  throw new Error('Function not implemented.')
}

