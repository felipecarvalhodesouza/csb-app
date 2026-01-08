import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, Theme, useTheme, ScrollView } from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Dialog from '../componente/dialog-error'
import { DatePickerModal } from 'react-native-paper-dates'
import { format } from 'date-fns'
import { modalidades } from '../utils/modalidades'
import { API_BASE_URL } from '../../utils/config'
import { apiPost } from '../utils/api'

export default function IncluirAtletaScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null)
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    if(modalidadeId == null || "Selecione uma modalidade" == modalidadeId){
      setTorneios([])
      setModalidade(null)
      setTorneioSelecionado(null)
      setEquipes([])
      setEquipeSelecionada(null)
      return
    }

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
      setEquipes([])
      setEquipeSelecionada(null)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  const loadEquipes = async (torneioId: string) => {
    if (torneioId == null|| "Selecione um torneio" == torneioId) {
      setTorneioSelecionado(null)
      setEquipes([])
      setEquipeSelecionada(null)
      return
    }

    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/torneios/${torneioId}/equipes`, { headers })
      const data = await response.json()
      setEquipes(data)
      setEquipeSelecionada(null)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  useEffect(() => {
    if (modalidade) loadTorneios(modalidade)
  }, [modalidade])

  useEffect(() => {
    if (torneioSelecionado) loadEquipes(torneioSelecionado)
  }, [torneioSelecionado])

  const handleSalvar = () => {
    const saveAtleta = async () => {
      try {
        const novoAtleta = {
          nome,
          dataNascimento,
          altura: parseFloat(altura),
          peso: parseFloat(peso),
          equipe: {
            id: Number(equipeSelecionada)
          }
        }

        await apiPost(`${API_BASE_URL}/atletas`, novoAtleta)
        setMessage('Atleta criado com sucesso!')
        setShowDialog(true)

        setTimeout(() => {
          setShowDialog(false)
          router.replace('/admin')
        }, 3000)
      } catch (error: any) {
        setError
        setMessage(error.message || 'Erro ao criar o atleta.')
        setShowDialog(true)
      }
    }

    saveAtleta()
  }

  const isFormValid =
    nome && dataNascimento && altura && peso && modalidade && torneioSelecionado && equipeSelecionada

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Inclusão de Atleta" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          <YStack p="$4" space="$4">
            {/* Nome */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Nome do Atleta</Text>
              <Input
                placeholder="Digite o nome"
                value={nome}
                onChangeText={setNome}
                bg="$color2"
                borderRadius="$3"
                p="$3"
              />
            </YStack>

            {/* Data de Nascimento */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Data de Nascimento</Text>
              <Button
                onPress={() => setShowDatePicker(true)}
                backgroundColor="$color2"
                color="#FFFFFF"
              >
                {dataNascimento ? format(dataNascimento, 'dd/MM/yyyy') : 'Selecionar Data'}
              </Button>

              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={showDatePicker}
                date={dataNascimento || new Date()}
                onDismiss={() => setShowDatePicker(false)}
                onConfirm={({ date }) => {
                  setShowDatePicker(false)
                  setDataNascimento(date)
                }}
              />
            </YStack>

            {/* Altura */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Altura (cm)</Text>
              <Input
                placeholder="Ex: 180"
                keyboardType="numeric"
                value={altura}
                onChangeText={setAltura}
                bg="$color2"
                borderRadius="$3"
                p="$3"
              />
            </YStack>

            {/* Peso */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Peso (kg)</Text>
              <Input
                placeholder="Ex: 75"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
                bg="$color2"
                borderRadius="$3"
                p="$3"
              />
            </YStack>

            {/* Modalidade */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Modalidade</Text>
              <YStack
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color4"
                bg="$color2"
                overflow="hidden"
              >
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
              <YStack
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color4"
                bg="$color2"
                overflow="hidden"
              >
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

            {/* Equipe */}
            <YStack space="$1">
              <Text fontSize={14} color="$gray10">Equipe</Text>
              <YStack
                borderRadius="$3"
                borderWidth={1}
                borderColor="$color4"
                bg="$color2"
                overflow="hidden"
              >
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
                  enabled={torneioSelecionado !== null}
                >
                  <Picker.Item label="Selecione uma equipe" value={null} />
                  {Array.isArray(equipes) && equipes.map((e) => (
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
              onPress={handleSalvar}
              disabled={!isFormValid}
            >
              Salvar Atleta
            </Button>
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
