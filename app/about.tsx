import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Colors } from '@/constants/colors';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is this?</Text>
          <Text style={styles.sectionText}>
            The Freelancer Leader Finder is a fan-made tool designed to help players of the Hitman video game series identify targets and their characteristics. This app provides a visual reference guide for various targets in the game, allowing you to filter by different attributes like accessories, hair color, and other distinguishing features.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to use</Text>
          <Text style={styles.sectionText}>
            • Use the filter toggles to specify which attributes a target has{'\n'}
            • Filter by hair color using the color buttons{'\n'}
            • Browse through the filtered results to find matching targets{'\n'}
            • Tap on any target card to view detailed information{'\n'}
            • Press and hold a leader card to eliminate them from your choices — they will be greyed out with a red overlay{'\n'}
            • Press and hold again to restore a dismissed leader{'\n'}
            • Tap Clear All to reset both filters and dismissed leaders
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Copyright Disclaimer</Text>
          <Text style={styles.sectionText}>
            This application is a fan-created tool and is not affiliated with, endorsed by, or officially connected to IO Interactive, Square Enix, or any other entities associated with the Hitman video game series.
          </Text>
          <Text style={styles.sectionText}>
            All game-related content, characters, names, marks, emblems, and images are the property of their respective owners. This app is created for educational and entertainment purposes only, and no copyright infringement is intended.
          </Text>
          <Text style={styles.sectionText}>
            Hitman™ is a trademark of IO Interactive A/S. All rights reserved.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fair Use</Text>
          <Text style={styles.sectionText}>
            This application operates under the principles of fair use for educational and informational purposes. If you are a rights holder and have concerns about the content in this application, please contact the developer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL('https://leaderfinder.samwightwick.co.uk/privacy')}
          >
            <Text style={styles.buttonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL('https://leaderfinder.samwightwick.co.uk/terms')}
          >
            <Text style={styles.buttonText}>Terms of Use</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
