import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLuxuryTheme, hexToRgba, SHADOWS } from '@/theme/luxury';
import { LiquidBackground, LiquidGlassCard } from '@/components/LiquidGlass';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTopBar, TopBarIconButton } from '@/components/AppTopBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const SYSTEM_FONT = Platform.select({ ios: 'System', default: 'sans-serif' });

interface ActionPill {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  actions?: ActionPill[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Welcome back, Alex! I've analyzed your recent 7-day training data. Your push volume was up 12% yesterday, burning 620 kcal. How can I optimize your program today?",
    sender: 'ai',
    timestamp: '9:15 AM',
    actions: [
      { label: 'View Push Routine', icon: 'barbell-outline', route: '/(tabs)/workout' },
      { label: 'Log Nutrition', icon: 'restaurant-outline', route: '/(tabs)/nutrition' },
    ],
  },
  {
    id: '2',
    text: 'How should I structure my push day for maximum hypertrophy?',
    sender: 'user',
    timestamp: '9:18 AM',
  },
  {
    id: '3',
    text: 'For optimal myofibrillar hypertrophy on Push Day:\n\n1. Primary Compound: Incline Dumbbell Press (3-4 sets × 8-10 reps, 2 min rest)\n2. Secondary Compound: Overhead Press or Weighted Dips (3 sets × 10-12 reps)\n3. Isolation: Cable Lateral Raises (4 sets × 12-15 reps with slow 3s eccentric)\n4. Tricep Finisher: Cross-body Cable Pushdowns (3 sets × 12-15 reps to failure)\n\nAim for 1-2 reps in reserve (RIR 1-2) to prevent central fatigue.',
    sender: 'ai',
    timestamp: '9:19 AM',
    actions: [
      { label: 'Start Push Routine', icon: 'play-outline', route: '/(tabs)/workout' },
      { label: 'Macro Targets', icon: 'nutrition-outline', route: '/(tabs)/nutrition' },
    ],
  },
];

const SUGGESTIONS = [
  { label: '🔥 Optimize push workout', prompt: 'How can I optimize my push workout today?' },
  { label: '🥗 Post-workout meal', prompt: 'What is the best post-workout meal for muscle protein synthesis?' },
  { label: '💤 Recovery score', prompt: 'Analyze my recovery and rest schedule for this week.' },
  { label: '⚡ Creatine timing', prompt: 'When should I take creatine monohydrate for peak efficacy?' },
  { label: '📈 Weekly volume audit', prompt: 'Can you summarize my weekly training volume and progression?' },
];

function getBotResponse(userText: string): { text: string; actions?: ActionPill[] } {
  const query = userText.toLowerCase();

  if (query.includes('meal') || query.includes('food') || query.includes('protein') || query.includes('eat') || query.includes('nutrition')) {
    return {
      text: 'To maximize muscle protein synthesis (MPS), consume 35–45g of high-leucine protein (e.g., whey isolate, chicken breast, or Greek yogurt) paired with 60–80g of fast-digesting carbohydrates within 2 hours post-workout to restore glycogen stores.',
      actions: [
        { label: 'Log Today’s Meals', icon: 'restaurant-outline', route: '/(tabs)/nutrition' },
        { label: 'View Macro Target', icon: 'pie-chart-outline', route: '/(tabs)/nutrition' },
      ],
    };
  }

  if (query.includes('push') || query.includes('chest') || query.includes('bench') || query.includes('tricep')) {
    return {
      text: 'For push progression today: prioritize deep chest stretch on Incline DB Press, pause 1 second at the bottom to eliminate elastic rebound, and keep your elbows at a 45° angle to protect the anterior shoulder capsule.',
      actions: [
        { label: 'Open Workout Hub', icon: 'barbell-outline', route: '/(tabs)/workout' },
      ],
    };
  }

  if (query.includes('recovery') || query.includes('sleep') || query.includes('sore') || query.includes('rest')) {
    return {
      text: 'Your current 7-day streak is solid! Your active volume is at 45 min/day. Consider dedicating tomorrow to active recovery: 20 minutes of zone-2 mobility flow, 10 minutes of hip openers, and targeting 8 hours of sleep for testosterone and growth hormone pulse.',
      actions: [
        { label: 'Log Recovery Walk', icon: 'walk-outline', route: '/(tabs)/workout' },
      ],
    };
  }

  if (query.includes('creatine') || query.includes('supplement') || query.includes('whey')) {
    return {
      text: 'Creatine Monohydrate (5g/day) is most effective when taken consistently. Timing matters less than saturation, though taking it with a carb-rich post-workout meal slightly increases intramuscular uptake via insulin-mediated transport.',
      actions: [
        { label: 'Review Supplements', icon: 'flask-outline', route: '/(tabs)/expense' },
      ],
    };
  }

  if (query.includes('volume') || query.includes('summary') || query.includes('progress') || query.includes('stats')) {
    return {
      text: 'Weekly Summary: You’ve completed 5 sessions this week, burned ~4,200 kcal, and averaged 1,840 kcal/day of clean fuel. Your training consistency is in the top 5% of athletes this month. Keep this momentum!',
      actions: [
        { label: 'View Dashboard Analytics', icon: 'grid-outline', route: '/(tabs)/dashboard' },
      ],
    };
  }

  return {
    text: "Solid focus! Based on your athlete profile (78 kg, Advanced level, 5 days/wk), prioritize progressive overload—either add 1 repetition or 1-2.5 kg to your working sets while keeping RPE at 8-9. What specific exercise or nutrition question do you have?",
    actions: [
      { label: 'View Workouts', icon: 'barbell-outline', route: '/(tabs)/workout' },
      { label: 'Track Macros', icon: 'nutrition-outline', route: '/(tabs)/nutrition' },
    ],
  };
}

export default function AICoachScreen() {
  const { palette, isDark } = useLuxuryTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Pulsing dot animation for online indicator
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Typing dots indicator animation
  const [dotCycle, setDotCycle] = useState(1);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTyping) {
      interval = setInterval(() => {
        setDotCycle((prev) => (prev % 3) + 1);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = (textToSend?: string) => {
    const content = (textToSend ?? inputText).trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);

    setTimeout(() => {
      const reply = getBotResponse(content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reply.text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: reply.actions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGES[0]]);
  };

  // Safe bottom padding above the floating tab bar dock (dock height ~66 + bottom inset)
  const bottomPadding = Math.max(insets.bottom, 12) + 74;

  return (
    <LiquidBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Unified Top Bar */}
        <AppTopBar
          leftMode="avatar"
          avatarInitials="AI"
          subtitle="ACTIVE · SPORTS SCIENCE"
          title="AI COACH"
          rightNode={
            <>
              <ThemeSwitcher variant="compact" size={40} />
              <TopBarIconButton
                icon="refresh-outline"
                accessibilityLabel="Reset Conversation"
                onPress={handleReset}
                color={palette.textSecondary}
                size={40}
              />
            </>
          }
        />

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {SUGGESTIONS.map((item, index) => (
              <Pressable key={index} onPress={() => handleSend(item.prompt)}>
                <LiquidGlassCard
                  borderRadius={14}
                  intensity="low"
                  style={styles.suggestionChip}
                >
                  <Text style={[styles.suggestionText, { color: palette.textPrimary }]}>
                    {item.label}
                  </Text>
                </LiquidGlassCard>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Chat Messages Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={[styles.chatContent, { paddingBottom: 16 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAi]}
              >
                {!isUser && (
                  <View style={[styles.msgAvatar, { backgroundColor: hexToRgba(palette.accent, 0.2) }]}>
                    <Ionicons name="sparkles" size={13} color={palette.accentSoft} />
                  </View>
                )}

                <View style={isUser ? styles.userMsgContainer : styles.aiMsgContainer}>
                  {isUser ? (
                    <LinearGradient
                      colors={[palette.accent, palette.accentSoft]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.userBubble}
                    >
                      <Text style={styles.userBubbleText}>{msg.text}</Text>
                    </LinearGradient>
                  ) : (
                    <LiquidGlassCard
                      borderRadius={18}
                      intensity="high"
                      style={styles.aiBubble}
                    >
                      <Text style={[styles.aiBubbleText, { color: palette.textPrimary }]}>
                        {msg.text}
                      </Text>

                      {/* Action Pills inside AI Response */}
                      {msg.actions && msg.actions.length > 0 && (
                        <View style={styles.actionPillsContainer}>
                          {msg.actions.map((act, actIdx) => (
                            <Pressable
                              key={actIdx}
                              onPress={() => {
                                if (act.route) router.push(act.route as any);
                              }}
                              style={[
                                styles.actionPill,
                                {
                                  backgroundColor: hexToRgba(palette.accent, 0.15),
                                  borderColor: hexToRgba(palette.accent, 0.35),
                                },
                              ]}
                            >
                              <Ionicons name={act.icon} size={13} color={palette.accentSoft} />
                              <Text style={[styles.actionPillText, { color: palette.accentSoft }]}>
                                {act.label}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </LiquidGlassCard>
                  )}

                  <Text
                    style={[
                      styles.timestampText,
                      {
                        color: palette.textMuted,
                        textAlign: isUser ? 'right' : 'left',
                      },
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowAi]}>
              <View style={[styles.msgAvatar, { backgroundColor: hexToRgba(palette.accent, 0.2) }]}>
                <Ionicons name="sparkles" size={13} color={palette.accentSoft} />
              </View>
              <LiquidGlassCard borderRadius={18} intensity="high" style={styles.typingCard}>
                <View style={styles.typingRow}>
                  <View style={[styles.typingDot, { opacity: dotCycle >= 1 ? 1 : 0.25, backgroundColor: palette.accent }]} />
                  <View style={[styles.typingDot, { opacity: dotCycle >= 2 ? 1 : 0.25, backgroundColor: palette.accent }]} />
                  <View style={[styles.typingDot, { opacity: dotCycle >= 3 ? 1 : 0.25, backgroundColor: palette.accent }]} />
                </View>
              </LiquidGlassCard>
            </View>
          )}
        </ScrollView>

        {/* Input Bar pinned safely above floating Tab Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
        >
          <View style={[styles.inputWrapper, { paddingBottom: bottomPadding }]}>
            <LiquidGlassCard borderRadius={22} intensity="high" style={styles.inputGlassCard}>
              <View style={styles.inputInner}>
                <TextInput
                  style={[styles.inputField, { color: palette.textPrimary }]}
                  placeholder="Ask your coach anything (workouts, food, recovery)..."
                  placeholderTextColor={palette.textMuted}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={600}
                />
                <Pressable
                  onPress={() => handleSend()}
                  disabled={!inputText.trim()}
                  style={styles.sendButtonWrap}
                >
                  <LinearGradient
                    colors={
                      inputText.trim()
                        ? [palette.accent, palette.accentSoft]
                        : [hexToRgba(palette.textMuted, 0.3), hexToRgba(palette.textMuted, 0.15)]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendButton}
                  >
                    <Ionicons name="arrow-up" size={17} color="#FFFFFF" />
                  </LinearGradient>
                </Pressable>
              </View>
            </LiquidGlassCard>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 2,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0D0819',
  },
  headerInfo: {
    gap: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  proBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proBadgeText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    fontWeight: '500',
  },
  resetButton: {
    padding: 4,
  },
  resetCard: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsWrapper: {
    paddingBottom: 8,
  },
  suggestionsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  suggestionText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12.5,
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  userMsgContainer: {
    maxWidth: '82%',
    alignItems: 'flex-end',
  },
  aiMsgContainer: {
    maxWidth: '82%',
    alignItems: 'flex-start',
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubbleText: {
    fontFamily: SYSTEM_FONT,
    color: '#FFFFFF',
    fontSize: 14.5,
    lineHeight: 21,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
  },
  aiBubbleText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14.5,
    lineHeight: 22,
  },
  actionPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionPillText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timestampText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 10.5,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  typingCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 4,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  inputGlassCard: {
    padding: 6,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputField: {
    flex: 1,
    minHeight: 38,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 9,
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    lineHeight: 20,
  },
  sendButtonWrap: {
    padding: 2,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
