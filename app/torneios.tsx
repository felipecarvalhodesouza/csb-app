import { useRouter } from 'expo-router'
import { YStack, Text, ListItem, Theme, useTheme } from 'tamagui'

const torneios = ['CBS 2024', 'CBS 2025', 'CBS 2026']

export default function TorneiosScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleSelecionar = (categoria: string) => {
    router.push(`/categorias?cat=${categoria}`)
  }

  return (
    <Theme name={theme}>
      <YStack f={1} p="$4" space="$3" bg="$background">
        <Text fontSize={20} fontWeight="600" ta="center">
          Selecione o Torneio
        </Text>

        {torneios.map((torneio) => (
          <ListItem
            key={torneio}
            title={torneio}
            onPress={() => handleSelecionar(torneio)}
            borderBottomWidth={1}
            borderColor="$color4"
            pressTheme
          />
        ))}
      </YStack>
    </Theme>
  )
}
