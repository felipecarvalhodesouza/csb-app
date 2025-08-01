import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Button, Separator, Theme, useTheme } from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DialogError from '../componente/dialog-error'
import { modalidades } from '../utils/modalidades'

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleCloseDialog = () => {
    setShowErrorDialog(false)
    setErrorMessage(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    if (!modalidadeId) {
      setTorneios([])
      setTorneioSelecionado(null)
      return
    }

    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`http://192.168.1.13:8080/torneios/modalidade/${modalidadeId}`, { headers })
      const data = await response.json()
      setTorneios(data)
      setTorneioSelecionado(null)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  const loadCategorias = async (torneioId: string) => {
    if (!torneioId) {
      setCategorias([])
      setCategoriaSelecionada(null)
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

      const response = await fetch(`http://192.168.1.13:8080/torneios/${torneioId}/categorias`, { headers })
      const data = await response.json()
      setCategorias(data)
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
        fetch(`http://192.168.1.13:8080/equipes?codigoModalidade=${modalidade}`, { headers }),
        fetch(`http://192.168.1.13:8080/torneios/${torneioId}/equipes`, { headers }) // ainda não está funcionando
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
    if (modalidade) loadTorneios(modalidade)
  }, [modalidade])

  useEffect(() => {
    if (torneioSelecionado) loadCategorias(torneioSelecionado)
  }, [torneioSelecionado])

    useEffect(() => {
    if (categoriaSelecionada) loadEquipes(torneioSelecionado, categoriaSelecionada)
  }, [torneioSelecionado, categoriaSelecionada])

  const handleVincular = () => {
    const vincularEquipe = async () => {
      try {
        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const response = await fetch(`http://192.168.1.13:8080/torneios/${torneioSelecionado}/equipes`, {headers})

        if (response.ok) {
          setErrorMessage('Equipe vinculada com sucesso!')
          setShowErrorDialog(true)

          // Recarregar a lista de equipes
          loadEquipes(torneioSelecionado!)
        } else {
          const responseError = await response.json()
          setErrorMessage(responseError.message || 'Erro ao vincular a equipe.')
          setShowErrorDialog(true)
        }
      } catch (error: any) {
        console.error('Erro ao vincular equipe:', error)
        setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
        setShowErrorDialog(true)
      }
    }

    vincularEquipe()
  }

  const isFormValid = modalidade && torneioSelecionado && equipeSelecionada

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Vincular Equipe ao Torneio" />

        <YStack p="$4" space="$4">
          {/* Modalidade */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Modalidade</Text>
            <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden">
              <Picker
                selectedValue={modalidade}
                onValueChange={(itemValue) => setModalidade(itemValue)}
                style={{ height: 40, paddingHorizontal: 8 }}
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
                style={{ height: 40, paddingHorizontal: 8 }}
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
                style={{ height: 40, paddingHorizontal: 8 }}
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
                style={{ height: 40, paddingHorizontal: 8 }}
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

        <Footer />

        <DialogError
          open={showErrorDialog}
          onClose={handleCloseDialog}
          message={errorMessage}
        />
      </YStack>
    </Theme>
  )
}
