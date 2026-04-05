class AppConstants {
  static const appName = 'FIT AI BUDDY';
  static const systemName = 'VRTX_SYSTIM';
  static const engineVersion = 'NEURAL ENGINE V4.2';
  static const configVersion = 'CONFIGURATION ENGINE V2.4';

  // AI API Configuration
  static const String aiProvider = 'groq'; // 'gemini', 'ollama', or 'groq'

  // Gemini API (if using Gemini)
  static const geminiApiKey = 'YOUR_GEMINI_API_KEY';

  // Ollama Cloud API (if using Ollama)
  static const ollamaBaseUrl = 'https://ollama.com';
  static const ollamaApiKey = 'YOUR_OLLAMA_API_KEY';
  static const ollamaModel =
      'kimi-k2.5:cloud'; // or 'glm-5:cloud', 'qwen3-vl:cloud'

  // Groq API (if using Groq)
  static const groqApiKey = 'YOUR_GROQ_API_KEY';
  static const groqModel = 'llama-3.3-70b-versatile';

  // Spacing
  static const double paddingXS = 4;
  static const double paddingSM = 8;
  static const double paddingMD = 16;
  static const double paddingLG = 20;
  static const double paddingXL = 24;
  static const double paddingXXL = 32;

  // Border radius
  static const double radiusSM = 6;
  static const double radiusMD = 10;
  static const double radiusLG = 14;
  static const double radiusXL = 20;

  // Card heights
  static const double cardHeightSM = 80;
  static const double cardHeightMD = 110;
  static const double cardHeightLG = 140;

  // Bottom nav height
  static const double bottomNavHeight = 64;

  // Button height
  static const double buttonHeightLG = 56;
  static const double buttonHeightMD = 46;
}
