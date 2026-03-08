import {
    YStack,
    Text,
    Button,
    Select,
    Theme
} from 'tamagui'
import { useEffect, useState } from 'react'
import Header from '../header'
import Footer from '../footer'
import { apiFetch, apiPut } from '../utils/api'
import { API_BASE_URL } from '../../utils/config'
import { useLocalSearchParams } from 'expo-router'
import Dialog from '../componente/dialog-error'
import { GenericPicker } from '../componente/GenericPicker'
import { router } from 'expo-router'
import Usuario from '../domain/usuario'
import { Tela } from '../componente/layout/tela'


export default function EditarPermissoes() {
    const [role, setRole] = useState('USER')
    const [usuario, setUsuario] = useState<any>(null)
    const [error, setError] = useState<boolean | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const { id } = useLocalSearchParams<{ id: string }>()
    const roles: {
        value: 'ADMIN' | 'ESTATISTICO' | 'USER'
        label: string
    }[] = [
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'ESTATISTICO', label: 'Estatístico' },
            { value: 'USER', label: 'Usuário Comum' },
        ]

    const loadUsuario = async () => {
        try {
            const usuario = await apiFetch<Usuario>(`${API_BASE_URL}/usuarios/${id}`)
            setUsuario(usuario)
            setRole(usuario.role)
        } catch (error: any) {
            setError(true)
            setMessage(error.message || 'Erro ao carregar usuários.')
            setShowDialog(true)
        }
    }

    useEffect(() => {
        loadUsuario()
    }, [])

    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)
        setError(null)
        router.back()
    }

    const handleSalvar = async () => {
        if (!id) return

        try {

            await apiPut(`${API_BASE_URL}/usuarios/admin/${id}`, {
                id: id,
                roles: [role],
            })

            setError(false)
            setMessage('Usuário atualizado com sucesso!')
            setShowDialog(true)
        } catch (e: any) {
            setError(true)
            setMessage(e.message || 'Erro ao alterar usuário.')
            setShowDialog(true)
        }
    }

    return (
        <>
            <Tela title="Alteração de Permissões" scroll={false}>
                <YStack flex={1} padding="$4" space="$4">
                    <Text fontSize="$6" fontWeight="bold">
                        Alterar Permissões do Usuário
                    </Text>

                    <YStack space="$2">
                        <Text fontWeight="600">Nome do Usuário</Text>
                        <Text color="$gray10">{usuario?.nome}</Text>
                    </YStack>

                    <YStack space="$2">
                        <Text fontWeight="600">Email do Usuário</Text>
                        <Text color="$gray10">{usuario?.email}</Text>
                    </YStack>

                    <GenericPicker
                        items={roles}
                        value={role}
                        onChange={setRole}
                        getLabel={(r) => r.label}
                        getValue={(r) => r.value}
                    />

                    <Button
                        onPress={handleSalvar}
                        theme="active"
                    >
                        Salvar Alteração
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