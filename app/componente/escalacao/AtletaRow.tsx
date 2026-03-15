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
  modo?: string // novo
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
  modo // novo
}: AtletaRowProps) {
  // Regra: se modo atrasado e atleta já está na partida, desabilita tudo
  const isModoAtrasado = modo === 'adicionar_atrasado';
  // Considera persistido apenas quem já estava escalado antes (exemplo: idPersistido)
  // Aqui, atletaEscalado deve ser true só para quem já estava na partida
  const atletaPersistido = isModoAtrasado && atleta.persistido; // Supondo que exista a flag persistido
  const disableAll = atletaPersistido;

  // Para o botão de convocado: só desabilita se persistido, senão permite desmarcar
  const disableConvocado = atletaPersistido || (!atleta.convocado && jogadoresSelecionados >= maxJogadores);

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
        disabled={disableAll || (!atleta.titular && titularesSelecionados >= maxTitulares) || !atleta.convocado}
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
        disabled={disableConvocado}
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
