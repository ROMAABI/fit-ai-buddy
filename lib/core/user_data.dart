import 'package:shared_preferences/shared_preferences.dart';

class UserData {
  static final UserData _instance = UserData._internal();

  factory UserData() => _instance;
  UserData._internal();

  String name = 'User';
  String sex = 'Male';
  int age = 25;
  double weight = 70.0;
  int height = 175;
  int trainingDaysPerWeek = 5;
  String firstDayOfWeek = 'SUNDAY';
  String objective = 'Build Muscle';
  String fitnessLevel = 'Intermediate';
  String initials = 'U';
  String email = '';
  String photoUrl = '';

  static const String _keyName = 'user_name';
  static const String _keySex = 'user_sex';
  static const String _keyAge = 'user_age';
  static const String _keyWeight = 'user_weight';
  static const String _keyHeight = 'user_height';
  static const String _keyDays = 'user_days';
  static const String _keyFirstDay = 'user_first_day';
  static const String _keyObjective = 'user_objective';
  static const String _keyFitnessLevel = 'user_fitness_level';
  static const String _keyInitials = 'user_initials';
  static const String _keyEmail = 'user_email';
  static const String _keyPhotoUrl = 'user_photo_url';

  Future<void> save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyName, name);
    await prefs.setString(_keySex, sex);
    await prefs.setInt(_keyAge, age);
    await prefs.setDouble(_keyWeight, weight);
    await prefs.setInt(_keyHeight, height);
    await prefs.setInt(_keyDays, trainingDaysPerWeek);
    await prefs.setString(_keyFirstDay, firstDayOfWeek);
    await prefs.setString(_keyObjective, objective);
    await prefs.setString(_keyFitnessLevel, fitnessLevel);
    await prefs.setString(_keyInitials, initials);
    await prefs.setString(_keyEmail, email);
    await prefs.setString(_keyPhotoUrl, photoUrl);
  }

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    name = prefs.getString(_keyName) ?? 'User';
    sex = prefs.getString(_keySex) ?? 'Male';
    age = prefs.getInt(_keyAge) ?? 25;
    weight = prefs.getDouble(_keyWeight) ?? 70.0;
    height = prefs.getInt(_keyHeight) ?? 175;
    trainingDaysPerWeek = prefs.getInt(_keyDays) ?? 5;
    firstDayOfWeek = prefs.getString(_keyFirstDay) ?? 'SUNDAY';
    objective = prefs.getString(_keyObjective) ?? 'Build Muscle';
    fitnessLevel = prefs.getString(_keyFitnessLevel) ?? 'Intermediate';
    initials = prefs.getString(_keyInitials) ?? 'U';
    email = prefs.getString(_keyEmail) ?? '';
    photoUrl = prefs.getString(_keyPhotoUrl) ?? '';
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyName);
    await prefs.remove(_keySex);
    await prefs.remove(_keyAge);
    await prefs.remove(_keyWeight);
    await prefs.remove(_keyHeight);
    await prefs.remove(_keyDays);
    await prefs.remove(_keyFirstDay);
    await prefs.remove(_keyObjective);
    await prefs.remove(_keyFitnessLevel);
    await prefs.remove(_keyInitials);
    await prefs.remove(_keyEmail);
    await prefs.remove(_keyPhotoUrl);
    name = 'User';
    sex = 'Male';
    age = 25;
    weight = 70.0;
    height = 175;
    trainingDaysPerWeek = 5;
    firstDayOfWeek = 'SUNDAY';
    objective = 'Build Muscle';
    fitnessLevel = 'Intermediate';
    initials = 'U';
    email = '';
    photoUrl = '';
  }
}
