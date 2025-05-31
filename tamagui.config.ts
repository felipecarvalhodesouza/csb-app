import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'

const tamaguiConfig = createTamagui(config)

type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
