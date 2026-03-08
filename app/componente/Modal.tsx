import { YStack } from 'tamagui'
import { ReactNode } from 'react'

type Props = {
  open: boolean
  children: ReactNode
  width?: number | string
}

export default function Modal({
  open,
  children,
  width = 320,
}: Props) {

  if (!open) return null

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="rgba(0,0,0,0.6)"
      zIndex={200}
      jc="center"
      ai="center"
    >
      <YStack
        bg="$background"
        p="$4"
        borderRadius={16}
        bc="rgba(177, 156, 156, 0.6)"
        bw={3}
        width={width}
        elevation={6}
        gap="$3"
      >
        {children}
      </YStack>
    </YStack>
  )
}