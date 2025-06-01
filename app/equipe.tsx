import { useLocalSearchParams } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  Image,
  Theme,
  useTheme,
  ScrollView,
} from 'tamagui'
import { useRouter } from 'expo-router'
import Footer from './footer'
import Header from './header'

const mockDados = {
  nome: 'Chicago Bulls',
  categorias: [
    {
      nome: 'Sub 17',
      jogos: [
        {
          id: '1',
          status: 'live', // 'live', 'final', 'future'
          adversario: 'Dallas Mavericks',
          adversarioLogo: 'https://via.placeholder.com/40x40?text=P',
          equipePontuacao: 28,
          adversarioPontuacao: 21,
          transmissao: ['League Pass', 'Prime Video'],
        },
        {
          id: '2',
          status: 'future',
          horario: '22:30',
          adversario: 'OKC',
          adversarioLogo: 'https://via.placeholder.com/40x40?text=T',
          transmissao: ['League Pass', 'ESPN'],
        },
        {
          id: '3',
          status: 'final',
          resultado: '94 - 93',
          adversario: 'Internacional de Regatas',
          adversarioLogo: 'https://via.placeholder.com/40x40?text=L',
        },
      ],
    },
    {
      nome: 'Open',
      jogos: [
        {
          id: '4',
          status: 'final',
          resultado: '85 - 80',
          adversario: 'Boston Celtics',
          adversarioLogo: 'https://via.placeholder.com/40x40?text=D',
        },
      ],
    },
  ],
}

export default function HomeEquipe() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()
  const equipe = mockDados // substituir futuramente com fetch por id

  const jogosAoVivo = equipe.categorias.flatMap((cat) =>
    cat.jogos.filter((j) => j.status === 'live').map((j) => ({ ...j, categoria: cat.nome }))
  )

  return (
    <Theme name={theme}>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
        <Header title={equipe.nome} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          {/* Ao Vivo */}
          {jogosAoVivo.length > 0 && (
            <YStack mb="$4" space>
              <Text fontSize={16} fontWeight="600" color="$red10">
                AO VIVO
              </Text>
              {jogosAoVivo.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} destaque />
              ))}
            </YStack>
          )}
          

          {/* Restante por categoria */}
          {equipe.categorias.map((cat) => {
            const jogos = cat.jogos.filter((j) => j.status !== 'live')
            if (jogos.length === 0) return null

            return (
              <YStack key={cat.nome} space="$2" mt="$3">
                <Text fontWeight="600" fontSize={16} color="$gray10">
                  {cat.nome}
                </Text>
                {jogos.map((jogo) => (
                  <GameCard key={jogo.id} jogo={jogo} />
                ))}
              </YStack>
            )
          })}
          </ScrollView>
        <Footer/>
      </YStack>
    </Theme>
  )
}

function GameCard({ jogo, destaque }: { jogo: any; destaque?: boolean }) {
  const bg = destaque ? '$gray5Dark' : '$gray3'
  const router = useRouter()

  const handlePress = () => {
    router.push(`/jogo?id=${jogo.id}`)  // Redireciona para a tela de detalhes com o ID do jogo
  }

  return (
    <YStack bg={bg} br="$3" p="$3" space="$2" onPress={handlePress}>
      <Text fontSize={12} fontWeight="600">
        {jogo.categoria ? `Categoria ${jogo.categoria}` : 'Jogo'}
      </Text>

      <XStack jc="space-between" ai="center">
        <XStack ai="center" space="$2">
          <Image source={{ uri: 'https://via.placeholder.com/40x40?text=L' }} width={40} height={40} />
          <Text fontWeight="600">Chicago Bulls</Text>
        </XStack>

        <Text fontSize={20} fontWeight="700">
          {jogo.status === 'live'
            ? jogo.equipePontuacao + ' - ' + jogo.adversarioPontuacao
            : jogo.status === 'final'
            ? jogo.resultado
            : jogo.horario}
        </Text>

        <XStack ai="center" space="$2">
          <Text
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
            maxWidth={100}
          >
            {jogo.adversario}
          </Text>
          <Image source={{ uri: jogo.adversarioLogo }} width={40} height={40} />
        </XStack>
      </XStack>

      {jogo.transmissao && (
        <XStack ai="center" space="$2">
          {jogo.transmissao.map((t: string, idx: number) => (
            <Text key={idx} fontSize={11} color="$gray10">
              {t}
              {idx < jogo.transmissao.length - 1 ? ' · ' : ''}
            </Text>
          ))}
        </XStack>
      )}
    </YStack>
  )
}
