import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:http/http.dart' as http;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class AddNutritionScreen extends StatefulWidget {
  const AddNutritionScreen({super.key});

  @override
  State<AddNutritionScreen> createState() => _AddNutritionScreenState();
}

class _AddNutritionScreenState extends State<AddNutritionScreen> {
  final _textController = TextEditingController();
  bool _isLoading = false;

  String get _systemPrompt {
    return '''You are the 'Fit AI Buddy' Nutrition Logger.
Task: Convert raw user text into a structured JSON object for Firestore nutrition collection.

Output Format (Strict JSON):
{
  "meal": "Chicken Rice",
  "calories": 450,
  "protein_g": 35,
  "carbs_g": 55,
  "fats_g": 12,
  "notes": "Homemade, grilled chicken",
  "toast": "Protein packed meal logged! 450 kcal recorded."
}

Rules:
1. Extract meal name, calories, protein, carbs, fats.
2. If values are missing, estimate based on food knowledge.
3. Return ONLY the JSON object. No markdown, no explanation.''';
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    _buildHeader(),
                    const SizedBox(height: 24),
                    _buildInputField(),
                    const SizedBox(height: 16),
                    _buildExamples(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
              child: _buildSubmitButton(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.white06)),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.white30),
                borderRadius: BorderRadius.circular(6),
              ),
              child:
                  const Icon(Icons.close, color: AppColors.white70, size: 16),
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'ADD MEAL',
            style: TextStyle(
              color: AppColors.white,
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 2,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.restaurant,
                  color: AppColors.success, size: 18),
            ),
            const SizedBox(width: 12),
            Text(
              'AI NUTRITION LOGGER',
              style: TextStyle(
                color: AppColors.success,
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Text(
          'Describe your meal',
          style: TextStyle(
            color: AppColors.white,
            fontSize: 22,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'AI will estimate calories and macros automatically',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 13,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildInputField() {
    return Container(
      height: 160,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.white12),
      ),
      child: TextField(
        controller: _textController,
        maxLines: null,
        style: const TextStyle(color: AppColors.white, fontSize: 14),
        decoration: InputDecoration(
          hintText: 'e.g., "Had 2 dosas with sambar for breakfast"',
          hintStyle:
              const TextStyle(color: AppColors.textDisabled, fontSize: 13),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(16),
        ),
      ),
    );
  }

  Widget _buildExamples() {
    final examples = [
      '2 dosas with sambar and coconut chutney',
      'Chicken rice bowl with 200g grilled chicken',
      'Protein shake with banana and oats',
      '3 idlis with sambar for breakfast',
      'Egg omelette with 3 eggs and toast',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'EXAMPLES',
          style: TextStyle(
            color: AppColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 10),
        ...examples.map((ex) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _textController.text = ex),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.white06),
                  ),
                  child: Text(
                    ex,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            )),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return GestureDetector(
      onTap: _isLoading ? null : _submitToAI,
      child: Container(
        width: double.infinity,
        height: 52,
        decoration: BoxDecoration(
          color: _isLoading ? AppColors.textDisabled : AppColors.success,
          borderRadius: BorderRadius.circular(12),
          boxShadow: _isLoading
              ? null
              : [
                  BoxShadow(
                    color: AppColors.success.withValues(alpha: 0.3),
                    blurRadius: 12,
                  ),
                ],
        ),
        child: Center(
          child: _isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.background,
                  ),
                )
              : const Text(
                  'LOG MEAL',
                  style: TextStyle(
                    color: AppColors.background,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.5,
                  ),
                ),
        ),
      ),
    );
  }

  Future<void> _submitToAI() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isLoading = true);

    try {
      String aiResponse;
      if (AppConstants.aiProvider == 'ollama') {
        aiResponse = await _callOllama(text);
      } else if (AppConstants.aiProvider == 'groq') {
        aiResponse = await _callGroq(text);
      } else {
        aiResponse = await _callGemini(text);
      }

      await _processAIResponse(aiResponse);

      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<String> _callOllama(String text) async {
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
      'messages': [
        {'role': 'system', 'content': _systemPrompt},
        {'role': 'user', 'content': text},
      ],
      'stream': false,
    });

    final response = await http
        .post(url, headers: headers, body: body)
        .timeout(const Duration(seconds: 120));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['message']['content'] ?? '{}';
    } else {
      throw Exception('Ollama error: ${response.statusCode}');
    }
  }

  Future<String> _callGroq(String text) async {
    final url = Uri.parse('https://api.groq.com/openai/v1/chat/completions');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${AppConstants.groqApiKey}',
    };
    final body = jsonEncode({
      'model': AppConstants.groqModel,
      'messages': [
        {'role': 'system', 'content': _systemPrompt},
        {'role': 'user', 'content': text},
      ],
    });
    final response = await http
        .post(url, headers: headers, body: body)
        .timeout(const Duration(seconds: 60));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['choices'][0]['message']['content'] ?? '{}';
    } else {
      throw Exception('Groq error: ${response.statusCode}');
    }
  }

  Future<String> _callGemini(String text) async {
    final model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: AppConstants.geminiApiKey,
    );

    final response = await model.generateContent([
      Content.text(_systemPrompt),
      Content.text(text),
    ]);

    return response.text ?? '{}';
  }

  Future<void> _processAIResponse(String rawResponse) async {
    String cleaned = rawResponse.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replaceAll(RegExp(r'^```json\s*'), '');
      cleaned = cleaned.replaceAll(RegExp(r'^```\s*'), '');
      cleaned = cleaned.replaceAll(RegExp(r'\s*```$'), '');
      cleaned = cleaned.trim();
    }

    final data = jsonDecode(cleaned);
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) throw Exception('No user logged in');

    final toast = data['toast'] ?? 'Meal logged!';
    data.remove('toast');
    data['timestamp'] = Timestamp.now();

    await FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .collection('nutrition')
        .add(data);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(toast),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }
}
