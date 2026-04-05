import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/user_data.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final UserData _userData = UserData();

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
                    const SizedBox(height: 16),
                    _buildProfileCard(),
                    const SizedBox(height: 24),
                    _buildProfileInfoSection(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.white12),
            ),
            child: const Icon(Icons.person_outline,
                color: AppColors.cyan, size: 16),
          ),
          const SizedBox(width: 12),
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
          GestureDetector(
            onTap: _showEditProfileDialog,
            child: const Icon(Icons.settings_outlined,
                color: AppColors.textMuted, size: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.white06),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: _showEditInitialsDialog,
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.white12),
                  ),
                  child: Center(
                    child: Text(
                      _userData.initials.toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.cyan,
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -10,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.cyan,
                      borderRadius: BorderRadius.circular(4),
                      boxShadow: const [
                        BoxShadow(color: AppColors.cyanGlow, blurRadius: 8)
                      ],
                    ),
                    child: Text(
                      _userData.fitnessLevel.toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.background,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'ACTIVE PROTOCOL',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            _userData.name,
            style: const TextStyle(
              color: AppColors.white,
              fontSize: 26,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.success,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                '${_userData.sex} • ${_userData.objective}',
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildActionButton('Edit Profile', onTap: _showEditProfileDialog),
        ],
      ),
    );
  }

  Widget _buildActionButton(String label, {required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        height: 44,
        decoration: BoxDecoration(
          color: AppColors.cyan,
          borderRadius: BorderRadius.circular(8),
          boxShadow: const [
            BoxShadow(color: AppColors.cyanGlow, blurRadius: 12)
          ],
        ),
        child: Center(
          child: Text(
            label,
            style: const TextStyle(
              color: AppColors.background,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileInfoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'PROFILE INFO',
          style: TextStyle(
            color: AppColors.white,
            fontSize: 13,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 14),
        _buildInfoCard('NAME', _userData.name, Icons.person_outline),
        const SizedBox(height: 10),
        _buildInfoCard('SEX', _userData.sex, Icons.wc_outlined),
        const SizedBox(height: 10),
        _buildInfoCard(
            'OBJECTIVE', _userData.objective, Icons.track_changes_outlined),
        const SizedBox(height: 10),
        _buildInfoCard(
            'FITNESS LEVEL', _userData.fitnessLevel, Icons.fitness_center),
        const SizedBox(height: 10),
        _buildInfoCard(
            'TRAINING DAYS',
            '${_userData.trainingDaysPerWeek} days/week',
            Icons.calendar_today_outlined),
        const SizedBox(height: 10),
        _buildInfoCard(
            'FIRST DAY', _userData.firstDayOfWeek, Icons.event_outlined),
      ],
    );
  }

  Widget _buildInfoCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.white06),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.cyan, size: 18),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.8,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showEditInitialsDialog() {
    final initialsController = TextEditingController(text: _userData.initials);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text(
          'Edit Initials',
          style: TextStyle(color: AppColors.white, fontWeight: FontWeight.w800),
        ),
        content: TextField(
          controller: initialsController,
          maxLength: 3,
          style: const TextStyle(
              color: AppColors.white,
              fontSize: 24,
              fontWeight: FontWeight.w900),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            hintText: 'ABC',
            hintStyle: const TextStyle(color: AppColors.textMuted),
            enabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColors.white12),
              borderRadius: BorderRadius.circular(8),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColors.cyan),
              borderRadius: BorderRadius.circular(8),
            ),
            counterStyle: const TextStyle(color: AppColors.textMuted),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel',
                style: TextStyle(color: AppColors.textMuted)),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _userData.initials = initialsController.text.trim().isNotEmpty
                    ? initialsController.text.trim().toUpperCase()
                    : 'U';
              });
              Navigator.pop(context);
            },
            child: const Text('Save', style: TextStyle(color: AppColors.cyan)),
          ),
        ],
      ),
    );
  }

  void _showEditProfileDialog() {
    final nameController = TextEditingController(text: _userData.name);
    String selectedSex = _userData.sex;
    String selectedObjective = _userData.objective;
    String selectedFitnessLevel = _userData.fitnessLevel;
    int selectedDays = _userData.trainingDaysPerWeek;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppColors.surface,
          title: const Text(
            'Edit Profile',
            style:
                TextStyle(color: AppColors.white, fontWeight: FontWeight.w800),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: nameController,
                  style: const TextStyle(color: AppColors.white),
                  decoration: InputDecoration(
                    labelText: 'Name',
                    labelStyle: const TextStyle(color: AppColors.textMuted),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppColors.white12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppColors.cyan),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Sex',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  children: ['Male', 'Female'].map((sex) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(sex),
                        selected: selectedSex == sex,
                        onSelected: (selected) {
                          setDialogState(() => selectedSex = sex);
                        },
                        selectedColor: AppColors.cyan,
                        backgroundColor: AppColors.surfaceElevated,
                        labelStyle: TextStyle(
                          color: selectedSex == sex
                              ? AppColors.background
                              : AppColors.textSecondary,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                const Text('Objective',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children:
                      ['Lose Weight', 'Build Muscle', 'Keep Fit'].map((obj) {
                    return ChoiceChip(
                      label: Text(obj),
                      selected: selectedObjective == obj,
                      onSelected: (selected) {
                        setDialogState(() => selectedObjective = obj);
                      },
                      selectedColor: AppColors.cyan,
                      backgroundColor: AppColors.surfaceElevated,
                      labelStyle: TextStyle(
                        color: selectedObjective == obj
                            ? AppColors.background
                            : AppColors.textSecondary,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                const Text('Fitness Level',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children:
                      ['Beginner', 'Intermediate', 'Advanced'].map((level) {
                    return ChoiceChip(
                      label: Text(level),
                      selected: selectedFitnessLevel == level,
                      onSelected: (selected) {
                        setDialogState(() => selectedFitnessLevel = level);
                      },
                      selectedColor: AppColors.cyan,
                      backgroundColor: AppColors.surfaceElevated,
                      labelStyle: TextStyle(
                        color: selectedFitnessLevel == level
                            ? AppColors.background
                            : AppColors.textSecondary,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                const Text('Training Days/Week',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(7, (i) {
                    final day = i + 1;
                    return GestureDetector(
                      onTap: () => setDialogState(() => selectedDays = day),
                      child: Container(
                        width: 36,
                        height: 40,
                        decoration: BoxDecoration(
                          color: selectedDays == day
                              ? AppColors.cyan
                              : AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: selectedDays == day
                                ? AppColors.cyan
                                : AppColors.white12,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            '$day',
                            style: TextStyle(
                              color: selectedDays == day
                                  ? AppColors.background
                                  : AppColors.textSecondary,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel',
                  style: TextStyle(color: AppColors.textMuted)),
            ),
            TextButton(
              onPressed: () async {
                setState(() {
                  _userData.name = nameController.text.trim().isNotEmpty
                      ? nameController.text.trim()
                      : 'User';
                  _userData.sex = selectedSex;
                  _userData.objective = selectedObjective;
                  _userData.fitnessLevel = selectedFitnessLevel;
                  _userData.trainingDaysPerWeek = selectedDays;
                });
                await _userData.save();
                Navigator.pop(context);
              },
              child:
                  const Text('Save', style: TextStyle(color: AppColors.cyan)),
            ),
          ],
        ),
      ),
    );
  }
}
