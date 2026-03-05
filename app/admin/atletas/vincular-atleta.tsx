import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Button, Separator } from 'tamagui'
import Dialog from '../../componente/dialog-error'
import { modalidades } from '../../utils/modalidades'
import { API_BASE_URL } from '../../../utils/config'
import { apiFetch, apiPost } from '../../utils/api'
import { Tela } from '../../componente/layout/tela'
import { GenericPicker } from '../../componente/GenericPicker'
import Torneio from '../../domain/torneio'
import { MultipleSelect } from '../../componente/MultipleSelect'

export default function VincularAtletaCategoriaScreen() {
  const router = useRouter()

  const [modalidade, setModalidade] = useState<string | null>(null)
  const [torneios, setTorneios] = useState<Torneio[]>([])
  const [torneioSelecionado, setTorneioSelecionado] = useState<string | null>(null)

  const [categorias, setCategorias] = useState<any[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)

  const [equipes, setEquipesVinculadas] = useState<any[]>([])
  const [equipeSelecionada, setEquipeSelecionada] = useState<string | null>(null)

  const [atletasDisponiveis, setAtletasDisponiveis] = useState<any[]>([])
  const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([])

  const [atletasVinculados, setAtletasVinculados] = useState<any[]>([])

  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  const loadTorneios = async (modalidadeId: string) => {
    if (!modalidadeId || modalidadeId === 'Selecione uma opção') {
      setModalidade(null)
      setTorneios([])
      setTorneioSelecionado(null)
      return
    }
    try {
      const torneios = await apiFetch<Torneio[]>(`${API_BASE_URL}/torneios/modalidade/${modalidadeId}`)
      setTorneios(torneios)
      setTorneioSelecionado(null)
    } catch (error) {
        setError(true)
        setMessage(error.message || 'Erro ao carregar torneios.')
        setShowDialog(true)
    }
  }

  const loadCategorias = async (torneioId: string) => {
      setCategoriaSelecionada(null)
      setEquipeSelecionada(null)
      setEquipesVinculadas([])
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    
    if (!torneioId || torneioId === 'Selecione uma opção') {
      setCategorias([])
      setCategoriaSelecionada(null)
      setTorneioSelecionado(null)
      return
    }
  
    try {
      const categorias = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias`)
      setCategorias(categorias)
    } catch (error) {
        setError(true)
        setMessage(error.message || 'Erro ao carregar categorias.')
        setShowDialog(true)
    }
  }

  const loadEquipes = async (torneioId:string, categoriaId: string) => {
    if (!categoriaId || !torneioId || categoriaId === 'Selecione uma opção') {
      setCategoriaSelecionada(null)
      setEquipeSelecionada(null)
      return
    }

    try {
      const equipes = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`)
      setEquipesVinculadas(equipes)
    } catch (error) {
        setError(true)
        setMessage(error.message || 'Erro ao carregar equipes .')
        setShowDialog(true)
    }
  }

  const loadAtletas = async (torneioId: string, categoriaId: string, equipeId: string) => {
    
    if (!categoriaId || !torneioId || !equipeId || equipeId === 'Selecione uma opção') {
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
      return
    }
    try {

      const atletasVinculados = await apiFetch<any[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes/${equipeId}/atletas`)
      const atletasDisponiveis = await apiFetch<any[]>(`${API_BASE_URL}/equipes/${equipeId}/atletas`)

      const atletasDisponiveisFiltrados = atletasDisponiveis.filter((atletaDisponivel: any) =>
        !atletasVinculados.some((atletaVinculado: any) => atletaVinculado.id === atletaDisponivel.id)
      )
      setAtletasDisponiveis(atletasDisponiveisFiltrados)
      setAtletasVinculados(atletasVinculados)
      setAtletasSelecionados([])
    } catch (error) {
        setError(true)
        setMessage(error.message || 'Erro ao carregar atletas .')
        setShowDialog(true)
    }
  }

  useEffect(() => {
    if (modalidade !== null) {
      loadTorneios(modalidade)
    } else {
      setTorneios([])
      setTorneioSelecionado(null)
    }
  }, [modalidade])

  useEffect(() => {
    if (torneioSelecionado !== null && torneioSelecionado !== 'Selecione um torneio') {
      loadCategorias(torneioSelecionado)
    } else {
      setTorneioSelecionado(null)
      setCategorias([])
      setCategoriaSelecionada(null)
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    }
  }, [torneioSelecionado])

    useEffect(() => {
      if (categoriaSelecionada !== null && categoriaSelecionada !== 'Selecione uma categoria') {
        loadEquipes(torneioSelecionado, categoriaSelecionada)
      } else {
        setCategoriaSelecionada(null)
        setEquipesVinculadas([])
        setEquipeSelecionada(null)
      }
    }, [torneioSelecionado, categoriaSelecionada])

  useEffect(() => {
    if (equipeSelecionada !== null && equipeSelecionada !== 'Selecione uma equipe') {
      loadAtletas(torneioSelecionado, categoriaSelecionada, equipeSelecionada)
    } else {
      setEquipeSelecionada(null)
      setAtletasDisponiveis([])
      setAtletasVinculados([])
      setAtletasSelecionados([])
    }
  }, [torneioSelecionado, categoriaSelecionada, equipeSelecionada])

  const handleVincular = () => {
    const vincularAtletas = async () => {
      try {

        const body = {
          atletasId: atletasSelecionados.map(Number)
        }

        apiPost(`${API_BASE_URL}/torneios/${torneioSelecionado}/categorias/${categoriaSelecionada}/atletas`, body)
        setMessage('Atletas vinculados com sucesso!')
        setShowDialog(true)
        loadAtletas(torneioSelecionado!, categoriaSelecionada!, equipeSelecionada)

      } catch (error: any) {
        setError(true)
        setMessage(error.message || 'Erro ao vincular atleta.')
        setShowDialog(true)
      }
    }
    vincularAtletas()
  }

  const isFormValid = modalidade && torneioSelecionado && categoriaSelecionada && atletasSelecionados.length > 0

  return (
    <>
    <Tela title="Vincular Atleta à Categoria">
        <YStack p="$4" space="$4">
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

          {/* Categoria */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Categoria</Text>
            <GenericPicker
              items={categorias}
              value={categoriaSelecionada}
              onChange={setCategoriaSelecionada}
              getLabel={(c) => c.nome}
              getValue={(c) => c.id}
              enabled={torneioSelecionado !== null}
            />
          </YStack>

          {/* Equipes */}
          <YStack space="$1">
            <Text fontSize={14} color="$gray10">Equipes</Text>
            <GenericPicker
              items={equipes}
              value={equipeSelecionada}
              onChange={setEquipeSelecionada}
              getLabel={(e) => e.nome}
              getValue={(e) => e.id}
              enabled={categoriaSelecionada !== null}
            />
          </YStack>

          {/* Atletas Disponíveis - MultiSelect */}
          <MultipleSelect
            label="Atletas"
            items={atletasDisponiveis}
            value={atletasSelecionados}
            onChange={setAtletasSelecionados}
            getLabel={(a) => a.nome}
            getValue={(a) => a.id}
            placeholder="Selecione atletas"
          />
          
          <Separator my="$3" />
          <Button
            backgroundColor={!isFormValid ? 'grey' : 'black'}
            color="white"
            w="100%"
            onPress={handleVincular}
            disabled={!isFormValid}
          >
            Vincular Atletas
          </Button>
          {/* Listagem de atletas já vinculados */}
          <YStack mt="$4" space="$2">
            <Text fontSize={16} fontWeight="bold">Atletas já vinculados à categoria:</Text>
            {atletasVinculados.length === 0 && (
              <Text color="$gray10">Nenhum atleta vinculado.</Text>
            )}
            {atletasVinculados.map((atleta) => (
              <Text key={atleta.id} color="$gray10">- {atleta.nome}</Text>
            ))}
          </YStack>
      </YStack>
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
