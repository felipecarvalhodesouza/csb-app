import { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Input, Button, Image, Separator, Theme, useTheme } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFavoriteModality } from '../utils/preferences'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

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

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Preencha e-mail e senha.')
      return
    }

    if (emailError) {
      setErrorMessage('Corrija o e-mail antes de continuar.')
      return
    }

    setErrorMessage(null)

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro desconhecido ao fazer login.')
      }

      const data = await response.json()
      await AsyncStorage.setItem('session_user', JSON.stringify(data.token))

      const modalidade = await getFavoriteModality()
      if (modalidade) {
        router.replace(`/modalidades?mod=${modalidade}`)
      } else {
        router.replace('/modalidades')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao realizar login. Tente novamente.')
    }
  }

  return (
    <Theme name={theme.name}>
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

        {/* Inputs */}
        <YStack w="100%" space="$3">
          <Text fontSize="$2" mb={-6}>E-mail</Text>
          <Input
            placeholder="Digite o seu e-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            borderColor={emailError ? '$red10' : undefined}
          />
          {emailError && (
            <Text color="$red10" fontSize="$2">{emailError}</Text>
          )}

          <Text fontSize="$2" mb={-6}>Senha</Text>
          <Input
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </YStack>

        {/* Mensagem de erro geral */}
        {errorMessage && (
          <Text color="$red10" mt="$2" textAlign="center">
            {errorMessage}
          </Text>
        )}

        {/* Botão Entrar */}
        <Button mt="$4" w="100%" backgroundColor="black" color="white" onPress={handleLogin}>
          Entrar
        </Button>

        {/* Links */}
        <TouchableOpacity onPress={() => router.push('/esqueci-senha')}>
          <Text mt="$2" fontSize="$2" textAlign="center" color="$blue10">
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text mt="$1" fontSize="$2" textAlign="center">
            Não possui uma conta?{' '}
            <Text fontWeight="bold" color="$blue10">Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        {/* Google */}
        <Separator my="$4" w="100%" />
        <Button icon={<GoogleIcon />} variant="outlined" w="100%" borderWidth={1}>
          Entrar com Google
        </Button>
      </YStack>
    </Theme>
  )
}

function GoogleIcon() {
  return (
    <Image
      source={require('../assets/google.png')}
      width={20}
      height={20}
      resizeMode="contain"
    />
  )
}
