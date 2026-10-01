import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { aiService } from '../../services/aiService';
import { AIResponse } from '../../types';
import { useAppStore } from '../../lib/store';
import { Bot, Send, Sparkles, User, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  responsePayload?: AIResponse;
}

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am ImpactIQ Causal AI Assistant. Ask me anything about campaign incremental lift, holdout experiments, budget optimization, or promo leakage.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const samplePrompts = [
    'Did the Eid cashback actually work?',
    'Which segment should I stop paying?',
    'How should I split ৳5M across campaigns?',
    'Explain this result to my manager in simple words',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const res = await aiService.ask(q);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: language === 'bn' ? res.answerBn : res.answerEn,
        responsePayload: res,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ConsoleHeader title="ImpactIQ AI Assistant ✦" subtitle="Causal Reasoning, Incremental Uplift Q&A, and Explainable Insights" />

      <View style={styles.chatWrapper}>
        {/* Sample Prompt Chips */}
        <View style={styles.promptsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {samplePrompts.map((p, i) => (
              <TouchableOpacity key={i} style={styles.pChip} onPress={() => handleSend(p)}>
                <Sparkles size={12} color={themeTokens.brand.primary} />
                <Text style={styles.pChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Stream */}
        <ScrollView style={styles.msgScroll} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.msgRow, m.sender === 'user' ? styles.userRow : styles.aiRow]}>
              <View style={[styles.avatar, m.sender === 'user' ? styles.userAvatar : styles.aiAvatar]}>
                {m.sender === 'user' ? <User size={16} color={themeTokens.colors.surface} /> : <Bot size={16} color={themeTokens.brand.yellow} />}
              </View>

              <View style={[styles.bubble, m.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.msgText, m.sender === 'user' && { color: themeTokens.colors.surface }]}>
                  {m.text}
                </Text>

                {m.responsePayload && (
                  <View style={styles.payloadBox}>
                    {/* Citations */}
                    <View style={styles.citationsRow}>
                      <Text style={styles.citeTitle}>Citations:</Text>
                      {m.responsePayload.citations.map((c, i) => (
                        <View key={i} style={styles.citePill}>
                          <Text style={styles.citeText}>{c}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Suggested Action Chips */}
                    {m.responsePayload.suggestedActions.map((act, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.actionChip}
                        onPress={() => act.route && router.push(act.route as any)}
                      >
                        <Text style={styles.actChipText}>
                          {language === 'bn' ? act.labelBn : act.labelEn}
                        </Text>
                        <ArrowRight size={12} color={themeTokens.brand.primaryDark} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.msgRow, styles.aiRow]}>
              <View style={[styles.avatar, styles.aiAvatar]}>
                <Bot size={16} color={themeTokens.brand.yellow} />
              </View>
              <View style={[styles.bubble, styles.aiBubble]}>
                <Text style={styles.typingText}>ImpactIQ AI is reasoning over causal data...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask ImpactIQ AI a question..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
            <Send size={18} color={themeTokens.brand.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  chatWrapper: { flex: 1, justifyContent: 'space-between' },
  promptsRow: { backgroundColor: themeTokens.colors.surface, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  pChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EBF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: themeTokens.radius.full },
  pChipText: { fontSize: 11, fontWeight: '700', color: themeTokens.brand.primary },
  msgScroll: { flex: 1 },
  msgRow: { flexDirection: 'row', gap: 10, maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiRow: { alignSelf: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  userAvatar: { backgroundColor: themeTokens.brand.primary },
  aiAvatar: { backgroundColor: themeTokens.brand.primaryDark },
  bubble: { padding: 14, borderRadius: themeTokens.radius.lg, gap: 8 },
  userBubble: { backgroundColor: themeTokens.brand.primary },
  aiBubble: { backgroundColor: themeTokens.colors.surface, borderWidth: 1, borderColor: themeTokens.colors.border },
  msgText: { fontSize: 13, lineHeight: 20, color: themeTokens.colors.textPrimary },
  typingText: { fontSize: 12, fontStyle: 'italic', color: themeTokens.colors.textMuted },
  payloadBox: { gap: 8, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: themeTokens.colors.border },
  citationsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  citeTitle: { fontSize: 10, fontWeight: '800', color: themeTokens.colors.textMuted },
  citePill: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  citeText: { fontSize: 9, color: themeTokens.colors.textSecondary, fontWeight: '600' },
  actionChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: themeTokens.brand.yellow, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actChipText: { fontSize: 11, fontWeight: '900', color: themeTokens.brand.primaryDark },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: themeTokens.colors.surface, padding: 12, borderTopWidth: 1, borderTopColor: themeTokens.colors.border, gap: 10 },
  textInput: { flex: 1, backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 10, borderRadius: themeTokens.radius.full, fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: themeTokens.brand.yellow, justifyContent: 'center', alignItems: 'center' },
});
