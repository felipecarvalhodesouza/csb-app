import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, useTheme } from 'tamagui'
import Dialog from '../../componente/dialog-error'
import { DatePickerModal } from 'react-native-paper-dates'
import { format } from 'date-fns'
import { modalidades } from '../../utils/modalidades'
import { API_BASE_URL } from '../../../utils/config'
import { apiFetch, apiPost } from '../../utils/api'
import { Tela } from '../../componente/layout/tela'
import { GenericPicker } from '../../componente/GenericPicker'
import Torneio from '../../domain/torneio'
import { GestureResponderEvent } from 'react-native'
import { MultipleSelect } from '../../componente/MultipleSelect'
import Categoria from '../../domain/categoria'

export default function IncluirAtletaScreen() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [apelido, setApelido] = useState('')
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null)
  const [numeroCamisa, setNumeroCamisa] = useState('')

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<any[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)
  const [equipes, setEquipes] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [categorias, setCategorias] = useState<any[]>([]) 
  const [categoriasVinculadas, setCategoriasVinculadas] = useState<any[]>([])

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
    router.back()
  }

  const loadTorneios = async (modalidadeId: string) => {
    setEquipes([])
    setEquipeSelecionada(null)
    setTorneioSelecionado(null)

    if (modalidadeId == null || "Selecione uma opção" == modalidadeId) {
      setTorneios([])
      setModalidade(null)
      return
    }

    try {
      const torneios = await apiFetch<Torneio[]>(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`)
      setTorneios(torneios)
    } catch (error: any) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar torneios.')
      setShowDialog(true)
    }
  }

  const loadEquipes = async (torneioId: string) => {
    setEquipeSelecionada(null)

    if (torneioId == null || "Selecione uma opção" == torneioId) {
      setTorneioSelecionado(null)
      setEquipes([])
      return
    }

    try {
      const equipes = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/equipes`)
      setEquipes(equipes)

    } catch (error: any) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar equipes.')
      setShowDialog(true)
    }
  }

    const loadCategorias = async (torneioId: string, equipeId: string) => {
  
      if (!torneioId || equipeId === 'Selecione uma opção') {
        setCategorias([])
        setCategoriasVinculadas(null)
        return
      }
    
      try {
        const categorias = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/equipes/${equipeId}`)
        setCategorias(categorias)
      } catch (error) {
          setError(true)
          setMessage(error.message || 'Erro ao carregar categorias.')
          setShowDialog(true)
      }
    }

  useEffect(() => {
    if (modalidade) loadTorneios(modalidade)
  }, [modalidade])

  useEffect(() => {
    if (torneioSelecionado) loadEquipes(torneioSelecionado)
  }, [torneioSelecionado])

  useEffect(() => {
    if (torneioSelecionado && equipeSelecionada) {
      loadCategorias(torneioSelecionado, equipeSelecionada)
    }
  }, [torneioSelecionado, equipeSelecionada])

  const handleNumeroCamisa = (text: string) => {
    // Remove qualquer coisa que não seja número
    const onlyNumbers = text.replace(/[^0-9]/g, "")

    // Limita entre 1 e 99
    let value = parseInt(onlyNumbers, 10)
    if (isNaN(value)) {
      setNumeroCamisa("")
      return
    }

    if (value < 1) value = 1
    if (value > 99) value = 99

    setNumeroCamisa(value.toString())
  }

  const handleSalvar = () => {
    const saveAtleta = async () => {
      const categorias: Categoria[] = categoriasVinculadas.map(id => ({ id }))
      try {
        const novoAtleta = {
          nome,
          apelido,
          dataNascimento,
          equipes: [{
            id: Number(equipeSelecionada)
          }],
          categorias: categorias,
          numeroCamisa: numeroCamisa ? parseInt(numeroCamisa) : null
        }

        await apiPost(`${API_BASE_URL}/atletas`, novoAtleta)
        setMessage('Atleta criado com sucesso!')
        setShowDialog(true)

      } catch (error: any) {
        setError(true)
        setMessage(error.message || 'Erro ao criar o atleta.')
        setShowDialog(true)
      }
    }

    saveAtleta()
  }

  const isFormValid =
    nome && dataNascimento && modalidade && torneioSelecionado && equipeSelecionada

  function handleLimparForm(event: GestureResponderEvent): void {
    setNome('')
    setApelido('')
    setDataNascimento(null)
    setModalidade("Selecione uma opção")
    setTorneios([])
    setTorneioSelecionado(null)
    setEquipes([])
    setEquipeSelecionada(null)
    setCategorias([])
    setCategoriasVinculadas([])
    setNumeroCamisa('')
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  return (
    <>
      <Tela title="Inclusão de Atleta">
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
          {/* Apelido */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Apelido</Text>
            <Input
              placeholder="Digite o apelido"
              value={apelido}
              onChangeText={setApelido}
              bg="$color2"
              borderRadius="$3"
              p="$3"
            />
          </YStack>
          {/* Número da Camisa */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Número da Camisa</Text>
            <Input
              value={numeroCamisa}
              onChangeText={handleNumeroCamisa}
              keyboardType="numeric" // mostra teclado numérico no mobile
              placeholder="1-99"
              textAlign="center"
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

          {/* Torneio */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Torneio</Text>
            <GenericPicker
              items={torneios}
              value={torneioSelecionado}
              onChange={setTorneioSelecionado}
              getLabel={(t) => t.nome}
              getValue={(t) => t.id}
              enabled={modalidade !== null}
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
              enabled={torneioSelecionado !== null}
            />
          </YStack>

          {/* Atletas Disponíveis - MultiSelect */}
          <MultipleSelect
            label="Categorias"
            items={categorias}
            value={categoriasVinculadas}
            onChange={setCategoriasVinculadas}
            getLabel={(a) => a.nome}
            getValue={(a) => a.id}
            placeholder="Selecione as categorias"
          />

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
      </Tela>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        message={message}
        type={error ? 'error' : 'success'}
        extra={!error && (
          <Button
            mt="$2"
            onPress={handleLimparForm}
            backgroundColor="black"
            color="white"
          >
            Novo atleta
          </Button>
        )}
        />

    </>
  )
}
