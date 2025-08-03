import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Button, Separator, Theme, ScrollView } from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DialogError from '../componente/dialog-error'
import { modalidades } from '../utils/modalidades'

import MultiSelect from 'react-native-multiple-select'

export default function VincularAtletaCategoriaScreen() {
  const router = useRouter()

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)

  const [categorias, setCategorias] = useState<any[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)

  const [equipes, setEquipesVinculadas] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [atletasDisponiveis, setAtletasDisponiveis] = useState<any[]>([])
  const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([])

  const [atletasVinculados, setAtletasVinculados] = useState<any[]>([])

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
      setEquipeSelecionada(null)
      setEquipesVinculadas([])
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
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
      setEquipeSelecionada(null)
      setEquipesVinculadas([])
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadEquipes = async (torneioId:string, categoriaId: string) => {
    if (!categoriaId || !torneioId) {
      return
    }

    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const [response] = await Promise.all([
        fetch(`http://192.168.1.13:8080/torneios/${torneioId}/categorias/${categoriaId}/equipes`, { headers })
      ])

      let equipesData: any[] = []

      if (response.status !== 204) {
        if (!response.ok) throw new Error('Erro ao buscar equipes disponíveis.')
        equipesData = await response.json()
      }

      setEquipesVinculadas(equipesData)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  const loadAtletas = async (torneioId: string, categoriaId: string, equipeId: string) => {
    
    if (!categoriaId || !torneioId || !equipeId) {
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
      setEquipesVinculadas([])
      return
    }
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }
      // Buscar atletas disponíveis e vinculados
      const [disponiveisRes, vinculadosRes] = await Promise.all([
        fetch(`http://192.168.1.13:8080/equipes/${equipeId}/atletas`, { headers }),
        fetch(`http://192.168.1.13:8080/torneios/${torneioId}/categorias/${categoriaId}/equipes/${equipeId}/atletas`, { headers }),
      ])

      let atletasDisponiveisData: any[] = []
      let atletasVinculadosData: any[] = []

      if (disponiveisRes.status !== 204) {
        if (!disponiveisRes.ok) throw new Error('Erro ao buscar atletas disponíveis.')
        atletasDisponiveisData = await disponiveisRes.json()
      }
      if (vinculadosRes.status !== 204) {
        if (!vinculadosRes.ok) throw new Error('Erro ao buscar atletas vinculados.')
        atletasVinculadosData = await vinculadosRes.json()
      }

      const atletasDisponiveisFiltrados = atletasDisponiveisData.filter((atletaDisponivel: any) =>
        !atletasVinculadosData.some((atletaVinculado: any) => atletaVinculado.id === atletaDisponivel.id)
      )
      setAtletasDisponiveis(atletasDisponiveisFiltrados)
      setAtletasVinculados(atletasVinculadosData)
      setAtletasSelecionados([])
    } catch (error) {
      console.error('Erro ao carregar atletas ou equipes:', error)
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
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    }
  }, [torneioSelecionado])

    useEffect(() => {
      if (categoriaSelecionada !== null && categoriaSelecionada !== 'Selecione uma categoria') {
        loadEquipes(torneioSelecionado, categoriaSelecionada)
      } else {
        setCategoriaSelecionada(null)
        setEquipesVinculadas([])
        setEquipeSelecionada(null)
      }
    }, [torneioSelecionado, categoriaSelecionada])

  useEffect(() => {
    if (equipeSelecionada !== null && equipeSelecionada !== 'Selecione uma equipe') {
      loadAtletas(torneioSelecionado, categoriaSelecionada, equipeSelecionada)
    } else {
      setEquipeSelecionada(null)
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    }
  }, [torneioSelecionado, categoriaSelecionada, equipeSelecionada])

  const handleVincular = () => {
    const vincularAtletas = async () => {
      try {

        const body = {
          atletasId: atletasSelecionados.map(Number)
        }

        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }
        const response = await fetch(`http://192.168.1.13:8080/torneios/${torneioSelecionado}/categorias/${categoriaSelecionada}/atletas`, {
          headers,
          method: 'POST',
          body: JSON.stringify(body),
        })
        if (response.ok) {
          setErrorMessage('Atletas vinculados com sucesso!')
          setShowErrorDialog(true)
          loadAtletas(torneioSelecionado!, categoriaSelecionada!, equipeSelecionada)
        } else {
          const responseError = await response.json()
          setErrorMessage(responseError.message || 'Erro ao vincular atletas.')
          setShowErrorDialog(true)
        }
      } catch (error: any) {
        console.error('Erro ao vincular atletas:', error)
        setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
        setShowErrorDialog(true)
      }
    }
    vincularAtletas()
  }

  const isFormValid = modalidade && torneioSelecionado && categoriaSelecionada && atletasSelecionados.length > 0

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Vincular Atleta à Categoria" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
        
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
          {/* Equipes */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Equipes</Text>
            <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden" >
              <Picker
                selectedValue={equipeSelecionada}
                onValueChange={(itemValue) => setEquipeSelecionada(itemValue)}
                style={{ height: 40, paddingHorizontal: 8 }}
                enabled={categoriaSelecionada !== null}
              >
                <Picker.Item label="Selecione uma equipe" value={null} />
                {Array.isArray(equipes) && equipes.map((e) => (
                  <Picker.Item key={e.id} label={e.nome} value={e.id} />
                ))}
              </Picker>
            </YStack>
          </YStack>
          {/* Atletas Disponíveis - MultiSelect */}
          {equipeSelecionada && atletasDisponiveis.length > 0 && (
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Atletas</Text>
              <YStack borderRadius="$3" borderWidth={1} borderColor="$color4" bg="$color2" overflow="hidden" p={8}>
                <MultiSelect
                  items={atletasDisponiveis.map((a) => ({ id: a.id, name: a.nome }))}
                  uniqueKey="id"
                  onSelectedItemsChange={setAtletasSelecionados}
                  selectedItems={atletasSelecionados}
                  selectText="Selecione atletas"
                  searchInputPlaceholderText="Buscar atleta..."
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#333"
                  selectedItemTextColor="#000"
                  selectedItemIconColor="#000"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#000' }}
                  submitButtonColor="#000"
                  submitButtonText="OK"
                  styleMainWrapper={{ backgroundColor: 'transparent' }}
                  styleDropdownMenuSubsection={{ backgroundColor: 'transparent' }}
                />
              </YStack>
            </YStack>
          )}
          <Separator my="$3" />
          <Button
            backgroundColor={!isFormValid ? 'grey' : 'black'}
            color="white"
            w="100%"
            onPress={handleVincular}
            disabled={!isFormValid}
          >
            Vincular Atletas
          </Button>
          {/* Listagem de atletas já vinculados */}
          <YStack mt="$4" space="$2">
            <Text fontSize={16} fontWeight="bold">Atletas já vinculados à categoria:</Text>
            {atletasVinculados.length === 0 && (
              <Text color="$gray10">Nenhum atleta vinculado.</Text>
            )}
            {atletasVinculados.map((atleta) => (
              <Text key={atleta.id} color="$gray10">- {atleta.nome}</Text>
            ))}
          </YStack>
        </YStack>
        </ScrollView>
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
