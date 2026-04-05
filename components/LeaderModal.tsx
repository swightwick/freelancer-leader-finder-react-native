import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';
import { attributeIcons, attributeNames } from '@/constants/attributeIcons';
import { hairColors } from '@/constants/hairColors';

interface LeaderModalProps {
  leaders: Leader[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  dismissedLeaders: Set<string>;
}

function LeaderPage({ leader, width, isDisabled }: { leader: Leader; width: number; isDisabled: boolean }) {
  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={leader.image}
          style={[styles.image, isDisabled && styles.imageDisabled]}
          contentFit="cover"
        />
        {isDisabled && <View style={styles.greyscaleOverlay} />}
        {isDisabled && (
          <View style={styles.disabledOverlay}>
            <X size={width * 0.4} color="white" strokeWidth={2} />
          </View>
        )}
      </View>

      <View style={[
        styles.hairPill,
        { backgroundColor: hairColors[leader.attributes.hair as keyof typeof hairColors] || Colors.textTertiary },
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
  );
}

export default function LeaderModal({ leaders, initialIndex, visible, onClose, dismissedLeaders }: LeaderModalProps) {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      // Scroll without animation so it starts at the right position
      flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [visible, initialIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  if (leaders.length === 0) return null;

  const currentLeader = leaders[currentIndex] ?? leaders[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient colors={['#720110', '#000000']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Text style={styles.headerTitle} numberOfLines={1}>{currentLeader.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={leaders}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <LeaderPage leader={item} width={width} isDisabled={dismissedLeaders.has(item.name)} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          initialScrollIndex={initialIndex}
        />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#000000',
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginVertical: 20,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
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
});
