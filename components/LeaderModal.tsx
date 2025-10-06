import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { X, Gem, Glasses, Crown, Replace, Zap } from 'lucide-react-native';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';

interface LeaderModalProps {
  leader: Leader | null;
  visible: boolean;
  onClose: () => void;
}

const attributeIcons = {
  earrings: Gem,
  glasses: Glasses,
  hat: Crown,
  necklace: Replace,
  tattoo: Zap,
};

const attributeNames = {
  earrings: 'Earrings',
  glasses: 'Glasses',
  hat: 'Hat',
  necklace: 'Necklace',
  tattoo: 'Tattoo',
};

const hairColors = {
  black: '#1a1a1a',
  blonde: '#f5deb3',
  brown: '#8b4513',
  gray: '#808080',
  red: '#dc143c',
  bald: '#d4af37',
};

export default function LeaderModal({ leader, visible, onClose }: LeaderModalProps) {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.95, 500);

  if (!leader) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Text style={styles.headerTitle}>{leader.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={leader.image}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              contentFit="cover"
              placeholder="https://via.placeholder.com/300x300/333333/666666?text=Leader"
            />
          </View>

          
          <View style={[
            styles.hairPill,
            {
              backgroundColor: hairColors[leader.attributes.hair as keyof typeof hairColors] || Colors.textTertiary,
            },
          ]}>
            <Text style={styles.hairText}>
              Hair: {leader.attributes.hair.charAt(0).toUpperCase() + leader.attributes.hair.slice(1)}
            </Text>
          </View>
          
          <View style={styles.attributesContainer}>
            <View style={styles.attributesRow}>
              {Object.entries(attributeIcons).map(([key, IconComponent]) => {
                const hasAttribute = leader.attributes[key as keyof typeof attributeIcons];
                const attributeName = attributeNames[key as keyof typeof attributeNames];
                return (
                  <View key={key} style={styles.attributeIcon}>
                    <IconComponent
                      size={32}
                      color={hasAttribute ? Colors.iconPrimary : Colors.textTertiary}
                    />
                    <Text style={[
                      styles.attributeName,
                      { color: hasAttribute ? Colors.iconPrimary : Colors.textTertiary }
                    ]}>
                      {attributeName}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  hairPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  hairText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  attributesContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  attributesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  attributeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  attributeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  hairIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});