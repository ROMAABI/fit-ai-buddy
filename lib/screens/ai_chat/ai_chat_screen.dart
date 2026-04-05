import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:http/http.dart' as http;
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../core/theme.dart';
import '../../core/constants.dart';
import '../../core/user_data.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  late final GenerativeModel? _model;
  bool _isLoading = false;
  final List<Map<String, String>> _conversationHistory = [];
  final UserData _userData = UserData();

  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;

  final ImagePicker _imagePicker = ImagePicker();
  final List<_AttachedFile> _attachedFiles = [];

  String get _systemPrompt {
    final hasAge = _userData.age > 0;
    final hasWeight = _userData.weight > 0;
    final hasHeight = _userData.height > 0;

    String missingInfo = '';
    if (!hasAge) missingInfo += '1. Age\n';
    if (!hasWeight) missingInfo += '2. Weight (kg)\n';
    if (!hasHeight) missingInfo += '3. Height (cm)\n';
    if (missingInfo.isEmpty) missingInfo = 'None — all collected.\n';

    return '''You are an expert AI Fitness & Nutrition Coach called "AI Buddy". Your role is to guide users with structured, evidence-based fitness and nutrition advice.

=== USER PROFILE (ALREADY COLLECTED) ===
Name: ${_userData.name}
Sex: ${_userData.sex}
Primary Goal: ${_userData.objective}
Fitness Level: ${_userData.fitnessLevel}
Training Days/Week: ${_userData.trainingDaysPerWeek}
${hasAge ? 'Age: ${_userData.age}' : ''}
${hasWeight ? 'Weight: ${_userData.weight} kg' : ''}
${hasHeight ? 'Height: ${_userData.height} cm' : ''}

=== STILL NEEDED (ONLY ASK IF NOT YET PROVIDED) ===
$missingInfo
If all info is collected, do NOT ask for it again. Just help the user with fitness/nutrition advice.

=== AGENTIC CAPABILITIES ===
You can help users ADD entries. When user wants to add something, respond with a special action block:

For WORKOUTS:
```action
type: workout
name: [workout name]
category: [WORKOUT/NUTRITION/RECOVERY/PLANNING]
notes: [any notes]
```

For NUTRITION:
```action
type: nutrition
name: [meal name]
calories: [number]
protein: [number in grams]
carbs: [number in grams]
fats: [number in grams]
```

For EXPENSES:
```action
type: expense
vendor: [vendor/merchant name]
amount: [number]
category: [Supplements/Gym Access/Coaching/Gear/Other]
```

Example: If user says "I had chicken breast 200g with rice for lunch", calculate macros and respond with the action block.

=== RESPONSE STYLE ===
- Language: English only
- Tone: Encouraging, disciplined, professional
- Use Markdown formatting
- Use **bold** for exercise names
- Use bullet points for workouts and diet plans
- Keep responses structured, clear, and concise

=== COACHING RULES ===
- Personalize all recommendations based on user data
- Focus on sustainable and practical routines
- Avoid unnecessary repetition
- Progress logically (beginner → intermediate → advanced if needed)

=== SAFETY RULE ===
Always include this when giving fitness advice:
"Please consult a medical professional before starting any high-intensity program if you have underlying health conditions."

=== BEHAVIOR ===
- Ask follow-up questions if any onboarding detail is missing
- When user mentions food, calculate macros and offer to log it
- When user mentions a workout, offer to log it
- When user mentions a purchase, offer to log expense
- Adapt plans based on user feedback over time
- Stay supportive but honest (no unrealistic promises)''';
  }

  @override
  void initState() {
    super.initState();
    if (AppConstants.aiProvider == 'gemini') {
      _model = GenerativeModel(
        model: 'gemini-2.0-flash',
        apiKey: AppConstants.geminiApiKey,
      );
    } else {
      _model = null;
    }
    _speech.initialize();
    _loadConversationHistory();
  }

  Future<void> _loadConversationHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('ai_chat_history');
    if (saved != null) {
      try {
        final List<dynamic> decoded = jsonDecode(saved);
        _conversationHistory.clear();
        _conversationHistory
            .addAll(decoded.map((e) => Map<String, String>.from(e as Map)));
        final List<_ChatMessage> restored = [];
        for (final msg in _conversationHistory) {
          if (msg['role'] == 'system') continue;
          restored.add(_ChatMessage(
            role: msg['role']!,
            sender: msg['role'] == 'assistant' ? 'AI BUDDY' : '',
            content: msg['content']!,
            isUser: msg['role'] == 'user',
          ));
        }
        setState(() => _messages.addAll(restored));
      } catch (_) {}
    }
  }

  Future<void> _saveConversationHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ai_chat_history', jsonEncode(_conversationHistory));
  }

  final List<_ChatMessage> _messages = [];

  final _quickActions = [
    'ANALYZE MY FORM',
    'CALCULATE MACROS',
    'SUMMARIZE MY WE…',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  return _buildMessage(_messages[index]);
                },
              ),
            ),
            _buildQuickActions(),
            if (_attachedFiles.isNotEmpty) _buildAttachedFiles(),
            _buildInputBar(),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.white06))),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.cyan,
              borderRadius: BorderRadius.circular(8),
              boxShadow: const [
                BoxShadow(color: AppColors.cyanGlow, blurRadius: 8)
              ],
            ),
            child: const Icon(Icons.smart_toy_outlined,
                color: AppColors.background, size: 16),
          ),
          const SizedBox(width: 10),
          const Text(
            'AI BUDDY',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 13,
              fontWeight: FontWeight.w800,
              letterSpacing: 2,
            ),
          ),
          const Spacer(),
          CustomPaint(
            painter: _DashedBoxPainter(),
            child: const SizedBox(
              width: 38,
              height: 38,
              child:
                  Icon(Icons.wifi_tethering, color: AppColors.cyan, size: 16),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(_ChatMessage msg) {
    if (msg.role == 'system_init') {
      return _buildSystemInit();
    }
    if (msg.isUser) {
      return _buildUserMessage(msg);
    }
    return _buildAiMessage(msg);
  }

  Widget _buildSystemInit() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SYSTEM INITIALIZED',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 2.5,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            width: 48,
            height: 2,
            decoration: BoxDecoration(
              color: AppColors.cyan,
              borderRadius: BorderRadius.circular(1),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiMessage(_ChatMessage msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.cyan.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                  border:
                      Border.all(color: AppColors.cyan.withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.bolt, color: AppColors.cyan, size: 10),
                    const SizedBox(width: 4),
                    Text(
                      msg.sender,
                      style: const TextStyle(
                        color: AppColors.cyan,
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(10),
                bottomLeft: Radius.circular(10),
                bottomRight: Radius.circular(10),
              ),
              border: Border.all(color: AppColors.white06),
              boxShadow: [
                BoxShadow(
                  color: AppColors.cyan.withValues(alpha: 0.04),
                  blurRadius: 12,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  msg.content,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.6,
                  ),
                ),
                if (msg.meta != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    height: 1,
                    color: AppColors.white06,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: msg.meta!.entries.map((e) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              e.key,
                              style: const TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              e.value,
                              style: const TextStyle(
                                color: AppColors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ],
                if (msg.isPartial == true) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildTypingDot(delay: 0),
                      const SizedBox(width: 4),
                      _buildTypingDot(delay: 150),
                      const SizedBox(width: 4),
                      _buildTypingDot(delay: 300),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot({required int delay}) {
    return Container(
      width: 6,
      height: 6,
      decoration: BoxDecoration(
        color: AppColors.cyan.withValues(alpha: 0.6),
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildUserMessage(_ChatMessage msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (msg.attachedImages != null && msg.attachedImages!.isNotEmpty)
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: msg.attachedImages!.map((path) {
                return ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.file(
                    File(path),
                    width: 120,
                    height: 120,
                    fit: BoxFit.cover,
                  ),
                );
              }).toList(),
            ),
          if (msg.attachedFileNames != null &&
              msg.attachedFileNames!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Wrap(
                spacing: 6,
                runSpacing: 4,
                children: msg.attachedFileNames!.map((name) {
                  return Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.cyan.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                          color: AppColors.cyan.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.attach_file,
                            size: 12, color: AppColors.cyan),
                        const SizedBox(width: 4),
                        Text(
                          name,
                          style: const TextStyle(
                            color: AppColors.cyan,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.72,
            ),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
                bottomLeft: Radius.circular(10),
              ),
              border: Border.all(color: AppColors.white12),
            ),
            child: Text(
              msg.content,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 13,
                height: 1.6,
              ),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'DELIVERED',
            style: TextStyle(
              color: AppColors.textDisabled,
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _quickActions.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) => GestureDetector(
          onTap: () {
            _controller.text = _quickActions[i].replaceAll('…', '');
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.white12),
            ),
            child: Center(
              child: Text(
                _quickActions[i],
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAttachedFiles() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _attachedFiles.map((file) {
          return Stack(
            children: [
              if (file.type == _AttachedFileType.image)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.file(
                    File(file.path),
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  ),
                )
              else
                Container(
                  width: 80,
                  height: 80,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.white12),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.insert_drive_file,
                          color: AppColors.cyan, size: 24),
                      const SizedBox(height: 4),
                      Text(
                        file.name.length > 10
                            ? '${file.name.substring(0, 8)}..'
                            : file.name,
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 9,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              Positioned(
                top: -4,
                right: -4,
                child: GestureDetector(
                  onTap: () {
                    setState(() => _attachedFiles.remove(file));
                  },
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child:
                        const Icon(Icons.close, size: 12, color: Colors.white),
                  ),
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 20),
      decoration: const BoxDecoration(
        color: AppColors.background,
        border: Border(top: BorderSide(color: AppColors.white06)),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: _pickFile,
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.white12),
              ),
              child: const Icon(Icons.attach_file,
                  color: AppColors.textMuted, size: 16),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppColors.white12),
              ),
              child: TextField(
                controller: _controller,
                style: const TextStyle(color: AppColors.white, fontSize: 13),
                decoration: const InputDecoration(
                  hintText: 'Message AI Buddy...',
                  hintStyle:
                      TextStyle(color: AppColors.textDisabled, fontSize: 13),
                  border: InputBorder.none,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _toggleListening,
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: _isListening
                    ? Colors.red.withValues(alpha: 0.2)
                    : AppColors.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: _isListening ? Colors.red : AppColors.white12,
                ),
              ),
              child: Icon(
                _isListening ? Icons.mic : Icons.mic_none,
                color: _isListening ? Colors.red : AppColors.textMuted,
                size: 16,
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: _isLoading ? null : _sendMessage,
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: _isLoading ? AppColors.surface : AppColors.cyan,
                borderRadius: BorderRadius.circular(10),
                boxShadow: _isLoading
                    ? null
                    : const [
                        BoxShadow(color: AppColors.cyanGlow, blurRadius: 10)
                      ],
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.cyan,
                      ),
                    )
                  : const Icon(Icons.send,
                      color: AppColors.background, size: 16),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickFile() async {
    final result = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library, color: AppColors.cyan),
              title: const Text('Gallery',
                  style: TextStyle(color: AppColors.white)),
              onTap: () => Navigator.pop(context, 'gallery'),
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt, color: AppColors.cyan),
              title: const Text('Camera',
                  style: TextStyle(color: AppColors.white)),
              onTap: () => Navigator.pop(context, 'camera'),
            ),
            ListTile(
              leading: const Icon(Icons.attach_file, color: AppColors.cyan),
              title:
                  const Text('File', style: TextStyle(color: AppColors.white)),
              onTap: () => Navigator.pop(context, 'file'),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );

    if (result == null) return;

    if (result == 'gallery') {
      final image = await _imagePicker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        setState(() {
          _attachedFiles.add(_AttachedFile(
            path: image.path,
            name: image.name,
            type: _AttachedFileType.image,
          ));
        });
      }
    } else if (result == 'camera') {
      final image = await _imagePicker.pickImage(source: ImageSource.camera);
      if (image != null) {
        setState(() {
          _attachedFiles.add(_AttachedFile(
            path: image.path,
            name: image.name,
            type: _AttachedFileType.image,
          ));
        });
      }
    } else if (result == 'file') {
      final result = await FilePicker.platform.pickFiles();
      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;
        if (file.path != null) {
          setState(() {
            _attachedFiles.add(_AttachedFile(
              path: file.path!,
              name: file.name,
              type: _AttachedFileType.file,
            ));
          });
        }
      }
    }
  }

  Future<void> _toggleListening() async {
    if (!_isListening) {
      final available = await _speech.initialize();
      if (!available) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Speech recognition not available'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }
      setState(() => _isListening = true);
      _speech.listen(
        onResult: (result) {
          setState(() {
            _controller.text = result.recognizedWords;
          });
        },
        listenFor: const Duration(seconds: 30),
        pauseFor: const Duration(seconds: 3),
      );
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if ((text.isEmpty && _attachedFiles.isEmpty) || _isLoading) return;

    final attachedImages = _attachedFiles
        .where((f) => f.type == _AttachedFileType.image)
        .map((f) => f.path)
        .toList();
    final attachedFileNames = _attachedFiles
        .where((f) => f.type == _AttachedFileType.file)
        .map((f) => f.name)
        .toList();

    setState(() {
      _messages.add(_ChatMessage(
        role: 'user',
        sender: '',
        content: text,
        isUser: true,
        attachedImages: attachedImages.isNotEmpty ? attachedImages : null,
        attachedFileNames:
            attachedFileNames.isNotEmpty ? attachedFileNames : null,
      ));
      _controller.clear();
      _attachedFiles.clear();
      _isLoading = true;
    });

    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );

    try {
      String responseText;

      if (AppConstants.aiProvider == 'ollama') {
        responseText = await _sendOllamaMessage(text);
      } else if (AppConstants.aiProvider == 'groq') {
        responseText = await _sendGroqMessage(text);
      } else {
        responseText = await _sendGeminiMessage(text, attachedImages);
      }

      final actionResult = _processActionBlocks(responseText);
      final cleanResponse = _removeActionBlocks(responseText);

      setState(() {
        _messages.add(_ChatMessage(
          role: 'ai',
          sender: 'AI BUDDY',
          content: cleanResponse,
          isUser: false,
          actionType: actionResult['type'],
          actionData: actionResult['data'],
        ));
        _isLoading = false;
      });

      _saveConversationHistory();

      if (actionResult['type'] != null && context.mounted) {
        _showActionSnackbar(actionResult['type'], actionResult['data']);
      }
    } catch (e) {
      String errorMessage = 'Connection failed.';
      final errorStr = e.toString();

      if (errorStr.contains('API key not valid') ||
          errorStr.contains('API_KEY_INVALID') ||
          errorStr.contains('invalid API key')) {
        errorMessage =
            'Invalid API key. Check your configuration in constants.dart';
      } else if (errorStr.contains('not found') ||
          errorStr.contains('404') ||
          errorStr.contains('models/')) {
        errorMessage =
            'Model not available. Check model name in constants.dart';
      } else if (errorStr.contains('quota') ||
          errorStr.contains('rate limit') ||
          errorStr.contains('429')) {
        errorMessage = 'Rate limit exceeded. Please wait and try again.';
      } else if (errorStr.contains('PERMISSION_DENIED') ||
          errorStr.contains('403')) {
        errorMessage = 'Permission denied. Check API access.';
      } else if (errorStr.contains('SocketException') ||
          errorStr.contains('Connection refused')) {
        errorMessage =
            'Cannot connect to server. Check your internet or API URL.';
      } else {
        errorMessage = 'Connection failed: $errorStr';
      }

      setState(() {
        _messages.add(_ChatMessage(
          role: 'ai',
          sender: 'SYSTEM ERROR',
          content: errorMessage,
          isUser: false,
        ));
        _isLoading = false;
      });
    }

    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  Future<String> _sendGroqMessage(String text) async {
    if (_conversationHistory.isEmpty) {
      _conversationHistory.add({
        'role': 'system',
        'content': _systemPrompt,
      });
    }

    _conversationHistory.add({'role': 'user', 'content': text});

    final url = Uri.parse('https://api.groq.com/openai/v1/chat/completions');

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${AppConstants.groqApiKey}',
    };

    final body = jsonEncode({
      'model': AppConstants.groqModel,
      'messages': _conversationHistory,
    });

    final response = await http
        .post(url, headers: headers, body: body)
        .timeout(const Duration(seconds: 60));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final assistantMessage =
          data['choices'][0]['message']['content'] ?? 'No response received.';

      _conversationHistory
          .add({'role': 'assistant', 'content': assistantMessage});

      return assistantMessage;
    } else {
      throw Exception(
          'Groq API error: ${response.statusCode} - ${response.body}');
    }
  }

  Future<String> _sendGeminiMessage(
      String text, List<String> imagePaths) async {
    if (_model == null) throw Exception('Gemini not initialized');

    final model = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: AppConstants.geminiApiKey,
    );

    final List<Part> parts = [];

    for (final path in imagePaths) {
      final file = File(path);
      final bytes = await file.readAsBytes();
      parts.add(DataPart('image/jpeg', bytes));
    }

    parts.add(TextPart(text));

    final response = await model.generateContent(
      [Content.multi(parts)],
    );

    final responseText = response.text ?? 'No response received.';

    _conversationHistory.add({'role': 'user', 'content': text});
    _conversationHistory.add({'role': 'assistant', 'content': responseText});

    return responseText;
  }

  Future<String> _sendOllamaMessage(String text) async {
    if (_conversationHistory.isEmpty) {
      _conversationHistory.add({
        'role': 'system',
        'content': _systemPrompt,
      });
    }

    _conversationHistory.add({'role': 'user', 'content': text});

    final apiUrl = '${AppConstants.ollamaBaseUrl}/api/chat';
    final proxyUrl = 'https://corsproxy.io/?${Uri.encodeComponent(apiUrl)}';
    final url = Uri.parse(proxyUrl);

    final headers = {
      'Content-Type': 'application/json',
      if (AppConstants.ollamaApiKey.isNotEmpty)
        'Authorization': 'Bearer ${AppConstants.ollamaApiKey}',
    };

    final body = jsonEncode({
      'model': AppConstants.ollamaModel,
      'messages': _conversationHistory,
      'stream': false,
    });

    final response = await http
        .post(url, headers: headers, body: body)
        .timeout(const Duration(seconds: 120));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final assistantMessage =
          data['message']['content'] ?? 'No response received.';

      _conversationHistory
          .add({'role': 'assistant', 'content': assistantMessage});

      return assistantMessage;
    } else {
      throw Exception(
          'Ollama API error: ${response.statusCode} - ${response.body}');
    }
  }

  Map<String, dynamic> _processActionBlocks(String text) {
    final actionRegex = RegExp(r'```action\n([\s\S]*?)```');
    final match = actionRegex.firstMatch(text);

    if (match == null) return {'type': null, 'data': null};

    final actionContent = match.group(1) ?? '';
    final lines = actionContent.split('\n');
    final data = <String, String>{};
    String? type;

    for (final line in lines) {
      final parts = line.split(':');
      if (parts.length >= 2) {
        final key = parts[0].trim();
        final value = parts.sublist(1).join(':').trim();
        if (key == 'type') {
          type = value;
        } else {
          data[key] = value;
        }
      }
    }

    return {'type': type, 'data': data};
  }

  String _removeActionBlocks(String text) {
    final actionRegex = RegExp(r'```action\n[\s\S]*?```');
    return text.replaceAll(actionRegex, '').trim();
  }

  void _showActionSnackbar(String? type, Map<String, String>? data) {
    if (type == null || data == null) return;

    String message;
    switch (type) {
      case 'workout':
        message = 'Workout "${data['name'] ?? 'Session'}" ready to add';
        break;
      case 'nutrition':
        message = 'Meal "${data['name'] ?? 'Entry'}" ready to add';
        break;
      case 'expense':
        message = 'Expense "\$${data['amount'] ?? '0'}" ready to add';
        break;
      default:
        message = 'Action ready';
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.cyan,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class _ChatMessage {
  final String role;
  final String sender;
  final String content;
  final bool isUser;
  final Map<String, String>? meta;
  final bool? isPartial;
  final String? actionType;
  final Map<String, String>? actionData;
  final List<String>? attachedImages;
  final List<String>? attachedFileNames;

  _ChatMessage({
    required this.role,
    required this.sender,
    required this.content,
    required this.isUser,
    this.meta,
    this.isPartial,
    this.actionType,
    this.actionData,
    this.attachedImages,
    this.attachedFileNames,
  });
}

enum _AttachedFileType { image, file }

class _AttachedFile {
  final String path;
  final String name;
  final _AttachedFileType type;

  _AttachedFile({required this.path, required this.name, required this.type});
}

class _DashedBoxPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.cyan.withValues(alpha: 0.5)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    const dashWidth = 5.0;
    const dashSpace = 3.0;
    final path = Path()
      ..addRRect(RRect.fromRectAndRadius(
          Rect.fromLTWH(0, 0, size.width, size.height),
          const Radius.circular(8)));
    final pathMetrics = path.computeMetrics();
    for (final metric in pathMetrics) {
      double distance = 0;
      while (distance < metric.length) {
        canvas.drawPath(
            metric.extractPath(distance, distance + dashWidth), paint);
        distance += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedBoxPainter oldDelegate) => false;
}
