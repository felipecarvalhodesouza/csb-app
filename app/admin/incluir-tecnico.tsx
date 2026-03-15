import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, Theme, useTheme, ScrollView } from 'tamagui'
import { Picker } from '@react-native-picker/picker'
import Header from '../header'
import Footer from '../footer'
import Dialog from '../componente/dialog-error'
import { modalidades } from '../utils/modalidades'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch, apiPost } from '../utils/api'
import { GenericPicker } from '../componente/GenericPicker'
import { Tela } from '../componente/layout/tela'

export default function IncluirTecnicoScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nome, setNome] = useState('')

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)

    if (!error) {
      router.back();
    }

    setError(null)
  }

  const loadEquipes = async (modalidadeId: string) => {
    if (modalidadeId == null || "Selecione uma modalidade" == modalidadeId) {
      setEquipes([])
      setEquipeSelecionada(null)
      return
    }

    try {
      const data = await apiFetch<any[]>(`${API_BASE_URL}/equipes?codigoModalidade=${modalidadeId}`)
      setEquipes(data)
      setEquipeSelecionada(null)
    } catch (error: any) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar equipes.')
      setShowDialog(true)
    }
  }

  useEffect(() => {
    if (modalidade) {
      loadEquipes(modalidade)
    }
  }, [modalidade])

  const handleSalvar = () => {
    const saveTecnico = async () => {
      try {
        const novoTecnico = {
          nome,
          equipes: [{
            id: Number(equipeSelecionada)
          }],
        }

        await apiPost(`${API_BASE_URL}/tecnicos`, novoTecnico)
        setMessage('Técnico criado com sucesso!')
        setShowDialog(true)
      } catch (error: any) {
        setError(true)
        setMessage(error.message || 'Erro ao criar o técnico.')
        setShowDialog(true)
      }
    }

    saveTecnico()
  }

  const isFormValid =
    nome && modalidade && equipeSelecionada

  return (
    <>
      <Tela title="Inclusão de Técnico" >
        {/* Nome */}
        <YStack space="$1">
          <Text fontSize={14} color="$gray10">Nome do Técnico</Text>
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
          <GenericPicker
            items={modalidades}
            value={modalidade}
            onChange={setModalidade}
            getLabel={(m) => m.nome}
            getValue={(m) => m.id}
            filter={(m) => !m.disable}
          />
        </YStack>


        {/* Equipe */}
        <YStack space="$1">
          <Text fontSize={14} color="$gray10">Equipe</Text>
          <GenericPicker
            items={equipes}
            value={equipeSelecionada}
            onChange={setEquipeSelecionada}
            getLabel={(e) => e.nome}
            getValue={(e) => e.id}
            filter={(e) => !e.disable}
            enabled={modalidade !== null}
          />
        </YStack>

        <Separator my="$3" />

        <Button
          backgroundColor={!isFormValid ? 'grey' : 'black'}
          color="white"
          w="100%"
          onPress={handleSalvar}
          disabled={!isFormValid}
        >
          Salvar Técnico
        </Button>
      </Tela>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        message={message}
        type={error ? 'error' : 'success'}
      />
    </>
  )
}
