import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// CHAVE DE API (Inserida via painel do usuário)
const API_KEY = "AIzaSyBJzYHNjTPMpIgsqg4riB7ReeXoavZYCxs";
const genAI = new GoogleGenerativeAI(API_KEY);

// SUPER PROMPT definido pelo Administrador
const SYSTEM_PROMPT = `
Atue como um agente de inteligência artificial especializado em musculação, treinamento físico e orientação básica em nutrição, projetado para funcionar dentro de um aplicativo fitness.
Seu objetivo é ajudar usuários a melhorar seu físico com treinos e orientações alimentares seguras, práticas e baseadas em conhecimento confiável.

🧠 1. ESPECIALIDADES DO AGENT
Você domina:
- Treinamento de musculação (hipertrofia, emagrecimento, definição, força)
- Estruturação de treinos personalizados
- Progressão de carga e periodização
- Fundamentos básicos de nutrição esportiva

🏋️ 2. FUNÇÃO PRINCIPAL (TREINOS)
Você deve:
- Criar treinos personalizados com base em Objetivo, Nível, Tempo, Frequência e Equipamentos.
- Gerar treinos completos contendo: Exercícios, Séries, Repetições, Tempo de descanso.

🥗 3. FUNÇÃO SECUNDÁRIA (NUTRIÇÃO BÁSICA)
Você pode responder apenas orientações gerais como o que comer antes e depois do treino e hidratação.
❗ NÃO pode: Prescrever dietas específicas, Calcular dietas detalhadas, Indicar suplementos personalizados.

🚫 4. LIMITES E REDIRECIONAMENTO
Sempre que a pergunta envolver dietas específicas ou de restrições, responda exatamente:
"Para esse tipo de orientação mais específica, o ideal é falar com um nutricionista. Vá até a aba 'Nutrição' no app para receber um acompanhamento mais personalizado."

💬 6. ESTILO DE RESPOSTA
Linguagem clara, direta e motivadora. Sem termos excessivamente técnicos. Evitar respostas muito longas sem necessidade.
`;

// Inicializando o modelo com o Prompt de Regras
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

export default function CoachScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Guardando a sessão de chat contínua na memória do componente para manter o contexto
  const chatSession = useRef<any>(null);

  useEffect(() => {
    // Inicia a sessão de bate-papo assim que a tela abre
    chatSession.current = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    // Enviar mensagem de boas-vindas do Coach
    setMessages([
      {
        id: 'welcome_1',
        text: 'Olá! Sou o seu Coach IA dedicado. Como posso ajudar com o seu treino hoje? Quer focar em emagrecimento ou hipertrofia?',
        isUser: false,
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText('');
    Keyboard.dismiss();

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const result = await chatSession.current.sendMessage(userText);
      const responseText = result.response.text();

      const newBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (error: any) {
      console.error("Erro na comunicação com o Gemini:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Erro da API: ' + (error.message || JSON.stringify(error)),
        isUser: false,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
      {!item.isUser && (
        <View style={styles.botIconContainer}>
          <MaterialCommunityIcons name="robot-outline" size={16} color="#0e0e0e" />
        </View>
      )}
      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#CCFF00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coach IA</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#CCFF00" />
          <Text style={styles.typingText}>Treinador analisando seu perfil...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Monte um treino focado em pernas hoje..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <MaterialCommunityIcons name="send" size={24} color="#0e0e0e" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1919',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#CCFF00',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1919',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
  },
  botIconContainer: {
    marginRight: 8,
    marginTop: 2,
    backgroundColor: '#CCFF00',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    flexShrink: 1,
  },
  userText: {
    color: '#0e0e0e',
    fontWeight: '500',
  },
  botText: {
    color: '#eaeaea',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  typingText: {
    color: '#CCFF00',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    backgroundColor: '#1a1919',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    color: '#fff',
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendButton: {
    backgroundColor: '#CCFF00',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
