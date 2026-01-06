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
import Dialog from '../componente/dialog-error'
import Categoria from '../domain/categoria'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch, apiPost } from '../utils/api'
import Torneio from '../domain/torneio'

export default function IncluirCategoriaScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nomeCategoria, setNomeCategoria] = useState('')
  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([]) // Lista de torneios da modalidade
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  
  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const loadTorneios = async (modalidadeId: string, options:RequestInit = {}) => {
    if(modalidadeId == null || "Selecione uma modalidade" == modalidadeId){
      setTorneios(null)
      setModalidade(null)
      return;
    }

    try {
      const torneios = await apiFetch(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`, options) as Torneio[];
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

        await apiPost(`${API_BASE_URL}/torneios/${novaCategoria.torneio.id}/categorias`, novaCategoria)
        setMessage('Categoria criada com sucesso!')
        setShowDialog(true)
        setTimeout(() => {
          setShowDialog(false)
          router.replace('/admin')
        }, 3000)
      } catch (error: any) {
        setError(true)
        setMessage(error.message || 'Erro ao criar a categoria.')
        setShowDialog(true)
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
    <Theme>
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
