import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Input,
  Button,
  Theme,
  Image
} from 'tamagui'
import { TouchableOpacity } from 'react-native'
import PasswordStrengthBar from './componente/forca-senha'
import { API_BASE_URL } from '../utils/config'

export default function CadastroScreen() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [emailError, setEmailError] = useState<string | null>(null)
  const [senhaError, setSenhaError] = useState<string | null>(null)
  const [confirmarSenhaError, setConfirmarSenhaError] = useState<string | null>(null)
  const [senhaStrength, setSenhaStrength] = useState<'Fraca' | 'Média' | 'Forte' | null>(null)

  const [generalError, setGeneralError] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const evaluatePasswordStrength = (password: string): 'Fraca' | 'Média' | 'Forte' => {
    if (password.length < 6) return 'Fraca'
    if (password.length < 9) return 'Média'
    const strongPattern = /^(?=.*[A-Z])(?=.*\d).{9,}$/
    return strongPattern.test(password) ? 'Forte' : 'Média'
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value.length > 0 && !isValidEmail(value)) {
      setEmailError('E-mail inválido.')
    } else {
      setEmailError(null)
    }
  }

  const handleSenhaChange = (value: string) => {
    setSenha(value)
    setSenhaStrength(evaluatePasswordStrength(value))

    if (value.length === 0) {
      setSenhaError('Senha obrigatória.')
    } else {
      setSenhaError(null)
    }

    // Resetar confirmação de senha se a força baixar
    if (evaluatePasswordStrength(value) !== 'Forte') {
      setConfirmarSenha('')
      setConfirmarSenhaError(null)
    }
  }

  const handleConfirmarSenhaChange = (value: string) => {
    setConfirmarSenha(value)
    if (value !== senha) {
      setConfirmarSenhaError('As senhas não coincidem.')
    } else {
      setConfirmarSenhaError(null)
    }
  }

  const handleCadastrar = async () => {
    setGeneralError(null)
    let hasError = false

    if (!nome) {
      hasError = true
    }

    if (!email || emailError) {
      setEmailError('Digite um e-mail válido.')
      hasError = true
    }

    if (!senha) {
      setSenhaError('Senha obrigatória.')
      hasError = true
    }

    if (senhaStrength === 'Forte' && senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem.')
      hasError = true
    }

    if (hasError) return

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar conta.')
      }

      // Mostra o modal de sucesso
      setShowSuccessDialog(true)

      setTimeout(() => {
        setShowSuccessDialog(false)
        router.replace('/login')
      }, 3000)

    } catch (err: any) {
      setGeneralError(err.message || 'Erro inesperado ao criar conta.')
    }
  }

  return (
    <Theme>
      <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          width={100}
          height={100}
          resizeMode="contain"
          mb="$3"
        />

        <Text fontSize={20} fontWeight="700" mb="$4">Criar Conta</Text>

        <YStack w="100%" space="$3">
          {/* Nome */}
          <Text fontSize="$2" mb={-6}>Nome</Text>
          <Input placeholder="Digite seu nome" value={nome} onChangeText={setNome} />

          {/* E-mail */}
          <Text fontSize="$2" mb={-6}>E-mail</Text>
          <Input
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
            borderColor={emailError ? '$red10' : undefined}
          />
          {emailError && (
            <Text color="$red10" fontSize="$2">{emailError}</Text>
          )}

          {/* Senha */}
          <Text fontSize="$2" mb={-6}>Senha</Text>
          <Input
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={handleSenhaChange}
            borderColor={senhaError ? '$red10' : undefined}
          />
          {senhaError && (
            <Text color="$red10" fontSize="$2">{senhaError}</Text>
          )}

          {/* Barra de força da senha */}
          {senha.length > 0 && (
            <PasswordStrengthBar strength={senhaStrength} />
          )}

          {/* Confirmar senha */}
          {senhaStrength === 'Forte' && (
            <>
              <Text fontSize="$2" mb={12}>Confirmar senha</Text>
              <Input
                placeholder="Confirme sua senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={handleConfirmarSenhaChange}
                borderColor={confirmarSenhaError ? '$red10' : undefined}
              />
              {confirmarSenhaError && (
                <Text color="$red10" fontSize="$2">{confirmarSenhaError}</Text>
              )}
            </>
          )}
        </YStack>

        {/* Erro geral */}
        {generalError && (
          <Text color="$red10" mt="$2" textAlign="center">
            {generalError}
          </Text>
        )}

        {/* Botão Cadastrar */}
        <Button mt="$4" w="100%" backgroundColor="black" color="white" onPress={handleCadastrar}>
          Cadastrar
        </Button>

        {/* Link para login */}
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text mt="$2" fontSize="$2" textAlign="center">
            Já possui conta?{' '}
            <Text fontWeight="bold" color="$blue10">Entrar</Text>
          </Text>
        </TouchableOpacity>

        {/* Modal de Sucesso */}
        {showSuccessDialog && (
          <YStack
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="rgba(0,0,0,0.8)"
            zIndex={200}
            jc="center"
            ai="center"
          >
            <YStack
              width={280}
              bg="white"
              p="$5"
              br="$8"
              elevation="$6"
              zIndex={201}
              gap="$4"
              ai="center"
            >
              <Image
                source={require('../assets/success.png')}
                width={50}
                height={50}
                resizeMode="contain"
              />
              <Text fontWeight="700" fontSize="$4" textAlign="center" color="$green10">
                Conta criada com sucesso!
              </Text>
              <Text
                textAlign="center"
                fontSize="$2"
                color="gray"
              >
                Um e-mail de validação foi enviado. Redirecionando para o login...
              </Text>
            </YStack>
          </YStack>
        )}

      </YStack>
    </Theme>
  )
}
