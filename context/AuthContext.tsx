import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// IMPORTANTE: Adicionar aqui o seu Web Client ID do console do Google/Firebase
GoogleSignin.configure({
  webClientId: '287740732537-dspcrfrmiv65qa480g29qv7i6r3a4rfq.apps.googleusercontent.com',
});

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Tratativa para erro na WEB: o @react-native-firebase não roda em navegadores, apenas Android/iOS nativos.
    if (Platform.OS === 'web') {
      console.warn("⚠️ Firebase Nativo foi ignorado na Web para não quebrar o visual. Teste o login num emulador Android/iOS via 'npx expo run:android'.");
      setLoading(false);
      return;
    }

    const subscriber = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return subscriber;
  }, []);

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      console.warn("⚠️ Simulando login na web. No celular, a tela do Google abrirá normalmente.");
      setUser({ uid: 'mock-123', displayName: 'Bruno (Web)' } as FirebaseAuthTypes.User);
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Erro no Google Sign-In:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  // Função core do "Guest-First": Se não tiver logado, sobe o modal de login.
  const requireAuth = (action: () => void) => {
    // DESATIVADO TEMPORARIAMENTE PARA AGILIZAR O DESENVOLVIMENTO DAS TELAS
    action();
    return;

    if (!user) {
      router.push('/login');
    } else {
      action();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
