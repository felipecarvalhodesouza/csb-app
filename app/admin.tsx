import { useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
  ScrollView,
} from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Header from './header'
import Footer from './footer'

const opcoesAdmin = [
  { nome: 'Inclusão de Torneio', icone: 'trophy-outline', rota: '/admin/incluir-torneio', disable: false },
  { nome: 'Inclusão de Categoria', icone: 'medal', rota: '/admin/incluir-categoria', disable: false },
  { nome: 'Inclusão de Equipe', icone: 'account-group-outline', rota: '/admin/incluir-equipe', disable: false },
  { nome: 'Vincular Equipe no Torneio', icone: 'account-group-outline', rota: '/admin/vincular-equipe', disable: false },
  { nome: 'Inclusão de Atleta', icone: 'account-plus-outline', rota: '/admin/incluir-atleta', disable: false },
  { nome: 'Vincular Atleta à Categoria', icone: 'account-plus-outline', rota: '/admin/vincular-atleta', disable: false },
  { nome: 'Transferir Atleta', icone: 'account-plus-outline', rota: '/admin/transferir-atleta', disable: true },
  { nome: 'Inclusão de Local', icone: 'account-plus-outline', rota: '/admin/incluir-local', disable: false },
  { nome: 'Inclusão de Jogos', icone: 'account-plus-outline', rota: '/admin/incluir-jogo', disable: false },
  { nome: 'Alteração de Permissões', icone: 'shield-account-outline', rota: '/admin/alterar-permissoes', disable: true },
  { nome: 'Inclusão de Árbitro', icone: 'account-plus-outline', rota: '/admin/incluir-arbitro', disable: false },
]

export default function AdminScreen() {
  const router = useRouter()

  const handleSelecionar = (rota: string, disable: boolean) => {
    if (disable) return
    router.push(rota)
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
        <Header title="Administração" />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          {opcoesAdmin.map((opcao) => (
            <XStack
              key={opcao.nome}
              bg={opcao.disable ? "$gray5" : "$color2"} 
              p="$4"
              br="$4"
              ai="center"
              onPress={() => handleSelecionar(opcao.rota, opcao.disable)}
              hoverStyle={opcao.disable ? {} : { bg: '$color3' }} 
              pressStyle={opcao.disable ? {} : { bg: '$color4' }} 
            >
              <View
                bg={opcao.disable ? "$gray7" : "$blue10"}
                p="$3"
                br="$10"
                mr="$3"
                ai="center"
                jc="center"
              >
                <MaterialCommunityIcons name={opcao.icone as any} size={24} color="white" />
              </View>

              <Text fontSize={16} color={opcao.disable ? "$gray8" : "white"}>
                {opcao.nome}
              </Text>

              <View f={1} />
              <MaterialCommunityIcons name="chevron-right" size={24} color={opcao.disable ? "$gray6" : "#ccc"} />
            </XStack>
          ))}
        </ScrollView>

        <Footer />
      </YStack>
    </Theme>
  )
}
