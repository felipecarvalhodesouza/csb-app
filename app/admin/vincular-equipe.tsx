import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Button, Separator, Theme, useTheme, ScrollView } from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Dialog from '../componente/dialog-error'
import { modalidades } from '../utils/modalidades'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch } from '../utils/api'
import Torneio from '../domain/torneio'
import Categoria from '../domain/categoria'

export default function VincularEquipeTorneioScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)

  const [categorias, setCategorias] = useState<any[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)

  const [equipesDisponiveis, setEquipesDisponiveis] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [equipesVinculadas, setEquipesVinculadas] = useState<any[]>([])

  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const loadTorneios = async (modalidadeId: string, options:RequestInit = {}) => {
    if (!modalidadeId) {
      setTorneios([])
      setTorneioSelecionado(null)
      return
    }

    try {
      const torneios = await apiFetch(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`, options) as Torneio[];
      setTorneios(torneios)
      setTorneioSelecionado(null)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  const loadCategorias = async (torneioId: string, options:RequestInit = {}) => {
    if (!torneioId) {
      setCategorias([])
      setCategoriaSelecionada(null)
      setEquipesDisponiveis([])
      setEquipesVinculadas([])
      setEquipeSelecionada(null)
      return
    }

    try {
      const categorias = await apiFetch(`${API_BASE_URL}/torneios/${torneioId}/categorias`, options) as Categoria[];
      setCategorias(categorias)
      setCategoriaSelecionada(null)
      setEquipesDisponiveis([])
      setEquipesVinculadas([])
      setEquipeSelecionada(null)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadEquipes = async (torneioId:string, categoriaId: string) => {
    if (!categoriaId || !torneioId) {
      setEquipesDisponiveis([])
      setEquipesVinculadas([])
      setEquipeSelecionada(null)
      return
    }

    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const [disponiveisRes, vinculadasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/equipes`, { headers }),
        fetch(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`, { headers })
      ])


      let equipesDisponiveisData: any[] = []
      let equipesVinculadasData: any[] = []

      if (disponiveisRes.status !== 204) {
        if (!disponiveisRes.ok) throw new Error('Erro ao buscar equipes disponíveis.')
        equipesDisponiveisData = await disponiveisRes.json()
      }

      if (vinculadasRes.status !== 204) {
        if (!vinculadasRes.ok) throw new Error('Erro ao buscar equipes vinculadas.')
        equipesVinculadasData = await vinculadasRes.json()
      }


      const equipesDisponiveisFiltradas = equipesDisponiveisData.filter((equipeDisponivel: any) =>
        !equipesVinculadasData.some((equipeVinculada: any) => equipeVinculada.id === equipeDisponivel.id)
      )

      setEquipesDisponiveis(equipesDisponiveisFiltradas)
      setEquipesVinculadas(equipesVinculadasData)
      setEquipeSelecionada(null)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  useEffect(() => {
    if (modalidade !== null) {
      loadTorneios(modalidade)
    } else {
      setTorneios([])
      setTorneioSelecionado(null)
    }
  }, [modalidade])

  useEffect(() => {
    if (torneioSelecionado !== null && torneioSelecionado !== 'Selecione um torneio') {
      loadCategorias(torneioSelecionado)
    } else {
      setTorneioSelecionado(null)
      setCategorias([])
      setCategoriaSelecionada(null)
      setEquipesDisponiveis([])
      setEquipesVinculadas([])
      setEquipeSelecionada(null)
    }
  }, [torneioSelecionado])

  useEffect(() => {
    if (categoriaSelecionada !== null && categoriaSelecionada !== 'Selecione uma categoria') {
      loadEquipes(torneioSelecionado, categoriaSelecionada)
    } else {
      setCategoriaSelecionada(null)
      setEquipesDisponiveis([])
      setEquipesVinculadas([])
      setEquipeSelecionada(null)
    }
  }, [torneioSelecionado, categoriaSelecionada])

  const handleVincular = () => {
    const vincularEquipe = async () => {
      try {
        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const novoVinculo = {
        equipeId: equipeSelecionada
      }

        const response = await fetch(`${API_BASE_URL}/torneios/${torneioSelecionado}/categorias/${categoriaSelecionada}/equipes`, {
          headers,
          method: 'POST',
          body: JSON.stringify(novoVinculo),
        })

        if (response.ok) {
          setMessage('Equipe vinculada com sucesso!')
          setShowDialog(true)

          loadEquipes(torneioSelecionado!, categoriaSelecionada!)
        } else {
          const responseError = await response.json()
          setError(true)
          setMessage(responseError.message || 'Erro ao vincular a equipe.')
          setShowDialog(true)
        }
      } catch (error: any) {
        console.error('Erro ao vincular equipe:', error)
        setError(true)
        setMessage(error.message || 'Falha ao conectar com o servidor.')
        setShowDialog(true)
      }
    }

    vincularEquipe()
  }

  const isFormValid = modalidade && torneioSelecionado && equipeSelecionada

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Vincular Equipe ao Torneio" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">

          <YStack p="$4" space="$4">
            {/* Modalidade */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Modalidade</Text>
              <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden">
                <Picker
                  selectedValue={modalidade}
                  onValueChange={(itemValue) => setModalidade(itemValue)}
                  style={{ 
                    height: 50, 
                    paddingHorizontal: 8,
                    color: theme.color?.val || '#FFFFFF',
                    fontSize: 20,
                    fontWeight: '500'
                  }}
                >
                  <Picker.Item label="Selecione uma modalidade" value={null} />
                  {modalidades
                    .filter((m) => !m.disable)
                    .map((m) => (
                      <Picker.Item key={m.id} label={m.nome} value={m.id} />
                    ))}
                </Picker>
              </YStack>
            </YStack>

            {/* Torneio */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Torneio</Text>
              <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden">
                <Picker
                  selectedValue={torneioSelecionado}
                  onValueChange={(itemValue) => setTorneioSelecionado(itemValue)}
                  style={{ 
                    height: 50, 
                    paddingHorizontal: 8,
                    color: theme.color?.val || '#FFFFFF',
                    fontSize: 20,
                    fontWeight: '500'
                  }}
                  enabled={modalidade !== null}
                >
                  <Picker.Item label="Selecione um torneio" value={null} />
                  {Array.isArray(torneios) && torneios.map((t) => (
                    <Picker.Item key={t.id} label={t.nome} value={t.id} />
                  ))}
                </Picker>
              </YStack>
            </YStack>

            {/* Categoria */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Categoria</Text>
              <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden">
                <Picker
                  selectedValue={categoriaSelecionada}
                  onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
                  style={{ 
                    height: 50, 
                    paddingHorizontal: 8,
                    color: theme.color?.val || '#FFFFFF',
                    fontSize: 20,
                    fontWeight: '500'
                  }}
                  enabled={torneioSelecionado !== null}
                >
                  <Picker.Item label="Selecione uma categoria" value={null} />
                  {Array.isArray(categorias) && categorias.map((t) => (
                    <Picker.Item key={t.id} label={t.nome} value={t.id} />
                  ))}
                </Picker>
              </YStack>
            </YStack>

            {/* Equipe Disponível */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Equipe</Text>
              <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden">
                <Picker
                  selectedValue={equipeSelecionada}
                  onValueChange={(itemValue) => setEquipeSelecionada(itemValue)}
                  style={{ 
                    height: 50, 
                    paddingHorizontal: 8,
                    color: theme.color?.val || '#FFFFFF',
                    fontSize: 20,
                    fontWeight: '500'
                  }}
                  enabled={categoriaSelecionada !== null}
                >
                  <Picker.Item label="Selecione uma equipe" value={null} />
                  {Array.isArray(equipesDisponiveis) && equipesDisponiveis.map((e) => (
                    <Picker.Item key={e.id} label={e.nome} value={e.id} />
                  ))}
                </Picker>
              </YStack>
            </YStack>

            <Separator my="$3" />

            <Button
              backgroundColor={!isFormValid ? 'grey' : 'black'}
              color="white"
              w="100%"
              onPress={handleVincular}
              disabled={!isFormValid}
            >
              Vincular Equipe
            </Button>

            {/* Listagem de equipes já vinculadas */}
            <YStack mt="$4" space="$2">
              <Text fontSize={16} fontWeight="bold">Equipes já vinculadas ao torneio:</Text>
              {equipesVinculadas.length === 0 && (
                <Text color="$gray10">Nenhuma equipe vinculada.</Text>
              )}
              {equipesVinculadas.map((equipe) => (
                <Text key={equipe.id} color="$gray10">- {equipe.nome}</Text>
              ))}
            </YStack>
          </YStack>
        </ScrollView>
        <Footer />

        <Dialog
          open={showDialog}
          onClose={handleCloseDialog}
          message={message}
          type={error ? 'error' : 'success'}
        />
      </YStack>
    </Theme>
  )
}
