import React, { useState, useEffect } from 'react'
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
import Footer from './footer'
import Header from './header'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CategoriasScreen() {
  const theme = useTheme()
  const router = useRouter()
  const { torneio } = useLocalSearchParams<{ torneio: string }>()
  
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const response = await fetch(`http://localhost:8080/torneios/${torneio}/categorias`, { headers })
        if (!response.ok) throw new Error('Erro ao carregar categorias.')

        const data = await response.json()
        setCategorias(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (torneio) loadCategorias()
  }, [torneio])

  const handleSelecionarCategoria = (torneioId: number, categoriaId: number) => {
    router.push(`/categoria?torneioId=${torneioId}&categoriaId=${categoriaId}`)
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" jc="space-between" pt="$6" pb="$9">
        <Header title="Categorias do Torneio" />

        {loading ? (
          <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : categorias.length === 0 ? (
          <YStack f={1} jc="center" ai="center" px="$4">
            <Text fontSize={16} color="$gray10" textAlign="center">
              Esse torneio não possui nenhuma categoria cadastrada
            </Text>
          </YStack>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
            {categorias.map((categoria) => (
              <XStack
                key={categoria.id}
                bg="$color2"
                p="$4"
                br="$4"
                ai="center"
                onPress={() => handleSelecionarCategoria(Number(torneio), categoria.id)}
                hoverStyle={{ bg: '$color3' }}
                pressStyle={{ bg: '$color4' }}
              >
                <View
                  bg="$blue10"
                  p="$3"
                  br="$10"
                  mr="$3"
                  ai="center"
                  jc="center"
                >
                  <MaterialCommunityIcons name="account-group" size={24} color="white" />
                </View>

                <YStack>
                  <Text fontSize={16} color="white">{categoria.nome}</Text>
                  <Text fontSize={12} color="$gray10">{categoria.genero}</Text>
                </YStack>

                <View f={1} />
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </XStack>
            ))}
          </ScrollView>
        )}

        <Footer />
      </YStack>
    </Theme>
  )
}
