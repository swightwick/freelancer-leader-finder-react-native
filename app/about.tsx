import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import TabBar from '@/components/TabBar';
import { Colors } from '@/constants/colors';

export default function AboutScreen() {
  return (
    <>
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
            • Tap on any target card to view detailed information
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
      </ScrollView>
    </View>
    <TabBar />
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
});
