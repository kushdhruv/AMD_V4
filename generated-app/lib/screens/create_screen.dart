import 'package:flutter/material.dart';
import '../theme.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:share_plus/share_plus.dart';
import 'package:flutter/services.dart';

class CreateScreen extends StatefulWidget {
  const CreateScreen({super.key});

  @override
  State<CreateScreen> createState() => _CreateScreenState();
}

class _CreateScreenState extends State<CreateScreen> {
  final Map<String, TextEditingController> _controllers = {};
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    // Initialize controllers for text fields
    _controllers['event_name'] = TextEditingController();
    _controllers['date_loc'] = TextEditingController();
    _controllers['highlights'] = TextEditingController();
    _controllers['output'] = TextEditingController();
  }

  @override
  void dispose() {
    _controllers.forEach((_, controller) => controller.dispose());
    super.dispose();
  }

  void _handleAction(String action) {
    if (action.startsWith('navigate:')) {
      // Navigate to route
      final target = action.split(':')[1];
      Navigator.pushNamed(context, '/$target');
    } else if (action.startsWith('share:')) {
      // Smart Share: Try to find 'output' field, else default
      String textToShare = "Check out my event!";
      if (_controllers.containsKey('output')) {
          textToShare = _controllers['output']!.text;
      }
      Share.share(textToShare);
    } else if (action.startsWith('copy:')) {
      // Smart Copy: Try to find 'output' field, else default
      String textToCopy = "Copied Content";
      if (_controllers.containsKey('output')) {
          textToCopy = _controllers['output']!.text;
      }
      
      Clipboard.setData(ClipboardData(text: textToCopy));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Copied to clipboard!')),
      );
    } else if (action.startsWith('save_form:')) {
      // Collect data
      final data = _controllers.map((key, controller) => MapEntry(key, controller.text));
      // Show confirmation
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Form Submitted'),
          content: Text('Data: $data'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    } else if (action.startsWith('ai:')) {
       setState(() => _loading = true);
       final type = action.split(':')[1].split('_')[1]; // e.g. generate_announcement -> announcement
       
       // Collect all form data
       final data = _controllers.map((key, controller) => MapEntry(key, controller.text));
       
       try {
         final url = Uri.parse('http://10.0.2.2:3000/api/ai-proxy');
         final response = await http.post(
            url, 
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'type': type, 'data': data}),
         );

         if (response.statusCode == 200) {
             final result = jsonDecode(response.body)['result'];
             if (_controllers.containsKey('output')) {
                 _controllers['output']!.text = result;
             }
             if (mounted) {
               ScaffoldMessenger.of(context).showSnackBar(
                 const SnackBar(content: Text('AI Content Generated!')),
               );
             }
         } else {
             throw Exception('Failed to load AI response');
         }
       } catch (e) {
         if (mounted) {
            showDialog(
                context: context, 
                builder: (c) => AlertDialog(title: const Text('Error'), content: Text(e.toString()), actions: [TextButton(onPressed: () => Navigator.pop(c), child: const Text('OK'))])
            );
         }
       } finally {
         setState(() => _loading = false);
       }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Hype Builder'), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
        'Event Details',
        style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: null,
        ),
      ),SizedBox(height: 8),
              TextField(
        controller: _controllers['event_name'],
        decoration: InputDecoration(
            labelText: 'Event Name',
            hintText: 'TechFest',
            filled: true,
            fillColor: AppTheme.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        obscureText: false,
        maxLines: 1,
      ),SizedBox(height: 16),
              TextField(
        controller: _controllers['date_loc'],
        decoration: InputDecoration(
            labelText: 'When & Where',
            hintText: 'Tomorrow @ 10AM',
            filled: true,
            fillColor: AppTheme.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        obscureText: false,
        maxLines: 1,
      ),SizedBox(height: 16),
              TextField(
        controller: _controllers['highlights'],
        decoration: InputDecoration(
            labelText: 'Key Highlights',
            hintText: 'Free T-shirts, Pizza...',
            filled: true,
            fillColor: AppTheme.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        obscureText: false,
        maxLines: 1,
      ),SizedBox(height: 16),
              Text(
        'Style',
        style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: null,
        ),
      ),SizedBox(height: 8),
              Row(
            spacing: 8,
            children: [
                Expanded(child: SizedBox(
        width: null,
        child: ElevatedButton(
            onPressed: isAI && _loading ? null : () => _handleAction('set_tone:formal'), 
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Professional'),
        ),
      )),
Expanded(child: SizedBox(
        width: null,
        child: ElevatedButton(
            onPressed: isAI && _loading ? null : () => _handleAction('set_tone:casual'), 
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Hype / Casual'),
        ),
      ))
            ],
        ),SizedBox(height: 12),
              SizedBox(
        width: double.infinity,
        child: ElevatedButton(
            onPressed: isAI && _loading ? null : () => _handleAction('ai:generate_announcement'), 
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: _loading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : Text('✨ Generate with AI'),
        ),
      ),SizedBox(height: 12),
              const Divider(),SizedBox(height: 12),
              Text(
        'Preview',
        style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: null,
        ),
      ),SizedBox(height: 8),
              TextField(
        controller: _controllers['output'],
        decoration: InputDecoration(
            labelText: 'Generated Text',
            hintText: 'Waiting for AI...',
            filled: true,
            fillColor: AppTheme.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        obscureText: false,
        maxLines: 5,
      ),SizedBox(height: 16),
              Row(
            spacing: 8,
            children: [
                Expanded(child: SizedBox(
        width: null,
        child: ElevatedButton(
            onPressed: isAI && _loading ? null : () => _handleAction('copy:text'), 
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Copy Text'),
        ),
      )),
Expanded(child: SizedBox(
        width: null,
        child: ElevatedButton(
            onPressed: isAI && _loading ? null : () => _handleAction('share:content'), 
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Share to Socials'),
        ),
      ))
            ],
        ),SizedBox(height: 12),
            ],
        ),
      ),
    );
  }
}
