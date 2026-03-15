import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import {
    YStack, Text, Button, Input,
    Label,
} from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch } from '../utils/api'
import { GenericPicker } from '../componente/GenericPicker'
import Dialog from '../componente/dialog-error'
import { Tela } from '../componente/layout/tela'
import { getFavoriteModality } from '../../utils/preferences'
import { DatePickerModal, id, TimePickerModal } from 'react-native-paper-dates'

export default function EditarJogoScreen() {

    const { jogoId } = useLocalSearchParams()
    const [jogo, setJogo] = useState<any>(null)
    const router = useRouter()
    const modalidade = getFavoriteModality()

    const [loading, setLoading] = useState(true)

    const [tecnicosMandante, setTecnicosMandante] = useState<any[]>([])
    const [tecnicosVisitante, setTecnicosVisitante] = useState<any[]>([])

    const [tecnicoMandante, setTecnicoMandante] = useState<string | null>(null)
    const [tecnicoVisitante, setTecnicoVisitante] = useState<string | null>(null)

    const [locais, setLocais] = useState<any[]>([])
    const [localSelecionado, setLocalSelecionado] = useState<string | null>(null)

    const [arbitros, setArbitros] = useState<any[]>([])
    const [arbitroSelecionado, setArbitroSelecionado] = useState<string | null>(null)
    const [arbitroAuxiliar, setArbitroAuxiliar] = useState<string | null>(null)

    const [estatisticos, setEstatisticos] = useState<any[]>([])
    const [estatisticoSelecionado, setEstatisticoSelecionado] = useState<string | null>(null)

    const [mesarios, setMesarios] = useState<any[]>([])
    const [mesarioSelecionado, setMesarioSelecionado] = useState<string | null>(null)

    const [dataJogo, setDataJogo] = useState<Date | null>(null)
    const [horaJogo, setHoraJogo] = useState<Date | null>(null)

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const [youtubeLink, setYoutubeLink] = useState('')

    const [showDialog, setShowDialog] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<boolean | null>(null)

    const [erroLink, setErroLink] = useState<string | null>(null)

    const handleCloseDialog = () => {
        setShowDialog(false)
        if (!error) {
            router.back()
        }
    }

    const loadJogo = async () => {
        try {

            const jogo = await apiFetch<any>(`${API_BASE_URL}/jogos/${jogoId}`)
            setJogo(jogo)

            setTecnicoMandante(jogo.tecnicoMandante?.id?.toString() || null)
            setTecnicoVisitante(jogo.tecnicoVisitante?.id?.toString() || null)

            setLocalSelecionado(jogo.local?.id?.toString() || null)

            setArbitroSelecionado(jogo.arbitroPrincipal?.id?.toString() || null)
            setArbitroAuxiliar(jogo.arbitroAuxiliar?.id?.toString() || null)

            setEstatisticoSelecionado(jogo.estatistico?.id?.toString() || null)
            setMesarioSelecionado(jogo.mesario?.id?.toString() || null)

            setYoutubeLink(jogo.streamUrl || '')

            if (jogo.data) {
                const data = new Date(jogo.data)
                setDataJogo(data)
                setHoraJogo(data)
            }

            setLoading(false)

        } catch (e: any) {

            setError(true)
            setMessage(e.message)
            setShowDialog(true)

        }
    }

    useEffect(() => {

        loadJogo()

    }, [])


  const loadLocais = async () => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/locais`)
      .then(data => setLocais(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar locais.')
      setShowDialog(true)
    }
  }

  const loadArbitros = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/arbitros/modalidade/${modalidadeId}`)
      .then(data => setArbitros(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar árbitros.')
      setShowDialog(true)
    }
  }

  const loadEstatisticos = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/estatisticos/modalidade/${modalidadeId}`)
      .then(data => setEstatisticos(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar estatísticos.')
      setShowDialog(true)
    }
  }

  const loadMesarios = async (modalidadeId: string) => {
    try {
      apiFetch<any[]>(`${API_BASE_URL}/mesarios/modalidade/${modalidadeId}`)
      .then(data => setMesarios(data))
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar mesários.')
      setShowDialog(true)
    }
  }

  const loadTecnicos = async (equipeId: string, isMandante: boolean) => {
    if(equipeId == null || "Selecione uma equipe" == equipeId){
        if (isMandante) {
          setTecnicosMandante(null)
          setTecnicoMandante(null)
        } else {
          setTecnicosVisitante(null)
          setTecnicoVisitante(null)
        }
        return;
    }
    
    try {
      apiFetch<any[]>(`${API_BASE_URL}/equipes/${equipeId}/tecnicos`).then(data => { 
        if (isMandante) {
          setTecnicosMandante(data)
        } else {
          setTecnicosVisitante(data)
        }
      })
    } catch (error) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar técnicos.')
      setShowDialog(true)
    }}

    useEffect(() => {
        if(jogo){
            console.log('Carregando técnicos para equipe mandante:', jogo.mandante?.id)
            loadTecnicos(jogo.mandante?.id, true) 
        }
        }, [jogo])

    useEffect(() => {
        if(jogo){
            console.log('Carregando técnicos para equipe visitante:', jogo.visitante?.id)
            loadTecnicos(jogo.visitante?.id, false) 
        }
    }, [jogo])

  useEffect(() => {
    const fetchTorneiosELocais = async () => {
      const modalidadeAwait = await modalidade
      loadLocais()
      loadArbitros(modalidadeAwait)
      loadEstatisticos(modalidadeAwait)
      loadMesarios(modalidadeAwait)
    }

    fetchTorneiosELocais()
  }, [])


    const handleSalvar = async () => {


        if (!isValidYoutubeUrl(youtubeLink)) {
            setError(true)
            setMessage('Link inválido.')
            setShowDialog(true)
            return
        }

        try {

            const user = await AsyncStorage.getItem('session_user')

            const headers = {
                'Authorization': `Bearer ${JSON.parse(user).token}`,
                'Content-Type': 'application/json',
            }

            const data = new Date(
                dataJogo!.getFullYear(),
                dataJogo!.getMonth(),
                dataJogo!.getDate(),
                horaJogo!.getHours(),
                horaJogo!.getMinutes()
            )

            const dataHoraString = format(data, "yyyy-MM-dd'T'HH:mm:ss")

            const jogoAtualizado: any = {
                id: jogo.id,
                data: dataHoraString,
                tecnicoMandante: tecnicoMandante != null  && tecnicoMandante !== "Selecione uma opção" ? { id: Number(tecnicoMandante) } : null,
                tecnicoVisitante: tecnicoVisitante != null && tecnicoVisitante !== "Selecione uma opção" ? { id: Number(tecnicoVisitante) } : null,
                
                arbitroPrincipal: arbitroSelecionado != null && arbitroSelecionado !== "Selecione uma opção" ? { id: Number(arbitroSelecionado) } : null,
                arbitroAuxiliar: arbitroAuxiliar != null && arbitroAuxiliar !== "Selecione uma opção" ? { id: Number(arbitroAuxiliar) } : null,

                estatistico: estatisticoSelecionado != null && estatisticoSelecionado !== "Selecione uma opção" ? { id: Number(estatisticoSelecionado) } : null,
                mesario: mesarioSelecionado != null && mesarioSelecionado !== "Selecione uma opção" ? { id: Number(mesarioSelecionado) } : null,

                streamUrl: youtubeLink || null

            }

            if (localSelecionado != null && localSelecionado !== "Selecione uma opção") {
                jogoAtualizado.local = { id: Number(localSelecionado) }
            }

            const response = await fetch(`${API_BASE_URL}/jogos`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(jogoAtualizado)
            })

            if (response.ok) {

                setError(false)
                setMessage('Jogo atualizado com sucesso!')
                setShowDialog(true)

            } else {

                const err = await response.json()

                setError(true)
                setMessage(err.message)

                setShowDialog(true)

            }

        } catch (e: any) {

            setError(true)
            setMessage(e.message)
            setShowDialog(true)

        }

    }

    if (loading) {

        return (
            <YStack f={1} jc="center" ai="center">
                <Text>Carregando...</Text>
            </YStack>
        )

    }

    return (
        <Tela title="Editar Jogo">

            <YStack p="$4" space="$4">

                {/* Mandante */}
                <YStack space="$1">
                <Text color="$gray10">Equipe Mandante</Text>
                <Text fontSize="$5" fontWeight="600">
                    {jogo.mandante.nome}
                </Text>
                </YStack>

                {/* Técnico Mandante */}
                <YStack space="$1">
                    <Text fontSize={14} color="$gray10">Técnico Mandante</Text>
                    <GenericPicker
                        items={tecnicosMandante}
                        value={tecnicoMandante}
                        onChange={setTecnicoMandante}
                        getLabel={(t) => t.nome}
                        getValue={(t) => t.id}
                        enabled={true}
                    />
                </YStack>

                {/* Visitante */}
                <YStack space="$1">
                <Text color="$gray10">Equipe Visitante</Text>
                <Text fontSize="$5" fontWeight="600">
                    {jogo.visitante.nome}
                </Text>
                </YStack>

                {/* Técnico Visitante */}
                <YStack space="$1">
                    <Text fontSize={14} color="$gray10">Técnico Visitante</Text>
                    <GenericPicker
                        items={tecnicosVisitante}
                        value={tecnicoVisitante}
                        onChange={setTecnicoVisitante}
                        getLabel={(t) => t.nome}
                        getValue={(t) => t.id}
                        enabled={true}
                    />
                </YStack>

                {/* Local */}
                <YStack space="$1">
                    <Text>Local (opcional)</Text>
                    <GenericPicker
                        items={locais}
                        value={localSelecionado}
                        onChange={setLocalSelecionado}
                        getLabel={(l) => l.nome}
                        getValue={(l) => l.id}
                        enabled={true}
                    />
                </YStack>


                {/* Árbitro Principal */}
                <YStack space="$1">
                    <Text>Árbitro Principal</Text>
                    <GenericPicker
                        items={arbitros}
                        value={arbitroSelecionado}
                        onChange={setArbitroSelecionado}
                        getLabel={(a) => a.nome}
                        getValue={(a) => a.id}
                        enabled={true}
                    />
                </YStack>

                {/* Árbitro Auxiliar */}
                <YStack space="$1">
                    <Text>Árbitro Auxiliar</Text>
                    <GenericPicker
                        items={arbitros}
                        value={arbitroAuxiliar}
                        onChange={setArbitroAuxiliar}
                        getLabel={(a) => a.nome}
                        getValue={(a) => a.id}
                        enabled={true}
                    />
                </YStack>

                {/* Mesário */}
                <YStack space="$1">
                    <Text>Mesário</Text>
                    <GenericPicker
                        items={mesarios}
                        value={mesarioSelecionado}
                        onChange={setMesarioSelecionado}
                        getLabel={(m) => m.nome}
                        getValue={(m) => m.id}
                        enabled={true}
                    />
                </YStack>

                {/* Estatístico */}
                <YStack space="$1">
                    <Text>Estatístico</Text>
                    <GenericPicker
                        items={estatisticos}
                        value={estatisticoSelecionado}
                        onChange={setEstatisticoSelecionado}
                        getLabel={(e) => e.nome}
                        getValue={(e) => e.id}
                        enabled={true}
                    />
                </YStack>

            <YStack space="$1">
              <Text>Data do Jogo</Text>
              <Button onPress={() => setShowDatePicker(true)}>{dataJogo ? format(dataJogo, 'dd/MM/yyyy') : 'Selecionar Data'}</Button>
              <DatePickerModal
                locale="pt-BR"
                mode="single"
                visible={showDatePicker}
                date={dataJogo || new Date()}
                onDismiss={() => setShowDatePicker(false)}
                onConfirm={({ date }) => {
                  setShowDatePicker(false)
                  setDataJogo(date)
                }}
              />
            </YStack>

            <YStack space="$1">
              <Text>Hora do Jogo</Text>
              <Button onPress={() => setShowTimePicker(true)}>{horaJogo ? format(horaJogo, 'HH:mm') : 'Selecionar Hora'}</Button>
              <TimePickerModal
                visible={showTimePicker}
                onDismiss={() => setShowTimePicker(false)}
                onConfirm={({ hours, minutes }) => {
                  setShowTimePicker(false)
                  setHoraJogo(new Date(0, 0, 0, hours, minutes))
                }}
                hours={horaJogo?.getHours() || 12}
                minutes={horaJogo?.getMinutes() || 0}
              />
            </YStack>

            <YStack space="$1">
              <Label>Link do YouTube (opcional)</Label>
              <Input
                placeholder="https://youtube.com/..."
                value={youtubeLink}
                onChangeText={setYoutubeLink}
                autoCapitalize="none"
                keyboardType="url"
              />
              {erroLink && <Text color="red">{erroLink}</Text>}
            </YStack>

                <Button
                    backgroundColor="black"
                    color="white"
                    onPress={handleSalvar}
                >
                    Salvar Alterações
                </Button>

            </YStack>

            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                message={message}
                type={error ? 'error' : 'success'}
            />

        </Tela>
    )
}

function isValidYoutubeUrl(url: string): boolean {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')
  } catch {
    return false
  }
}