import { useRouter } from 'expo-router'
import { YStack, Text, ListItem, Theme, useTheme } from 'tamagui'

const categorias = ['Sub 17', 'Sub 19', 'Open']

export default function CategoriasScreen() {
  const router = useRouter()
  const theme = useTheme()

  const handleSelecionar = (categoria: string) => {
    router.push(`/torneios/categoria/${categoria.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <Theme name={theme}>
      <YStack f={1} p="$4" space="$3" bg="$background">
        <Text fontSize={20} fontWeight="600" ta="center">
          Selecione a Categoria
        </Text>

        {categorias.map((categoria) => (
          <ListItem
            key={categoria}
            title={categoria}
            onPress={() => handleSelecionar(categoria)}
            borderBottomWidth={1}
            borderColor="$color4"
            pressTheme
          />
        ))}
      </YStack>
    </Theme>
  )
}
