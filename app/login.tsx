import { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, XStack, Text, Input, Button, Image, Separator, Theme, useTheme } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFavoriteModality } from '../utils/preferences'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()
  const theme = useTheme()

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Preencha e-mail e senha.')
      return
    }
  
    try {
      // Simulação de autenticação
      const mockUser = {
        email,
        name: 'Usuário Exemplo',
      }
  
      await AsyncStorage.setItem('session_user', JSON.stringify(mockUser))
  
      const modalidade = await getFavoriteModality()
  
      if (modalidade) {
        router.replace(`/modalidades?mod=${modalidade}`)
      } else {
        router.replace('/modalidades')
      }
    } catch (err) {
      alert('Erro ao fazer login.')
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
        <Text fontSize={20} fontWeight="700" mb="$4">
          SportSync
        </Text>

        {/* Inputs */}
        <YStack w="100%" space="$3">
          <Text fontSize="$2" mb={-6}>E-mail</Text>
          <Input
            placeholder="Digite o seu e-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text fontSize="$2" mb={-6}>Senha</Text>
          <Input
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </YStack>

        {/* Entrar */}
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

// Ícone do Google (simples)
function GoogleIcon() {
  return (
    <Image
      source={{
        uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
      }}
      width={20}
      height={20}
      resizeMode="contain"
    />
  )
}