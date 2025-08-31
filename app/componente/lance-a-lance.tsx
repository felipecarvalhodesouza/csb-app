import { YStack, XStack, Text } from 'tamagui'
import Evento from '../domain/evento'

type Props = {
  eventos: Evento[]
  mandanteId: number
}

export default function LanceALance({ eventos, mandanteId }: Props) {
  if (!eventos || eventos.length === 0) {
    return (
      <YStack ai="center" mt="$4" mb="$4" width="100%">
        <Text color="$gray10">Nenhum evento registrado</Text>
      </YStack>
    )
  }

  return (
    <YStack ai="center" mt="$4" mb="$4" width="100%">
      {eventos
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .map(ev => {
          const isEventoGenerico = !ev.equipe
          const isMandante = ev.equipe && ev.equipe.id === mandanteId
          return (
            <XStack
              key={ev.id || ev.timestamp}
              width="100%"
              jc={isMandante ? "flex-start" : "flex-end"}
              mb="$2"
            >
              {!isEventoGenerico && 
              <YStack
                bg={isMandante ? "$yellow2" : "$blue2"}
                p="$3"
                borderRadius={12}
                elevation={2}
                maxWidth="80%"
                minWidth={180}
                ai={isMandante ? "flex-start" : "flex-end"}
                borderWidth={1}
                borderColor={isMandante ? "$yellow6" : "$blue6"}
                gap="$2"
              >
                <Text
                  fontWeight="700"
                  fontSize={16}
                  color={isMandante ? "$yellow10" : "$blue10"}
                  textAlign={isMandante ? "left" : "right"}
                >
                  {ev.tipo}
                </Text>
                <Text
                  fontSize={15}
                  color="$gray12"
                  fontWeight="500"
                  textAlign={isMandante ? "left" : "right"}
                >
                  {ev.descricao}
                </Text>
                <Text
                  fontSize={12}
                  color="$gray8"
                  fontWeight="400"
                  textAlign={isMandante ? "left" : "right"}
                >

                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </YStack>
            }
            {isEventoGenerico && 
            <YStack
              width="100%"
              ai="center"
              jc="center"
              my="$2"
            >
              <Text
                fontWeight="500"
                fontSize={16}
                color="$gray12"
                textAlign="center"
              >
                {ev.descricao}
              </Text>
              <Text
                fontSize={12}
                color="$gray8"
                fontWeight="400"
                textAlign="center"
              >
                {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </YStack>
            }

            </XStack>
          )
        })}
    </YStack>
  )
}