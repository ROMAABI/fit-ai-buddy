class UserData {
  static final UserData _instance = UserData._internal();

  factory UserData() {
    return _instance;
  }

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
}
