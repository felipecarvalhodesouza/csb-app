import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack, Text, Input, Button, Separator, Theme, useTheme, Label, ScrollView,
} from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { format, set } from 'date-fns'
import { getFavoriteModality } from '../../utils/preferences'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch } from '../utils/api'
import { GenericPicker } from '../componente/GenericPicker'
import Dialog from '../componente/dialog-error'

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
  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)
  const [erroLink, setErroLink] = useState<string | null>(null)
  const [youtubeLink, setYoutubeLink] = useState<string>('')

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    try {
      const data = await apiFetch<any[]>(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`)
      setTorneios(data)
      setTorneioSelecionado(null)
      setCategoriaSelecionada(null)
      setCategorias([])
      setEquipes([])
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar torneios.')
      setShowDialog(true)
    }
  }

  const loadCategorias = async (torneioId: string) => {
    try {
      const categorias = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias`)

      setCategorias(categorias)
      setCategoriaSelecionada(null)
      setEquipes([])

    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar categorias.')
      setShowDialog(true)
    }
  }

  const loadEquipes = async (torneioId: string, categoriaId: string) => {
    try {
      const equipes = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`)
      setEquipes(equipes)
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar equipes.')
      setShowDialog(true)
    }
  }

  const loadLocais = async () => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/locais`)
      .then(data => setLocais(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar locais.')
      setShowDialog(true)
    }
  }

  const loadArbitros = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/arbitros/modalidade/${modalidadeId}`)
      .then(data => setArbitros(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar árbitros.')
      setShowDialog(true)
    }
  }

  const loadEstatisticos = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/estatisticos/modalidade/${modalidadeId}`)
      .then(data => setEstatisticos(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar estatísticos.')
      setShowDialog(true)
    }
  }

  const loadMesarios = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/mesarios/modalidade/${modalidadeId}`)
      .then(data => setMesarios(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar mesários.')
      setShowDialog(true)
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
      setError(true)
      setMessage(error.message || 'Erro ao carregar técnicos.')
      setShowDialog(true)
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
        setError(true)
        setMessage('Link inválido.')
        setShowDialog(true)
        return
      }

      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      if (!dataJogo || !horaJogo) {
        setError(true)
        setMessage('Data e hora são obrigatórias.')
        setShowDialog(true)
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
        setError(false)
        setMessage('Jogo criado com sucesso!')
        setShowDialog(true)

        setTimeout(() => {
          setShowDialog(false)
          router.replace('/admin')
        }, 3000)
      } else {
        const responseError = await response.json()
        setError(true)
        setMessage(responseError.message || 'Erro ao criar o jogo.')
        setShowDialog(true)
      }
    } catch (error: any) {
      setError(true)
      setMessage(error.message || 'Erro desconhecido.')
      setShowDialog(true)
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
                <GenericPicker
                  items={tecnicosMandante}
                  value={tecnicoMandante}
                  onChange={setTecnicoMandante}
                  getLabel={(t) => t.nome}
                  getValue={(t) => t.id}
                  enabled={equipeMandante !== null}
                />
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
                <GenericPicker
                  items={tecnicosVisitante}
                  value={tecnicoVisitante}
                  onChange={setTecnicoVisitante}
                  getLabel={(t) => t.nome}
                  getValue={(t) => t.id}
                  enabled={equipeVisitante !== null}
                />
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
        
        <Dialog
          open={showDialog}
          onClose={handleCloseDialog}
          message={message}
          type={error ? 'error' : 'success'}
        />

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
