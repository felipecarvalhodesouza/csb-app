import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

export default function ConfirmarEmailScreen() {
  const [status, setStatus] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get('status'));
    setMensagem(params.get('mensagem') || '');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://csb.app.br/imagens/logos/logo.png' }}
          style={styles.logo}
        />
        <Text style={styles.appNome}>Campeonato Santista</Text>
        <Text style={styles.appSubtitle}>Confirmação de cadastro</Text>
        <View style={styles.divider} />

        {status === null && (
          <>
            <ActivityIndicator size="large" color="#2f80ed" style={{ marginBottom: 16 }} />
            <Text style={styles.titulo}>Aguarde...</Text>
            <Text style={styles.texto}>Verificando sua confirmação.</Text>
          </>
        )}

        {status === 'sucesso' && (
          <>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.titulo}>E-mail confirmado!</Text>
            <Text style={styles.texto}>
              Sua conta está ativa no Campeonato Santista. Já pode fazer login no app.
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL('csb://login')}>
              <Text style={styles.btnTexto}>Fazer login</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'erro' && (
          <>
            <Text style={styles.icon}>❌</Text>
            <Text style={styles.titulo}>Link inválido ou expirado</Text>
            <Text style={styles.texto}>
              {mensagem || 'Este link não é mais válido. Faça login e solicite um novo e-mail de confirmação.'}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#333',
    width: '100%',
    maxWidth: 400,       // centraliza em telas grandes
    padding: 32,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  appNome: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  appSubtitle: { color: '#888', fontSize: 12, marginBottom: 0 },
  divider: { width: '100%', height: 0.5, backgroundColor: '#2a2a2a', marginVertical: 24 },
  icon: { fontSize: 40, marginBottom: 12 },
  titulo: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  texto: { color: '#aaa', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#2f80ed', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 },
  btnTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
});