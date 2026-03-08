import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, useTheme, XStack, Checkbox } from 'tamagui'
import Dialog from '../../componente/dialog-error'
import { API_BASE_URL } from '../../../utils/config'
import { modalidades } from '../../utils/modalidades'
import { apiFetch, apiPost } from '../../utils/api'
import { Check } from '@tamagui/lucide-icons'
import { Tela } from '../../componente/layout/tela'
import Usuario from '../../domain/usuario'
import { GenericPicker } from '../../componente/GenericPicker'

export default function IncluirEstatisticoScreen() {
    const theme = useTheme()
    const router = useRouter()

    const [nome, setNome] = useState('')
    const [usuario, setUsuario] = useState('')
    const [usuarios, setUsuarios] = useState<Usuario[]>([]) 
    const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<number[]>([])

    const [message, setMessage] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [error, setError] = useState<boolean | null>(null)

    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)

        if(!error) {
            router.back();
        }

        setError(null)
    }

    const loadUsuarios = async () => {
        try {
            const usuarios = await apiFetch<Usuario[]>(`${API_BASE_URL}/usuarios/admin/estatisticos`)
            setUsuarios(usuarios)
        } catch (error: any) {
            setError(true)
            setMessage(error.message || 'Erro ao carregar usuários.')
            setShowDialog(true)
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadUsuarios()
        }, [])
    )
      

    const handleSalvar = async () => {
        try {
            const novoEstatistico = {
                nome: nome,
                usuario : {
                    id: usuario
                },
                modalidades: modalidadesSelecionadas.map(id => id - 1)
            }

            await apiPost(`${API_BASE_URL}/estatisticos`, novoEstatistico)

            setMessage('Estatístico cadastrado com sucesso!')
            setShowDialog(true)
        } catch (error: any) {
            setMessage(error.message || 'Falha ao conectar com o servidor.')
            setShowDialog(true)
            setError(true)
        }
    }

    const toggleModalidade = (id: number) => {
        setModalidadesSelecionadas(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const isFormValid = nome && usuario && modalidadesSelecionadas.length > 0

    return (
        <>
            <Tela title="Inclusão de Estatístico">
                <YStack p="$4" space="$4">
                    {/* Nome */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Nome do Estatístico</Text>
                        <Input
                            placeholder="Digite o nome"
                            value={nome}
                            onChangeText={setNome}
                            bg="$color2"
                            borderRadius="$3"
                            p="$3"
                        />
                    </YStack>

                    {/* Usuário */}
                    <YStack space="$1">
                    <Text fontSize={14} color="$gray10">Usuário</Text>
                        <GenericPicker
                        items={usuarios}
                        value={usuario}
                        onChange={setUsuario}
                        getLabel={(m) => m.nome}
                        getValue={(m) => m.id}
                        />
                    </YStack>

                    {/* Modalidades */}
                    <YStack space="$2" mt="$3">
                        <Text fontSize={14} color="$gray10">Modalidades</Text>
                        {modalidades.map((m) => (
                            <XStack key={m.id} ai="center" space="$3" mb={"$2"}>
                                <Checkbox
                                    size="$5"
                                    checked={modalidadesSelecionadas.includes(m.id)}
                                    onCheckedChange={() => toggleModalidade(m.id)} >


                                    <Checkbox.Indicator>
                                        <Check size={12} />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <Text>{m.nome}</Text>
                            </XStack>
                        ))}
                    </YStack>

                    <Separator my="$3" />

                    <Button
                        backgroundColor={!isFormValid ? 'grey' : 'black'}
                        color="white"
                        w="100%"
                        onPress={handleSalvar}
                        disabled={!isFormValid}
                    >
                        Salvar Estatístico
                    </Button>
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
