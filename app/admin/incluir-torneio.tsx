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
import Dialog from '../componente/dialog-error'
import { API_BASE_URL } from '../../utils/config'
import { apiPost } from '../utils/api'

export default function IncluirTorneioScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)
  const [ano, setAno] = useState('')

const [message, setMessage] = useState<string | null>(null)
const [showDialog, setShowDialog] = useState(false)
const [error, setError] = useState<boolean | null>(null)

const handleCloseDialog = () => {
  setShowDialog(false)
  setMessage(null)
  setError(null)
}

  const handleSalvar = async () => {
    try {
      const novoTorneio = {
        nome,
        modalidade,
        ano: parseInt(ano),
      }

      await apiPost(`${API_BASE_URL}/torneios`, novoTorneio)
      setMessage('Torneio criado com sucesso.')
      setShowDialog(true)
      setTimeout(() => {
        setShowDialog(false)
        router.replace('/admin')
      }, 3000)
    } catch (error: any) {
      console.error('Erro na requisição:', error)
      setError(true)
      setMessage(error.message || 'Erro ao criar o torneio.')
      setShowDialog(true)
    }
  }

  return (
    <Theme>
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
                    <Picker.Item key={m.id} label={m.nome} value={m.label} />
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
