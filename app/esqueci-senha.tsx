import { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Theme, useTheme, Image } from 'tamagui'
import { TouchableOpacity } from 'react-native'

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const handleEnviarLink = async () => {
    if (!email.includes('@')) {
      alert('Digite um e-mail válido.')
      return
    }

    try {
      // 🔐 Aqui você pode integrar com Firebase Auth:
      // await sendPasswordResetEmail(auth, email)
      setEnviado(true)
    } catch (err) {
      alert('Erro ao enviar e-mail. Verifique e tente novamente.')
    }
  }

  return (
    <Theme name={theme}>
      <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          width={100}
          height={100}
          resizeMode="contain"
          mb="$3"
        />

        <Text fontSize={20} fontWeight="700" mb="$4">
          Recuperar Acesso
        </Text>

        {/* Conteúdo principal */}
        {!enviado ? (
          <YStack w="100%" space="$3">
            <Text fontSize="$2" mb={-6}>E-mail</Text>
            <Input
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              value={email}
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            <Button mt="$2" w="100%" backgroundColor="black" color="white" onPress={handleEnviarLink}>
              Recuperar
            </Button>
          </YStack>
        ) : (
          <Text ta="center" mt="$4" px="$2">
            Um link foi enviado para o e-mail informado. Verifique sua caixa de entrada ou spam.
          </Text>
        )}

        {/* Voltar */}
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text mt="$4" fontSize="$2" textAlign="center" color="$blue10">
            Voltar
          </Text>
        </TouchableOpacity>
      </YStack>
    </Theme>
  )
}
