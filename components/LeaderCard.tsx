import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';
import { attributeIcons } from '@/constants/attributeIcons';

interface LeaderCardProps {
  leader: Leader;
  onPress?: (leader: Leader) => void;
  onLongPress?: (leader: Leader) => void;
  staggerDelay?: number;
  animationKey?: string;
  fullWidth?: boolean;
  isDisabled?: boolean;
}

export default function LeaderCard({ leader, onPress, onLongPress, staggerDelay = 0, animationKey, fullWidth = false, isDisabled = false }: LeaderCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = fullWidth ? width - 32 : (width - 48) / 2;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Reset to 0 before paint so there's no flash
  useLayoutEffect(() => {
    fadeAnim.setValue(0);
  }, [animationKey]);

  // Start staggered fade after reset
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, staggerDelay);
    return () => {
      clearTimeout(timer);
      fadeAnim.stopAnimation();
    };
  }, [animationKey]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={() => onPress?.(leader)}
        onLongPress={() => onLongPress?.(leader)}
        delayLongPress={500}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel={`${leader.name}, ${leader.attributes.hair} hair`}
        accessibilityHint="Tap to view details, hold to dismiss"
      >
        <View style={[styles.imageContainer, { height: cardWidth * 0.8 }]}>
          <Image
            source={leader.image}
            style={[styles.image, isDisabled && styles.imageDisabled]}
            contentFit="cover"
            contentPosition={{ top: '5%' }}
            accessibilityLabel={`Portrait of ${leader.name}`}
          />
          {isDisabled && <View style={styles.greyscaleOverlay} />}
          {isDisabled && (
            <View style={[styles.disabledOverlay, { opacity: 0.8 }]}>
              <X size={cardWidth * 0.5} color="white" strokeWidth={2} />
            </View>
          )}
        </View>
        <View style={[styles.content, isDisabled && styles.contentDisabled]}>
          <Text style={[styles.name, isDisabled && styles.textDisabled]}>{leader.name}</Text>
          <View style={styles.attributes}>
            {Object.entries(attributeIcons).map(([key, IconComponent]) => {
              const hasAttribute = leader.attributes[key as keyof typeof attributeIcons];
              return hasAttribute ? (
                <IconComponent
                  key={key}
                  size={16}
                  color={Colors.iconPrimary}
                />
              ) : null;
            })}
          </View>
          <Text style={[styles.hairColor, isDisabled && styles.textDisabled]}>{leader.attributes.hair}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  attributes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
    minHeight: 16,
  },
  hairColor: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  imageDisabled: {
    opacity: 0.5,
  },
  greyscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(180,0,0,0.3)',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDisabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: Colors.textSecondary,
  },
});
