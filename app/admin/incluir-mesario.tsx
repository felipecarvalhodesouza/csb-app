import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, XStack, Checkbox } from 'tamagui'
import Dialog from '../componente/dialog-error'
import { API_BASE_URL } from '../../utils/config'
import { modalidades } from '../utils/modalidades'
import { apiPost } from '../utils/api'
import { Check } from '@tamagui/lucide-icons'
import { Tela } from '../componente/layout/tela'

export default function IncluirMesarioScreen() {
    const router = useRouter()

    const [nome, setNome] = useState('')
    const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<number[]>([])

    const [message, setMessage] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [error, setError] = useState<boolean | null>(null)

    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)

        if (!error) {
            router.back()
        }

        setError(null)
    }

    const handleSalvar = async () => {
        try {
            const novoMesario = {
                nome,
                modalidades: modalidadesSelecionadas.map(id => id - 1)
            }

            await apiPost(`${API_BASE_URL}/mesarios`, novoMesario)

            setMessage('Mesário cadastrado com sucesso!')
            setShowDialog(true)
        } catch (error: any) {
            setError(true)
            setMessage(error.message || 'Falha ao conectar com o servidor.')
            setShowDialog(true)
        }
    }

    const toggleModalidade = (id: number) => {
        setModalidadesSelecionadas(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const isFormValid = nome && modalidadesSelecionadas.length > 0

    return (
        <>
            <Tela title="Inclusão de Mesário" >
                {/* Nome */}
                <YStack space="$1">
                    <Text fontSize={14} color="$gray10">Nome do Mesário</Text>
                    <Input
                        placeholder="Digite o nome"
                        value={nome}
                        onChangeText={setNome}
                        bg="$color2"
                        borderRadius="$3"
                        p="$3"
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
                    Salvar Mesário
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
