import React from 'react'
import { XStack, Text, Input, Checkbox } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import { Atleta } from '../../domain/atleta'

interface AtletaRowProps {
  atleta: Atleta
  titularesSelecionados: number
  jogadoresSelecionados: number
  maxTitulares: number
  maxJogadores: number
  onToggleTitular: (id: number) => void
  onToggleConvocado: (id: number) => void
  onSetNumero: (id: number, numero: string) => void
}

export function AtletaRow({
  atleta,
  titularesSelecionados,
  jogadoresSelecionados,
  maxTitulares,
  maxJogadores,
  onToggleTitular,
  onToggleConvocado,
  onSetNumero,
}: AtletaRowProps) {
  return (
    <XStack
      key={atleta.id}
      ai="center"
      jc="space-between"
      mb="$1"
      px="$2"
      py="$1"
      borderRadius={8}
      backgroundColor={atleta.titular ? "$green5" : "transparent"}
    >
      <Text width={150} numberOfLines={1} ellipsizeMode="tail">
        {atleta.nome}
      </Text>
      <Input
        width={50}
        placeholder="Nº"
        value={atleta.numeroCamisa || atleta.numero || ''}
        keyboardType="numeric"
        onChangeText={num => onSetNumero(atleta.id, num)}
        disabled={!atleta.convocado}
        backgroundColor="$backgroundStrong"
        color="$white"
        borderColor="$gray8"
        placeholderTextColor="#888"
        maxLength={2}
        style={{ textAlign: 'center' }}
      />
      <Checkbox ai='center'
        checked={!!atleta.titular}
        onCheckedChange={() => onToggleTitular(atleta.id)}
        disabled={(!atleta.titular && titularesSelecionados >= maxTitulares) || !atleta.convocado}
        backgroundColor="$backgroundStrong"
        borderColor="$gray8"
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Checkbox
        checked={!!atleta.convocado}
        onCheckedChange={() => onToggleConvocado(atleta.id)}
        disabled={!atleta.convocado && jogadoresSelecionados >= maxJogadores}
        backgroundColor="$backgroundStrong"
        borderColor="$gray8"
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
    </XStack>
  )
}
