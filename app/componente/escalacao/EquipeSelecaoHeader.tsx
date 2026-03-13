import React from 'react'
import { XStack, Text, Checkbox } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'

interface EquipeSelecaoHeaderProps {
  todosConvocados: boolean
  onToggleTodosConvocados: () => void
  modo?: string // novo
}

export function EquipeSelecaoHeader({ todosConvocados, onToggleTodosConvocados, modo }: EquipeSelecaoHeaderProps) {
  const isModoAtrasado = modo === 'adicionar_atrasado';
  return (
    <>
      <XStack justifyContent="space-between" mb="$2" px="$2" ai="center" jc="space-between" py="$1" borderRadius={8}>
        <Text width={150} fontWeight="700"></Text>
        <Text width={50} fontWeight="700" style={{ textAlign: 'center' }}></Text>
        <Text width={15} fontWeight="700"></Text>
        <Checkbox
          checked={todosConvocados}
          onCheckedChange={onToggleTodosConvocados}
          backgroundColor="$backgroundStrong"
          borderColor="$gray8"
          disabled={isModoAtrasado}
        >
          <Checkbox.Indicator>
            <Check size={12} />
          </Checkbox.Indicator>
        </Checkbox>
      </XStack>
      <XStack justifyContent="space-between" mb="$2" px="$2" ai="center">
        <Text width={150} fontWeight="700">Nome</Text>
        <Text width={50} fontWeight="700" style={{ textAlign: 'center' }}>Nº</Text>
        <Text width={15} fontWeight="700">T</Text>
        <Text width={15} fontWeight="700" fontSize={12}>E</Text>
      </XStack>
    </>
  )
}
