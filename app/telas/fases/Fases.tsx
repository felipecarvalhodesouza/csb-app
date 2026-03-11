import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
    YStack,
    XStack,
    Text,
    View,
    useTheme,
    ScrollView,
    Spinner,
} from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { API_BASE_URL } from '../../../utils/config'
import { Tela } from '../../componente/layout/tela'
import { apiFetch } from '../../utils/api'
import Fase from '../../domain/fase'
import Dialog from '../../componente/dialog-error'

export default function CategoriasScreen() {
    const router = useRouter()
    const { torneioId, categoriaId: faseId } = useLocalSearchParams<{ torneioId: string, categoriaId: string }>()
    const [fases, setFases] = useState<Fase[]>([])
    const [loading, setLoading] = useState(true)

    const [message, setMessage] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [error, setError] = useState<boolean | null>(null)

    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)
        setError(null)
    }

    useEffect(() => {
        const loadFases = async () => {
            try {

                const fases = await apiFetch<Fase>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${faseId}/fases`)
                setFases(fases)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        if (torneioId && faseId) loadFases()
    }, [torneioId, faseId])

    const handleSelecionarFase = (faseId: number) => {

    }

    return (
        <>
        <Tela title="Fases" scroll={false}>
            {loading ? (
                <YStack f={1} jc="center" ai="center">
                    <Spinner size="large" color="$blue10" />
                </YStack>
            ) : fases.length === 0 ? (
                <YStack f={1} jc="center" ai="center" px="$4">
                    <Text fontSize={16} color="$gray10" textAlign="center">
                        Esse torneio não possui nenhuma fase cadastrada
                    </Text>
                </YStack>
            ) : (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
                    {fases.map((fase) => (
                        <XStack
                            key={fase.id}
                            bg="$color2"
                            p="$4"
                            br="$4"
                            ai="center"
                            onPress={() => handleSelecionarFase(fase.id)}
                            hoverStyle={{ bg: '$color3' }}
                            pressStyle={{ bg: '$color4' }}
                        >
                            <View
                                bg="$blue10"
                                p="$3"
                                br="$10"
                                mr="$3"
                                ai="center"
                                jc="center"
                            >
                                <MaterialCommunityIcons name="account-group" size={24} color="white" />
                            </View>

                            <YStack>
                                <Text fontSize={16} color="white">{fase.nome}</Text>
                            </YStack>

                            <View f={1} />
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                        </XStack>
                    ))}
                </ScrollView>
            )}
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
