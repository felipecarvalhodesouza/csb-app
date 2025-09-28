import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Separator, Theme, useTheme, XStack, Checkbox } from 'tamagui'
import Header from '../header'
import Footer from '../footer'
import DialogError from '../componente/dialog-error'
import { API_BASE_URL } from '../../utils/config'
import { modalidades } from '../utils/modalidades'
import { apiPost } from '../utils/api'
import { Check } from '@tamagui/lucide-icons'

export default function IncluirArbitroScreen() {
    const theme = useTheme()
    const router = useRouter()

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(true)
    const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<number[]>([])

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showErrorDialog, setShowErrorDialog] = useState(false)

    const handleCloseDialog = () => {
        setShowErrorDialog(false)
        setErrorMessage(null)
    }

    const handleSalvar = async () => {
        try {
            const novoArbitro = {
                nome,
                email,
                modalidades: modalidadesSelecionadas.map(id => id - 1)
            }

            await apiPost(`${API_BASE_URL}/arbitros`, novoArbitro)

            setErrorMessage('Árbitro cadastrado com sucesso!')
            setShowErrorDialog(true)

            setTimeout(() => {
                setShowErrorDialog(false)
                router.replace('/admin')
            }, 3000)

        } catch (error: any) {
            console.error('Erro na requisição:', error)
            setErrorMessage(error.message || 'Falha ao conectar com o servidor.')
            setShowErrorDialog(true)
        }
    }

    const toggleModalidade = (id: number) => {
        setModalidadesSelecionadas(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    function validateEmail(value: string) {
        // Simple email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setEmailValid(re.test(value))
        setEmail(value)
    }

    const isFormValid = nome && emailValid && modalidadesSelecionadas.length > 0

    return (
        <Theme>
            <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
                <Header title="Inclusão de Árbitro" />

                <YStack p="$4" space="$4">
                    {/* Nome */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Nome do Árbitro</Text>
                        <Input
                            placeholder="Digite o nome"
                            value={nome}
                            onChangeText={setNome}
                            bg="$color2"
                            borderRadius="$3"
                            p="$3"
                        />
                    </YStack>

                    {/* Email */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Email</Text>
                        <Input
                            placeholder="Digite o email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={validateEmail}
                            bg="$color2"
                            borderRadius="$3"
                            p="$3"
                            autoCapitalize="none"
                        />
                        {!emailValid && (
                            <Text color="$red10" fontSize={14}>Email inválido</Text>
                        )}
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
                        Salvar Árbitro
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
