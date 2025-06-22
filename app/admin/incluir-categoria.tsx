import { useState, useEffect } from 'react'
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
import Categoria from '../domain/categoria'

export default function IncluirCategoriaScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nomeCategoria, setNomeCategoria] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([]) // Lista de torneios da modalidade
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleCloseDialog = () => {
    setShowErrorDialog(false)
    setErrorMessage(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    if(modalidadeId == null || "Selecione uma modalidade" == modalidadeId){
      setTorneios(null)
      setModalidade(null)
      return;
    }

    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(`http://localhost:8080/torneios/modalidade/${modalidadeId}`, { headers })
      const torneios = await response.json()
      setTorneios(torneios)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  const handleSalvar = () => {
    const saveCategory = async () => {
      try {
        const novaCategoria: Categoria = {
          nome: nomeCategoria,
          torneio: {
            id: Number(torneioSelecionado)
          }
        }

        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        console.log(nomeCategoria)
        console.log(torneioSelecionado)

        const response = await fetch(`http://localhost:8080/torneios/${novaCategoria.torneio.id}/categorias`, {
          method: 'POST',
          headers,
          body: JSON.stringify(novaCategoria),
        })

        if (response.ok) {
          setErrorMessage('Categoria criada com sucesso!')
          setShowErrorDialog(true)

          setTimeout(() => {
            setShowErrorDialog(false)
            router.replace('/admin')
          }, 3000)


        } else {
          const responseError = await response.json()
          setErrorMessage(responseError.message || 'Erro ao criar a categoria.')
          setShowErrorDialog(true)
        }
      } catch (error: any) {
        console.error('Erro na requisição:', error)
        setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
        setShowErrorDialog(true)
      }
    }

    saveCategory();
  }

  useEffect(() => {
    if (modalidade) {
      loadTorneios(modalidade)
    } else {
      setTorneios([])
    }
  }, [modalidade])

  const isFormValid = nomeCategoria && modalidade && torneioSelecionado;

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Inclusão de Categoria" />

        <YStack p="$4" space="$4">
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Nome da Categoria</Text>
            <Input
              placeholder="Digite o nome da categoria"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
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
                style={{ height: 40, paddingHorizontal: 8 }}
                enabled={modalidade !== null}
              >
                <Picker.Item label="Selecione um torneio" value={null} />
                {Array.isArray(torneios) && torneios.map((torneio) => (
                  <Picker.Item key={torneio.id} label={torneio.nome} value={torneio.id} />
                ))}
              </Picker>
            </YStack>
          </YStack>

          <Separator my="$3" />

          <Button
            backgroundColor={!isFormValid ? "grey" : "black"}
            color="white"
            w="100%"
            onPress={handleSalvar}
            disabled={!isFormValid}
          >
            Salvar Categoria
          </Button>
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
