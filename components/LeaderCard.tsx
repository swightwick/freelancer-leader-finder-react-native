import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Gem, Glasses, Crown, Replace, Zap } from 'lucide-react-native';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';

interface LeaderCardProps {
  leader: Leader;
  onPress?: (leader: Leader) => void;
  animatedValue?: Animated.Value;
}

const attributeIcons = {
  earrings: Gem,
  glasses: Glasses,
  hat: Crown,
  necklace: Replace,
  tattoo: Zap,
};

export default function LeaderCard({ leader, onPress, animatedValue }: LeaderCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 48) / 2;
  
  const animatedStyle = animatedValue ? {
    opacity: animatedValue,
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      })
    }]
  } : {};
  
  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity 
        style={[styles.card, { width: cardWidth }]}
        onPress={() => onPress?.(leader)}
        activeOpacity={0.8}
      >
        <View style={[styles.imageContainer, { height: cardWidth * 0.8 }]}>
          <Image
            source={{ uri: leader.image }}
            style={styles.image}
            contentFit="cover"
            placeholder="https://via.placeholder.com/120x120/333333/666666?text=Leader"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{leader.name}</Text>
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
          <Text style={styles.hairColor}>{leader.attributes.hair}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
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
});