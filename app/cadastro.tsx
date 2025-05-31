import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Input,
  Button,
  Theme,
  useTheme,
  Image
} from 'tamagui'
import { TouchableOpacity } from 'react-native'

export default function CadastroScreen() {
  const router = useRouter()
  const theme = useTheme()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const handleCadastrar = () => {
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem')
      return
    }

    // Aqui você pode integrar com Firebase/Auth API etc.
    alert('Conta criada com sucesso!')
    router.replace('/login')
  }

  return (
    <Theme name={theme}>
      <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
        {/* Logo opcional */}
        <Image
          source={require('../assets/logo.png')}
          width={100}
          height={100}
          resizeMode="contain"
          mb="$3"
        />

        <Text fontSize={20} fontWeight="700" mb="$4">
          Criar Conta
        </Text>

        <YStack w="100%" space="$3">
          <Text fontSize="$2" mb={-6}>Nome</Text>
          <Input placeholder="Digite seu nome" value={nome} onChangeText={setNome} />

          <Text fontSize="$2" mb={-6}>E-mail</Text>
          <Input
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text fontSize="$2" mb={-6}>Senha</Text>
          <Input
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text fontSize="$2" mb={-6}>Confirmar senha</Text>
          <Input
            placeholder="Confirme sua senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </YStack>

        <Button mt="$4" w="100%" backgroundColor="black" color="white" onPress={handleCadastrar}>
          Cadastrar
        </Button>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text mt="$2" fontSize="$2" textAlign="center">
            Já possui conta?{' '}
            <Text fontWeight="bold" color="$blue10">Entrar</Text>
          </Text>
        </TouchableOpacity>
      </YStack>
    </Theme>
  )
}
