import { Tabs, Text } from 'tamagui'

type Props = {
  activeTeam: 'mandante' | 'visitante'
  onChange: (team: 'mandante' | 'visitante') => void
  mandanteName: string
  visitanteName: string
}

export default function TeamTabs({ activeTeam, onChange, mandanteName, visitanteName }: Props) {
  return (
    <Tabs
      value={activeTeam}
      onValueChange={v => onChange(v as 'mandante' | 'visitante')}
      ml="$4"
      mr="$4"
    >
      <Tabs.List
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        mb="$2"
      >
        <Tabs.Tab value="mandante" flex={1}>
          <Text>{mandanteName}</Text>
        </Tabs.Tab>
        <Tabs.Tab value="visitante" flex={1}>
          <Text>{visitanteName}</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}