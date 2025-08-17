import React, { useState } from 'react'
import { YStack, Input, Text, Button, Label, Separator, ScrollView, Theme, useTheme } from 'tamagui'
import Header from '../header'
import Footer from '../footer'
import DialogError from '../componente/dialog-error'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { API_BASE_URL } from '../../utils/config'

export default function IncluirLocalScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleCloseDialog = () => {
    setShowErrorDialog(false)
    setErrorMessage(null)
  }

  const buscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErrorMessage('CEP não encontrado.')
        setShowErrorDialog(true)
        return
      }

      setLogradouro(data.logradouro || '')
      setBairro(data.bairro || '')
      setCidade(data.localidade || '')
      setEstado(data.uf || '')
    } catch (error) {
      setErrorMessage('Erro ao buscar endereço.')
      setShowErrorDialog(true)
    }
  }

  const handleSalvar = async () => {
    if (!nome || !cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      setErrorMessage('Preencha todos os campos obrigatórios.')
      setShowErrorDialog(true)
      return
    }

    const user = await AsyncStorage.getItem('session_user')
    const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
    }


    const local = { nome, cep, logradouro, numero, complemento, bairro, cidade, estado }
    const response = await fetch(`${API_BASE_URL}/locais`, {
        headers,
        method: 'POST',
        body: JSON.stringify(local),
    })

      if (response.ok) {
        setErrorMessage('Local salvo com sucesso!')
        setShowErrorDialog(true)
        setTimeout(() => {
        router.replace('/admin')
      }, 2000)
      } else {
        const responseError = await response.json();
        setErrorMessage(responseError.message || 'Erro ao criar o local.')
        setShowErrorDialog(true)
      }
  }

  const isFormValid = !!nome && !!cep && !!logradouro && !!numero && !!bairro && !!cidade && !!estado

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
        <Header title="Incluir Local" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          <YStack p="$4" space="$4">
            <YStack space="$1">
              <Label>Nome do Local</Label>
              <Input value={nome} onChangeText={setNome} placeholder="Ginásio Municipal" />
            </YStack>

            <YStack space="$1">
              <Label>CEP</Label>
              <Input
                value={cep}
                onChangeText={setCep}
                onBlur={buscarEndereco}
                placeholder="00000-000"
                keyboardType="numeric"
              />
            </YStack>

            <YStack space="$1">
              <Label>Logradouro</Label>
              <Input value={logradouro} onChangeText={setLogradouro} placeholder="Rua / Avenida" />
            </YStack>

            <YStack space="$1">
              <Label>Número</Label>
              <Input value={numero} onChangeText={setNumero} placeholder="123" keyboardType="numeric" />
            </YStack>

            <YStack space="$1">
              <Label>Complemento</Label>
              <Input value={complemento} onChangeText={setComplemento} placeholder="Apartamento, bloco..." />
            </YStack>

            <YStack space="$1">
              <Label>Bairro</Label>
              <Input value={bairro} onChangeText={setBairro} placeholder="Centro, Bairro X..." />
            </YStack>

            <YStack space="$1">
              <Label>Cidade</Label>
              <Input value={cidade} onChangeText={setCidade} placeholder="São Paulo" />
            </YStack>

            <YStack space="$1">
              <Label>Estado</Label>
              <Input value={estado} onChangeText={setEstado} placeholder="SP" maxLength={2} />
            </YStack>

            <Separator my="$3" />

            <Button
              backgroundColor={!isFormValid ? 'grey' : 'black'}
              color="white"
              onPress={handleSalvar}
              disabled={!isFormValid}
            >
              Salvar Local
            </Button>
          </YStack>
        </ScrollView>
        <DialogError open={showErrorDialog} onClose={handleCloseDialog} message={errorMessage} />
        <Footer />
      </YStack>
    </Theme>
  )
}
