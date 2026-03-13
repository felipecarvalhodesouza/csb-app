import React from 'react'
import { Button } from 'tamagui'

interface IniciarJogoButtonProps {
  onPress: () => void
  disabled: boolean
}

export const IniciarJogoButton = ({ onPress, disabled }: IniciarJogoButtonProps) => {
  return (
    <Button theme="active" onPress={onPress} disabled={disabled}>
      Iniciar Jogo
    </Button>
  )
}
