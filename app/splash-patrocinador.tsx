import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image, Text, YStack } from 'tamagui';
import { Theme, useTheme } from 'tamagui'

const PatrocinadorSplash = () => {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
   const theme = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (next) {
        router.replace(next as string);
      } else if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [router, next]);

  return (
    <Theme name={theme.name} bg="$background">
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Image
          source={require('../assets/logo.png')}
          width={200}
          height={200}
          mb={20}
          resizeMode="contain"
        />
        <Text fontSize={24} fontWeight="bold">Patrocinador</Text>
      </YStack>
    </Theme>
  );
};

export default PatrocinadorSplash;
