import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import {
  YStack,
  Text,
  Input,
  Button,
  Separator,
  Theme,
  Spinner,
} from 'tamagui'

import Header from '../header'
import Footer from '../footer'
import Dialog from '../componente/dialog-error'
import { modalidades } from '../utils/modalidades'
import { API_BASE_URL } from '../../utils/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiFetch, apiPut } from '../utils/api'

type EquipeResponse = {
  id: number
  nome: string
  modalidade: string
  imagemPath?: string | null
}

export default function EditarEquipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [nomeEquipe, setNomeEquipe] = useState('')
  const [modalidade, setModalidade] = useState<string>('')

  const [imagemUri, setImagemUri] = useState<string | null>(null)
  const [imagemFile, setImagemFile] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  /* =========================
     Carregar equipe
     ========================= */
  useEffect(() => {
    if (!id) return

    const loadEquipe = async () => {
      try {

        const equipe = await apiFetch<EquipeResponse>(`${API_BASE_URL}/equipes/${id}`)

        setNomeEquipe(equipe.nome)
        setModalidade(equipe.modalidade)
        setImagemUri(equipe.imagemPath || null)
      } catch (e: any) {
        setError(true)
        setMessage(e.message)
        setShowDialog(true)
      } finally {
        setLoading(false)
      }
    }

    loadEquipe()
  }, [id])

  /* =========================
     Selecionar imagem
     ========================= */
  const handleSelecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setImagemUri(asset.uri)
      setImagemFile({
        uri: asset.uri,
        name: 'equipe.jpg',
        type: 'image/jpeg',
      })
    }
  }

  /* =========================
     Salvar dados (SEM imagem)
     ========================= */
  const handleSalvarEquipe = async () => {
    if (!id) return
    setSaving(true)

    try {

      await apiPut(`${API_BASE_URL}/equipes/${id}`, {
        nome: nomeEquipe,
      })

      setError(false)
      setMessage('Equipe atualizada com sucesso!')
      setShowDialog(true)
    } catch (e: any) {
      setError(true)
      setMessage(e.message || 'Erro ao salvar equipe')
      setShowDialog(true)
    } finally {
      setSaving(false)
    }
  }

  /* =========================
     Upload da imagem (SEPARADO)
     ========================= */
  const handleUploadImagem = async () => {
    if (!id || !imagemFile) return
    setUploading(true)

    try {
      const session = await AsyncStorage.getItem('session_user')
      if (!session) throw new Error('Usuário não autenticado')

      const { token } = JSON.parse(session)

      const formData = new FormData()
      formData.append('file', imagemFile)

      const response = await fetch(
        `${API_BASE_URL}/equipes/${id}/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      setImagemFile(null)
      setError(false)
      setMessage('Imagem enviada com sucesso!')
      setShowDialog(true)
    } catch (e: any) {
      setError(true)
      setMessage(e.message || 'Erro no upload da imagem')
      setShowDialog(true)
    } finally {
      setUploading(false)
    }
  }

  const nomeModalidade =
    modalidades.find(m => m.label === modalidade)?.nome || modalidade

  /* =========================
     Render
     ========================= */
  if (loading) {
    return (
      <Theme>
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" />
        </YStack>
      </Theme>
    )
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Editar Equipe" />

        <YStack p="$4" space="$4">
          {/* Nome */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">
              Nome da Equipe
            </Text>
            <Input
              value={nomeEquipe}
              onChangeText={setNomeEquipe}
              bg="$color2"
              borderRadius="$3"
              p="$3"
            />
          </YStack>

          {/* Modalidade - READ ONLY */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">
              Modalidade
            </Text>
            <Text fontSize={16} color="white">
              {nomeModalidade}
            </Text>
          </YStack>

          {/* Imagem */}
          <YStack space="$2">
            <Text fontSize={14} color="$gray10">
              Imagem da Equipe
            </Text>

            {imagemUri && (
              <Image
                source={{ uri: imagemUri }}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              />
            )}

            <Button
              onPress={handleSelecionarImagem}
              backgroundColor="$color4"
            >
              Selecionar Imagem
            </Button>

            <Button
              onPress={handleUploadImagem}
              backgroundColor="black"
              disabled={!imagemFile || uploading}
            >
              {uploading ? 'Enviando...' : 'Upar Imagem'}
            </Button>
          </YStack>

          <Separator my="$3" />

          <Button
            backgroundColor={saving ? 'grey' : 'black'}
            color="white"
            onPress={handleSalvarEquipe}
            disabled={saving || !nomeEquipe}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </YStack>

        <Footer />

        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          message={message}
          type={error ? 'error' : 'success'}
        />
      </YStack>
    </Theme>
  )
}
