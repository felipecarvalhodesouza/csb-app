import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Spinner,
  Button,
  Input,
} from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Atleta } from './domain/atleta'
import { API_BASE_URL } from '../utils/config'
import { Edit3 } from '@tamagui/lucide-icons'
import { GestureResponderEvent } from 'react-native'
import { Tela } from './componente/layout/tela'

export default function EquipeDetalhesScreen() {
  const { id, nome } = useLocalSearchParams()
  const nomeEquipe = Array.isArray(nome) ? nome[0] : nome

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [perfil, setPerfil] = useState<string | null>(null)
  const [categoriasAbertas, setCategoriasAbertas] = useState<Record<number, boolean>>({})
  const [busca, setBusca] = useState('')

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
        if (!id) return

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

  function handleEditar(event: GestureResponderEvent): void {
    router.push(`admin/editar-equipe?id=${id}`)
  }

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

  const toggleCategoria = (id: number) => {
    setCategoriasAbertas(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 🔍 FILTRO DE BUSCA
  const atletasFiltrados = atletas.filter((atleta: any) =>
    atleta.nome?.toLowerCase().includes(busca.toLowerCase())
  )

  // 🔥 AGRUPAMENTO POR CATEGORIA
  const atletasPorCategoria = atletasFiltrados.reduce((acc: any, atleta: any) => {
    if (!atleta.categorias) return acc

    atleta.categorias.forEach((cat: any) => {
      if (!acc[cat.id]) {
        acc[cat.id] = {
          nome: cat.nome,
          atletas: [],
        }
      }

      acc[cat.id].atletas.push(atleta)
    })

    return acc
  }, {})

  return (
    <Tela {...getHeaderProps()} scroll={false}>
      {loading ? (
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" color="$blue10" />
        </YStack>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          <Text mt="$4" fontSize={16} color="white">
            Atletas
          </Text>

          {/* 🔍 INPUT DE BUSCA */}
          <Input
            mt="$3"
            placeholder="Buscar atleta..."
            value={busca}
            onChangeText={setBusca}
            bg="$color1"
            color="white"
          />

          {Object.keys(atletasPorCategoria).length > 0 ? (
            Object.entries(atletasPorCategoria).map(([catId, cat]: any) => (
              <YStack key={catId} space="$2" mt="$3">
                
                <XStack
                  onPress={() => toggleCategoria(Number(catId))}
                  ai="center"
                  jc="space-between"
                  bg="$color2"
                  p="$3"
                  br="$4"
                >
                  <Text color="white">{cat.nome}</Text>
                  <MaterialIcons
                    name={categoriasAbertas[catId] ? 'expand-less' : 'expand-more'}
                    size={20}
                    color="white"
                  />
                </XStack>

                {categoriasAbertas[catId] &&
                  cat.atletas.map((atleta: any) => (
                    <XStack
                      key={`${catId}-${atleta.id}`}
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
                  ))}
              </YStack>
            ))
          ) : (
            <Text color="$gray10" mt="$2">
              Nenhum atleta encontrado.
            </Text>
          )}
        </ScrollView>
      )}
    </Tela>
  )
}