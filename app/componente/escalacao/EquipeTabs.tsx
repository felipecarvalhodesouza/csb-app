import React from 'react'
import { Tabs, Text } from 'tamagui'

interface EquipeTabsProps {
  tab: 'mandante' | 'visitante'
  setTab: (tab: 'mandante' | 'visitante') => void
  mandanteNome: string
  visitanteNome: string
}

export function EquipeTabs({ tab, setTab, mandanteNome, visitanteNome }: EquipeTabsProps) {
  return (
    <Tabs
      value={tab}
      onValueChange={v => setTab(v as 'mandante' | 'visitante')}
      orientation="horizontal"
      width={'100%'}
    >
      <Tabs.List width="100%" justifyContent="space-between" alignItems="center" mb="$2">
        <Tabs.Tab value="mandante" flex={1}>
          <Text>{mandanteNome}</Text>
        </Tabs.Tab>
        <Tabs.Tab value="visitante" flex={1}>
          <Text>{visitanteNome}</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
