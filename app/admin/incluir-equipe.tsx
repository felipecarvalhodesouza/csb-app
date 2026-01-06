import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Input,
  Button,
  Separator,
  Theme,
} from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import { modalidades } from '../utils/modalidades'
import Dialog from '../componente/dialog-error'
import Equipe from '../domain/equipe'
import { API_BASE_URL } from '../../utils/config'
import { apiPost } from '../utils/api'

export default function IncluirEquipeScreen() {
  const router = useRouter()

  const [nomeEquipe, setNomeEquipe] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)

  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const handleSalvar = () => {
    const saveTeam = async () => {
      try {
        const novaEquipe: Partial<Equipe> = {
          nome: nomeEquipe,
          imagemPath: null, // Por enquanto vazio
        }

        await apiPost(`${API_BASE_URL}/equipes`, novaEquipe)
        setMessage('Equipe criada com sucesso!')
        setShowDialog(true)

        setTimeout(() => {
          setShowDialog(false)
          router.replace('/admin')
        }, 3000)
      } catch (error: any) {
        setError(true)
        setMessage(error.message || 'Erro ao criar a equipe.')
        setShowDialog(true)
      }
    }

    saveTeam()
  }

  const isFormValid = nomeEquipe && modalidade

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Inclusão de Equipe" />

        <YStack p="$4" space="$4">
          {/* Nome da Equipe */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Nome da Equipe</Text>
            <Input
              placeholder="Digite o nome da equipe"
              value={nomeEquipe}
              onChangeText={setNomeEquipe}
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
                  color: '#FFFFFF',
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

          <Separator my="$3" />

          {/* Botão Salvar */}
          <Button
            backgroundColor={!isFormValid ? "grey" : "black"}
            color="white"
            w="100%"
            onPress={handleSalvar}
            disabled={!isFormValid}
          >
            Salvar Equipe
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
