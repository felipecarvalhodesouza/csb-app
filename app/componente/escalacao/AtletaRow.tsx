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
  onToggleCapitao: (id: number) => void
  modo?: string // novo
  capitaoSelecionado?: Atleta // novo - atleta que é capitão
}

export function AtletaRow({
  atleta,
  titularesSelecionados,
  jogadoresSelecionados,
  maxTitulares,
  maxJogadores,
  onToggleTitular,
  onToggleConvocado,
  onToggleCapitao,
  onSetNumero,
  modo, // novo
  capitaoSelecionado // novo
}: AtletaRowProps) {
  // Regra: se modo atrasado e atleta já está na partida, desabilita tudo
  const isModoAtrasado = modo === 'adicionar_atrasado';
  // Considera persistido apenas quem já estava escalado antes (exemplo: idPersistido)
  // Aqui, atletaEscalado deve ser true só para quem já estava na partida
  const atletaPersistido = isModoAtrasado && atleta.persistido; // Supondo que exista a flag persistido
  const disableAll = atletaPersistido;

  // Para o botão de convocado: só desabilita se persistido, senão permite desmarcar
  const disableConvocado = atletaPersistido || (!atleta.convocado && jogadoresSelecionados >= maxJogadores);

  // Capitão: desabilita se persistido, ou se outro atleta é capitão (e este não é), ou se não está convocado
  const disableCapitao = atletaPersistido || (capitaoSelecionado && capitaoSelecionado.id !== atleta.id) || !atleta.convocado;

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
        value={atleta.numeroCamisa || ''}
        keyboardType="numeric"
        onChangeText={num => {
          const onlyNumbers = num.replace(/[^0-9]/g, '');
          onSetNumero(atleta.id, onlyNumbers);
        }}
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
      <Checkbox ai='center'
        checked={!!atleta.capitao}
        onCheckedChange={() => onToggleCapitao(atleta.id)}
        disabled={disableCapitao}
        backgroundColor="$backgroundStrong"
        borderColor="$gray8"
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>
      <Checkbox ai='center'
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
