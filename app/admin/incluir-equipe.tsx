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
import Equipe from '../domain/equipe'

export default function IncluirEquipeScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nomeEquipe, setNomeEquipe] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleCloseDialog = () => {
    setShowErrorDialog(false)
    setErrorMessage(null)
  }

  const handleSalvar = () => {
    const saveTeam = async () => {
      try {
        const novaEquipe: Partial<Equipe> = {
          nome: nomeEquipe,
          imagemPath: null, // Por enquanto vazio
        }

        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const response = await fetch('http://192.168.1.13:8080/equipes', {
          method: 'POST',
          headers,
          body: JSON.stringify(novaEquipe),
        })

        if (response.ok) {
          setErrorMessage('Equipe criada com sucesso!')
          setShowErrorDialog(true)

          setTimeout(() => {
            setShowErrorDialog(false)
            router.replace('/admin')
          }, 3000)
        } else {
          const responseError = await response.json()
          setErrorMessage(responseError.message || 'Erro ao criar a equipe.')
          setShowErrorDialog(true)
        }
      } catch (error: any) {
        console.error('Erro na requisição:', error)
        setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
        setShowErrorDialog(true)
      }
    }

    saveTeam()
  }

  const isFormValid = nomeEquipe && modalidade

  return (
    <Theme name={theme.name}>
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

        {/* Dialog de Erro / Sucesso */}
        <DialogError
          open={showErrorDialog}
          onClose={handleCloseDialog}
          message={errorMessage}
        />
      </YStack>
    </Theme>
  )
}
