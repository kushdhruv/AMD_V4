import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primary = Color(0xFFE11D48);
  static const Color secondary = Color(0xFFF43F5E);
  static const Color background = Color(0xFFFFF1F2);
  static const Color surface = Color(0xFFFFE4E6);
  static const Color text = Color(0xFF881337);

  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: background,
    colorScheme: ColorScheme.light(
        primary: primary,
        secondary: secondary,
        surface: surface,
        onSurface: text,
    ),
    textTheme: GoogleFonts.poppinsTextTheme().apply(
        bodyColor: text,
        displayColor: text,
    ),
    appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: text,
        elevation: 0,
    ),
  );
}
