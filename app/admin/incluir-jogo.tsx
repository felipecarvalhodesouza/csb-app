import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack, Text, Input, Button, Separator, Theme, useTheme, Label, ScrollView
} from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DialogError from '../componente/dialog-error'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { format, set } from 'date-fns'
import { getFavoriteModality } from '../../utils/preferences'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch } from '../utils/api'
import { GenericPicker } from '../componente/GenericPicker'

export default function IncluirJogoScreen() {
  const theme = useTheme()
  const router = useRouter()
  const modalidade = getFavoriteModality()

  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [equipes, setEquipes] = useState<any[]>([])
  const [equipeMandante, setEquipeMandante] = useState<string | null>(null)
  const [tecnicosMandante, setTecnicosMandante] = useState<any[]>([])
  const [tecnicoMandante, setTecnicoMandante] = useState<string | null>(null)

  const [tecnicosVisitante, setTecnicosVisitante] = useState<any[]>([])
  const [tecnicoVisitante, setTecnicoVisitante] = useState<string | null>(null)
  const [equipeVisitante, setEquipeVisitante] = useState<string | null>(null)

  const [locais, setLocais] = useState<any[]>([])
  const [localSelecionado, setLocalSelecionado] = useState<string | null>(null)

  const [arbitros, setArbitros] = useState<any[]>([])
  const [estatisticos, setEstatisticos] = useState<any[]>([])
  const [mesarios, setMesarios] = useState<any[]>([])

  const [arbitroSelecionado, setArbitroSelecionado] = useState<string | null>(null)
  const [arbitroAuxiliar, setArbitroAuxiliar] = useState<string | null>(null)

  const [estatisticoSelecionado, setEstatisticoSelecionado] = useState<string | null>(null)
  const [mesarioSelecionado, setMesarioSelecionado] = useState<string | null>(null)

  const [dataJogo, setDataJogo] = useState<Date | null>(null)
  const [horaJogo, setHoraJogo] = useState<Date | null>(null)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [erroLink, setErroLink] = useState<string | null>(null)
  const [youtubeLink, setYoutubeLink] = useState<string>('')

  const handleCloseDialog = () => {
    setShowErrorDialog(false)
    setErrorMessage(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`, { headers })
      const data = await response.json()
      setTorneios(data)
      setTorneioSelecionado(null)
      setCategoriaSelecionada(null)
      setCategorias([])
      setEquipes([])
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  const loadCategorias = async (torneioId: string) => {
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/torneios/${torneioId}/categorias`, { headers })
      const data = await response.json()
      setCategorias(data)
      setCategoriaSelecionada(null)
      setEquipes([])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadEquipes = async (torneioId: string, categoriaId: string) => {
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`, { headers })
      const data = await response.json()
      setEquipes(data)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  const loadLocais = async () => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/locais`).then(data => setLocais(data))
    } catch (error) {
      console.error('Erro ao carregar locais:', error)
    }
  }

  const loadArbitros = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/arbitros/modalidade/${modalidadeId}`).then(data => setArbitros(data))
    } catch (error) {
      console.error('Erro ao carregar árbitros:', error)
    }
  }

  const loadEstatisticos = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/estatisticos/modalidade/${modalidadeId}`).then(data => setEstatisticos(data))
    } catch (error) {
      console.error('Erro ao carregar estatísticos:', error)
    }
  }

  const loadMesarios = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/mesarios/modalidade/${modalidadeId}`).then(data => setMesarios(data))
    } catch (error) {
      console.error('Erro ao carregar mesários:', error)
    }
  }

  const loadTecnicos = async (equipeId: string, isMandante: boolean) => {
    if(equipeId == null || "Selecione uma equipe" == equipeId){
        if (isMandante) {
          setTecnicosMandante(null)
          setTecnicoMandante(null)
          setEquipeMandante(null)
        } else {
          setTecnicosVisitante(null)
          setTecnicoVisitante(null)
          setEquipeVisitante(null)
        }
        return;
    }
    
    try {
      apiFetch<any[]>(`${API_BASE_URL}/equipes/${equipeId}/tecnicos`).then(data => { 
        if (isMandante) {
          setTecnicosMandante(data)
        } else {
          setTecnicosVisitante(data)
        }
      })
    } catch (error) {
      console.error('Erro ao carregar técnicos:', error)
    }}

  useEffect(() => {
    const fetchTorneiosELocais = async () => {
      const modalidadeAwait = await modalidade
      loadTorneios(modalidadeAwait)
      loadLocais()
      loadArbitros(modalidadeAwait)
      loadEstatisticos(modalidadeAwait)
      loadMesarios(modalidadeAwait)
    }

    fetchTorneiosELocais()
  }, [])

  useEffect(() => {
    if (torneioSelecionado) loadCategorias(torneioSelecionado)
  }, [torneioSelecionado])

  useEffect(() => {
    if (categoriaSelecionada && torneioSelecionado){
      loadEquipes(torneioSelecionado, categoriaSelecionada)
    }
  }, [categoriaSelecionada, torneioSelecionado])

  useEffect(() => {
    if (equipeMandante) {
      loadTecnicos(equipeMandante, true) 
    }
  }, [equipeMandante])

  useEffect(() => {
    if (equipeVisitante) {
      loadTecnicos(equipeVisitante, false) 
    }
  }, [equipeVisitante])

  const handleSalvar = async () => {
    try {
      if (!isValidYoutubeUrl(youtubeLink)) {
        setErrorMessage('Link inválido.')
        setShowErrorDialog(true)
        return
      }

      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      if (!dataJogo || !horaJogo) {
        setErrorMessage('Data e hora são obrigatórias.')
        setShowErrorDialog(true)
        return
      }

      const data = new Date(
        dataJogo.getFullYear(),
        dataJogo.getMonth(),
        dataJogo.getDate(),
        horaJogo.getHours(),
        horaJogo.getMinutes()
      )

      const novoJogo: any = {
        data,
        mandante: { id: Number(equipeMandante) },
        tecnicoMandante: tecnicoMandante ? { id: Number(tecnicoMandante) } : null,
        visitante: { id: Number(equipeVisitante) },
        tecnicoVisitante: tecnicoVisitante ? { id: Number(tecnicoVisitante) } : null,
        torneio: { id: Number(torneioSelecionado) },
        categoria: { id: Number(categoriaSelecionada) },
        streamUrl: youtubeLink || null,
        arbitroPrincipal: arbitroSelecionado ? { id: Number(arbitroSelecionado) } : null,
        arbitroAuxiliar: arbitroAuxiliar ? { id: Number(arbitroAuxiliar) } : null,
        estatistico: estatisticoSelecionado ? { id: Number(estatisticoSelecionado) } : null,
        mesario: mesarioSelecionado ? { id: Number(mesarioSelecionado) } : null,
      }

      if (localSelecionado) {
        novoJogo.local = { id: Number(localSelecionado) }
      }

      const response = await fetch(`${API_BASE_URL}/jogos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(novoJogo),
      })

      if (response.ok) {
        setErrorMessage('Jogo criado com sucesso!')
        setShowErrorDialog(true)
        setTimeout(() => {
          setShowErrorDialog(false)
          router.replace('/admin')
        }, 3000)
      } else {
        const responseError = await response.json()
        setErrorMessage(responseError.message || 'Erro ao criar o jogo.')
        setShowErrorDialog(true)
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error)
      setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
      setShowErrorDialog(true)
    }
  }

  const isFormValid =
    modalidade && torneioSelecionado && equipeMandante && equipeVisitante && dataJogo && horaJogo

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Incluir Jogo" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          <YStack p="$4" space="$4">
            <YStack space="$1">
              <Text>Torneio</Text>
              <Picker
                selectedValue={torneioSelecionado}
                onValueChange={(v) => setTorneioSelecionado(v)}
                enabled={!!modalidade}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um torneio" value={null} />
                {torneios.map((t) => (
                  <Picker.Item key={t.id} label={t.nome} value={t.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text>Categoria</Text>
              <Picker
                selectedValue={categoriaSelecionada}
                onValueChange={(v) => setCategoriaSelecionada(v)}
                enabled={!!torneioSelecionado}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione uma categoria" value={null} />
                {categorias.map((m) => (
                  <Picker.Item key={m.id} label={m.nome} value={m.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text>Equipe Mandante</Text>
              <Picker
                selectedValue={equipeMandante}
                onValueChange={(v) => setEquipeMandante(v)}
                enabled={!!categoriaSelecionada}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione uma equipe" value={null} />
                {equipes.map((e) => (
                  <Picker.Item key={e.id} label={e.nome} value={e.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Técnico Mandante</Text>
              <YStack
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color4"
                bg="$color2"
                overflow="hidden"
              >
                <GenericPicker
                  items={tecnicosMandante}
                  value={tecnicoMandante}
                  onChange={setTecnicoMandante}
                  getLabel={(t) => t.nome}
                  getValue={(t) => t.id}
                  enabled={equipeMandante !== null}
                />
              </YStack>
            </YStack>

            <YStack space="$1">
              <Text>Equipe Visitante</Text>
              <Picker
                selectedValue={equipeVisitante}
                onValueChange={(v) => setEquipeVisitante(v)}
                enabled={!!categoriaSelecionada}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione uma equipe" value={null} />
                {equipes.map((e) => (
                  <Picker.Item key={e.id} label={e.nome} value={e.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Técnico Visitante</Text>
              <YStack
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color4"
                bg="$color2"
                overflow="hidden"
              >
                <GenericPicker
                  items={tecnicosVisitante}
                  value={tecnicoVisitante}
                  onChange={setTecnicoVisitante}
                  getLabel={(t) => t.nome}
                  getValue={(t) => t.id}
                  enabled={equipeVisitante !== null}
                />
              </YStack>
            </YStack>

            <YStack space="$1">
              <Text>Local (opcional)</Text>
              <Picker
                selectedValue={localSelecionado}
                onValueChange={(v) => setLocalSelecionado(v)}
                enabled={locais.length > 0}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um local" value={null} />
                {locais.map((l) => (
                  <Picker.Item key={l.id} label={l.nome} value={l.id} />
                ))}
              </Picker>
            </YStack>


            <YStack space="$1">
              <Text>Árbitro Principal</Text>
              <Picker
                selectedValue={arbitroSelecionado}
                onValueChange={(v) => setArbitroSelecionado(v)}
                enabled={arbitros.length > 0}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um árbitro" value={null} />
                {arbitros.map((a) => (
                  <Picker.Item key={a.id} label={a.nome} value={a.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text>Árbitro Auxiliar</Text>
              <Picker
                selectedValue={arbitroAuxiliar}
                onValueChange={(v) => setArbitroAuxiliar(v)}
                enabled={arbitros.length > 0}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um árbitro" value={null} />
                {arbitros.map((a) => (
                  <Picker.Item key={a.id} label={a.nome} value={a.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text>Mesário</Text>
              <Picker
                selectedValue={mesarioSelecionado}
                onValueChange={(v) => setMesarioSelecionado(v)}
                enabled={mesarios.length > 0}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um mesário" value={null} />
                {mesarios.map((m) => (
                  <Picker.Item key={m.id} label={m.nome} value={m.id} />
                ))}
              </Picker>
            </YStack>
            
            <YStack space="$1">
              <Text>Estatístico</Text>
              <Picker
                selectedValue={estatisticoSelecionado}
                onValueChange={(v) => setEstatisticoSelecionado(v)}
                enabled={estatisticos.length > 0}
                style={{ height: 40, paddingHorizontal: 8 }}
              >
                <Picker.Item label="Selecione um estatístico" value={null} />
                {estatisticos.map((e) => (
                  <Picker.Item key={e.id} label={e.nome} value={e.id} />
                ))}
              </Picker>
            </YStack>

            <YStack space="$1">
              <Text>Data do Jogo</Text>
              <Button onPress={() => setShowDatePicker(true)}>{dataJogo ? format(dataJogo, 'dd/MM/yyyy') : 'Selecionar Data'}</Button>
              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={showDatePicker}
                date={dataJogo || new Date()}
                onDismiss={() => setShowDatePicker(false)}
                onConfirm={({ date }) => {
                  setShowDatePicker(false)
                  setDataJogo(date)
                }}
              />
            </YStack>

            <YStack space="$1">
              <Text>Hora do Jogo</Text>
              <Button onPress={() => setShowTimePicker(true)}>{horaJogo ? format(horaJogo, 'HH:mm') : 'Selecionar Hora'}</Button>
              <TimePickerModal
                visible={showTimePicker}
                onDismiss={() => setShowTimePicker(false)}
                onConfirm={({ hours, minutes }) => {
                  setShowTimePicker(false)
                  setHoraJogo(new Date(0, 0, 0, hours, minutes))
                }}
                hours={horaJogo?.getHours() || 12}
                minutes={horaJogo?.getMinutes() || 0}
              />
            </YStack>

            <YStack space="$1">
              <Label>Link do YouTube (opcional)</Label>
              <Input
                placeholder="https://youtube.com/..."
                value={youtubeLink}
                onChangeText={setYoutubeLink}
                autoCapitalize="none"
                keyboardType="url"
              />
              {erroLink && <Text color="red">{erroLink}</Text>}
            </YStack>

            <Separator my="$3" />

            <Button
              backgroundColor={!isFormValid ? 'grey' : 'black'}
              color="white"
              onPress={handleSalvar}
              disabled={!isFormValid}
            >
              Salvar Jogo
            </Button>
          </YStack>
        </ScrollView>
        <DialogError open={showErrorDialog} onClose={handleCloseDialog} message={errorMessage} />
        <Footer />
      </YStack>
    </Theme>
  )
}

function isValidYoutubeUrl(url: string): boolean {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')
  } catch {
    return false
  }
}
