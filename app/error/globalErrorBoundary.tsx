import React from 'react'
import { View, Text, Button } from 'react-native'
import { router } from 'expo-router'

export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log('Erro global capturado:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginBottom: 16 }}>
            Ocorreu um erro inesperado.
          </Text>

          <Button
            title="Voltar para login"
            onPress={() => router.replace('/login')}
          />
        </View>
      )
    }

    return this.props.children
  }
}