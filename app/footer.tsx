import { XStack, Text, Button, View } from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const bottomTabs = [
  { nome: 'Início', icone: 'home', ativo: false, rota: "modalidades" },
  { nome: 'Modalidades', icone: 'sports', ativo: true, rota: "index" },
  { nome: 'Resultados', icone: 'leaderboard', ativo: false, rota: "index" },
  { nome: 'Ajustes', icone: 'settings', ativo: false, rota: "login" },
]

export default function Footer() {
  return (
    <XStack
      bg="$color1"
      jc="space-evenly"
      ai="center"
      borderTopWidth={1}
      borderColor="$color4"
    >
      {bottomTabs.map((tab) => (
        <View key={tab.nome} f={1} ai="stretch">
          <Button
            size="$3"
            circular={false}
            onPress={() => {handleConfirmar(tab.rota)}}
            fd="column"
            ai="center"
            jc="center"
            h={'$6'}
          >
            <MaterialIcons
              name={tab.icone as any}
              size={24}
              color={tab.ativo ? 'white' : '#999'}
            />
            <Text fontSize={8} color={tab.ativo ? 'white' : '#999'}>
              {tab.nome}
            </Text>
          </Button>
        </View>
      ))}
    </XStack>
  )
}

const handleConfirmar = async (rota:string) => {
    const router = useRouter()
    router.replace(`/${rota}`)
}