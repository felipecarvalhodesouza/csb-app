import {
  YStack,
  XStack,
  Text,
  ScrollView,
  Card,
  Separator,
  Theme
} from 'tamagui'
import { Pencil } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { API_BASE_URL } from '../../utils/config'
import { apiFetch } from '../utils/api'
import { useCallback, useState } from 'react'
import Header from '../header'
import Footer from '../footer'
import Dialog from '../componente/dialog-error'
import Usuario from '../domain/usuario'
import { useFocusEffect } from '@react-navigation/native'


export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [error, setError] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)


    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)
        setError(null)
    }

    const loadUsuarios = async () => {
        try {
            const usuarios = await apiFetch<Usuario[]>(`${API_BASE_URL}/usuarios`)
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
  
  
    const agrupados = usuarios.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = []
    acc[user.role].push(user)
    return acc
  }, {} as Record<string, Usuario[]>)

  return (
      <Theme>
          <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
              <Header title="Gestão de Usuários" />

              <ScrollView>
                  <YStack space="$4" padding="$4">
                      {Object.entries(agrupados).map(([role, lista]) => (
                          <YStack key={role} space="$2">
                              <Text
                                  fontSize="$6"
                                  fontWeight="bold"
                                  color="$color"
                              >
                                  {role}
                              </Text>

                              <Separator />

                              {lista.map((user) => (
                                  <Card
                                      key={user.id}
                                      bordered
                                      elevate
                                      backgroundColor="$backgroundStrong"
                                      padding="$3"
                                  >
                                      <XStack justifyContent="space-between" alignItems="center">
                                          <YStack>
                                              <Text fontWeight="600">{user.nome}</Text>
                                              <Text color="$gray10" fontSize="$3">
                                                  {user.email}
                                              </Text>
                                          </YStack>

                                          <Pencil
                                              size={20}
                                              onPress={() =>
                                               router.push({
                                                    pathname: '/admin/editar-permissoes',
                                                    params: { id: user.id }
                                                })
                                              }
                                          />
                                      </XStack>
                                  </Card>
                              ))}
                          </YStack>
                      ))}
                  </YStack>
              </ScrollView>
            <Footer />
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                message={message}
                type={error ? 'error' : 'success'}
            />
          </YStack>
      </Theme>
  )
}