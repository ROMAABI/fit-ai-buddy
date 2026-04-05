import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyA0gKXQwNMU_o1l3vNPCfNqNu8i_TzsR7o',
    appId: '1:196130490803:web:748bb7dff37f24385363c6',
    messagingSenderId: '196130490803',
    projectId: 'fit-ai-buddy-30fc0',
    authDomain: 'fit-ai-buddy-30fc0.firebaseapp.com',
    storageBucket: 'fit-ai-buddy-30fc0.firebasestorage.app',
    measurementId: 'G-5D3XV00ZDP',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyA0gKXQwNMU_o1l3vNPCfNqNu8i_TzsR7o',
    appId: '1:196130490803:android:YOUR_ANDROID_APP_ID',
    messagingSenderId: '196130490803',
    projectId: 'fit-ai-buddy-30fc0',
    storageBucket: 'fit-ai-buddy-30fc0.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyA0gKXQwNMU_o1l3vNPCfNqNu8i_TzsR7o',
    appId: '1:196130490803:ios:YOUR_IOS_APP_ID',
    messagingSenderId: '196130490803',
    projectId: 'fit-ai-buddy-30fc0',
    storageBucket: 'fit-ai-buddy-30fc0.firebasestorage.app',
    iosBundleId: 'com.example.fitAiBuddy',
  );
}
