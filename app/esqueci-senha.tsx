import { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Image, Separator, Theme, useTheme } from 'tamagui'
import { TouchableOpacity } from 'react-native'

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const theme = useTheme()

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value.length > 0 && !isValidEmail(value)) {
      setEmailError('E-mail inválido.')
    } else {
      setEmailError(null)
    }
  }

  const handleEnviarLink = async () => {
    if (!email) {
      setErrorMessage('Preencha o e-mail.')
      return
    }

    if (emailError) {
      setErrorMessage('Corrija o e-mail antes de continuar.')
      return
    }

    setErrorMessage(null)

    try {

      await new Promise((resolve) => setTimeout(resolve, 1000)) 

      setSuccessMessage('Um link de recuperação foi enviado para o e-mail informado.')
    } catch (err: any) {
      setErrorMessage('Erro ao enviar e-mail. Verifique o endereço e tente novamente.')
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

        {/* Título */}
        <Text fontSize={20} fontWeight="700" mb="$4">SportSync</Text>

        {/* Conteúdo principal */}
        {!successMessage ? (
          <>
            <YStack w="100%" space="$3">
              <Text fontSize="$2" mb={-6}>E-mail</Text>
              <Input
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                value={email}
                autoCapitalize="none"
                onChangeText={handleEmailChange}
                borderColor={emailError ? '$red10' : undefined}
              />
              {emailError && (
                <Text color="$red10" fontSize="$2">{emailError}</Text>
              )}
            </YStack>

            {/* Mensagem de erro geral */}
            {errorMessage && (
              <Text color="$red10" mt="$2" textAlign="center">
                {errorMessage}
              </Text>
            )}

            {/* Botão enviar */}
            <Button mt="$4" w="100%" backgroundColor="black" color="white" onPress={handleEnviarLink}>
              Recuperar
            </Button>
          </>
        ) : (
          <Text ta="center" mt="$4" px="$2">
            {successMessage} Verifique sua caixa de entrada ou spam.
          </Text>
        )}

        {/* Voltar */}
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text mt="$4" fontSize="$2" textAlign="center" color="$blue10">
            Voltar para o Login
          </Text>
        </TouchableOpacity>

        {/* Separador visual opcional */}
        <Separator my="$4" w="100%" />
      </YStack>
    </Theme>
  )
}
