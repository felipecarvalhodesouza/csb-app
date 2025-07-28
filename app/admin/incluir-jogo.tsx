import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack, Text, Input, Button, Separator, Theme, useTheme
} from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DialogError from '../componente/dialog-error'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import { format } from 'date-fns'
import { getFavoriteModality } from '../../utils/preferences'

export default function IncluirJogoScreen() {
  const theme = useTheme()
  const router = useRouter()
  const modalidade = getFavoriteModality();

  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)
  const [categorias, setCategorias]  = useState<any[]>([])
  const [equipes, setEquipes] = useState<any[]>([])
  const [equipeMandante, setEquipeMandante] = useState<string | null>(null)
  const [equipeVisitante, setEquipeVisitante] = useState<string | null>(null)

  const [dataJogo, setDataJogo] = useState<Date | null>(null)
  const [horaJogo, setHoraJogo] = useState<Date | null>(null)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

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

      const response = await fetch(`http://192.168.1.11:8080/torneios/modalidade/${modalidadeId}`, { headers })
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

      const response = await fetch(`http://192.168.1.11:8080/torneios/${torneioId}/categorias`, { headers })
      const data = await response.json()
      setCategorias(data)
      setCategoriaSelecionada(null)
      setEquipes([])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadEquipes = async (torneioId: string) => {
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`http://192.168.1.11:8080/torneios/${torneioId}/equipes`, { headers })
      const data = await response.json()
      setEquipes(data)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  useEffect(() => {

    const fetchTorneios = async () => {
        const modalidadeAwait = await modalidade;
        loadTorneios(modalidadeAwait)
    }

    fetchTorneios()
  }, [])

  useEffect(() => {
    if (torneioSelecionado) loadCategorias(torneioSelecionado)
  }, [torneioSelecionado])

    useEffect(() => {
    if (categoriaSelecionada) loadEquipes(categoriaSelecionada)
  }, [categoriaSelecionada])

  const handleSalvar = async () => {
    try {
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

      const novoJogo = {
        data,
        mandante: { id: Number(equipeMandante) },
        visitante: { id: Number(equipeVisitante) },
        torneio: { id: Number(torneioSelecionado) },
        categoria: { id: Number(categoriaSelecionada) }
      }

      const response = await fetch('http://192.168.1.11:8080/jogos', {
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
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Incluir Jogo" />

          {/* Torneio */}
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

        <YStack p="$4" space="$4">
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

          {/* Equipes */}
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

          {/* Data e Hora */}
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

        <Footer />
        <DialogError open={showErrorDialog} onClose={handleCloseDialog} message={errorMessage} />
      </YStack>
    </Theme>
  )
}
