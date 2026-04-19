import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      if (router.canGoBack()) {
        router.back(); // Volta pra ação que o usuário queria fazer
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.log('Login cancelado ou falho:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Syntrix <Text style={styles.highlight}>Fit</Text></Text>
        <Text style={styles.subtitle}>Sua jornada de alta performance começa aqui.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.loginText}>Acesse para continuar</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <ActivityIndicator color="#0e0e0e" />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="#0e0e0e" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Voltar para o App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    fontStyle: 'italic',
  },
  highlight: {
    color: '#CCFF00',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1919',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFF00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#0e0e0e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
});
