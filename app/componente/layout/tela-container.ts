import { styled, YStack, isWeb } from 'tamagui'

export const TelaContainer = styled(YStack, {
  f: 1,
  bg: '$background',
  pt: isWeb ? '$3' : '$6',
  pb: isWeb ? '$3' : '$9',
  jc: 'space-between',
})