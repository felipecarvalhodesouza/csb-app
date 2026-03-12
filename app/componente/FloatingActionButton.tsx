import React, { useState, ReactNode } from 'react';
import { View, Button, YStack, XStack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Usuario from '../domain/usuario';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Action {
  icon: ReactNode;
  label?: string;
  onPress: () => void;
}

interface FloatingActionButtonProps {
  actions: Action[];
  adminOnly?: boolean;
  position?: {
    bottom?: number;
    right?: number;
    left?: number;
  };
}

export default function FloatingActionButton({ actions, adminOnly = false, position = { bottom: 30, right: 24 } }: FloatingActionButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    async function checkAdmin() {
      const user = await AsyncStorage.getItem('session_user');
      if (user) {
        const usuario: Usuario = JSON.parse(user);
        setIsAdmin(usuario.role === 'ADMIN');
      }
    }
    checkAdmin();
  }, []);

  if (adminOnly && !isAdmin) return null;

  return (
    <View
      position="absolute"
      bottom={position.bottom}
      right={position.right}
      left={position.left}
      zIndex={100}
      ai="flex-end"
    >
      <Button
        circular
        size="$4"
        bg="$gray12"
        icon={actions[0].icon}
        onPress={actions[0].onPress}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
      />
    </View>
  );
}
