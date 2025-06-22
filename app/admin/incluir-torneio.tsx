import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Input,
  Button,
  Separator,
  Theme,
  useTheme,
} from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import { modalidades } from '../utils/modalidades'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DialogError from '../componente/dialog-error'

export default function IncluirTorneioScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)
  const [ano, setAno] = useState('')

const [errorMessage, setErrorMessage] = useState<string | null>(null)
const [showErrorDialog, setShowErrorDialog] = useState(false)

const handleCloseDialog = () => {
  setShowErrorDialog(false)
  setErrorMessage(null)
}

  const handleSalvar = async (options: RequestInit = {}) => {
    try {
      const novoTorneio = {
        nome,
        modalidade,
        ano: parseInt(ano),
      }

      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch('http://localhost:8080/torneios', {
        ...options,
        method: 'POST',
        headers,
        body: JSON.stringify(novoTorneio),
      })

      if (response.ok) {
        alert('Torneio criado com sucesso!')
        router.replace('/admin')
      } else {
        const responseError = await response.json();
        setErrorMessage(responseError.message || 'Erro ao criar o torneio.')
        setShowErrorDialog(true)
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error)
      setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
      setShowErrorDialog(true)
    }
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Inclusão de Torneio" />

        <YStack p="$4" space="$4">
          {/* Nome */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Nome do Torneio</Text>
            <Input
              placeholder="Digite o nome"
              value={nome}
              onChangeText={setNome}
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

          {/* Ano */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Ano</Text>
            <Input
              placeholder="2025"
              keyboardType="numeric"
              value={ano}
              onChangeText={setAno}
              bg="$color2"
              borderRadius="$3"
              p="$3"
            />
          </YStack>

          <Separator my="$3" />

          <Button
            backgroundColor="black"
            color="white"
            w="100%"
            onPress={handleSalvar}
          >
            Salvar Torneio
          </Button>
        </YStack>

        <Footer />

        {/* Dialog de Erro */}
        <DialogError
        open={showErrorDialog}
        onClose={handleCloseDialog}
        message={errorMessage}
        />
      </YStack>
    </Theme>
  )
}
