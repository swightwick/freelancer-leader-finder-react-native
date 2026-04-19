import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Lock, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { weaponsData, Weapon, safeCodes, SafeCode, levelOutfits } from '@/data/weapons';

const locationGradients: Record<string, string[]> = {
  'ambrose-island': ['#071219', '#19273b', '#414c64'],
  'bangkok': ['#382a29', '#775b4d', '#bb9076'],
  'berlin': ['#290d43', '#510e7d', '#9417c1'],
  'chongqing': ['#1f080e', '#682138', '#d86f9b'],
  'colorado': ['#32292e', '#573d3c', '#8e594f'],
  'dartmoor': ['#191714', '#332f30', '#46454a'],
  'dubai': ['#6e5c52', '#b7977f', '#ebcca8'],
  'haven': ['#3c5a63', '#7e908d', '#b3ccd6'],
  'hokkido': ['#2c3745', '#556871', '#abb3aa'],
  'marrakesh': ['#3e3e38', '#877656', '#d6bc86'],
  'mendoza': ['#231d14', '#60514d', '#ad917c'],
  'miami': ['#44352e', '#8a7566', '#b7bab0'],
  'mumbai': ['#3f3547', '#977a5f', '#e5b98d'],
  'new-york': ['#13191b', '#5b5548', '#ab9f81'],
  'paris': ['#1d171c', '#3f3232', '#866d63'],
  'santa-fortuna': ['#141c26', '#5f6854', '#89978c'],
  'sapienza': ['#244048', '#3b6e89', '#7a7a6d'],
  'sgail': ['#1d1f25', '#414249', '#ad7f52'],
  'whittleton-creek': ['#2e2930', '#755849', '#bf9e7f'],
};

const getLocationGradient = (locationName: string): string[] => {
  const key = locationName.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  const keyMap: Record<string, string> = {
    'haven-island': 'haven',
    'hokkaido': 'hokkido',
    'isle-of-sgail': 'sgail',
  };
  return locationGradients[keyMap[key] ?? key] ?? ['#1a1a1a', '#333333', '#555555'];
};

function WeaponItem({ weapon }: { weapon: Weapon }) {
  return (
    <View style={styles.weaponItem}>
      <Text style={styles.weaponName}>{weapon.name}</Text>
      <View style={styles.weaponNotesContainer}>
        <Text style={styles.weaponNotes}>{weapon.notes}</Text>
      </View>
    </View>
  );
}

function SafeCodesModal({ location, codes, onClose }: { location: string; codes: SafeCode[]; onClose: () => void }) {
  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Lock size={18} color={Colors.primary} />
            <Text style={styles.modalTitle}>{location} — Safe Codes</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
          {codes.map((item) => (
            <View key={item.label} style={styles.codeRow}>
              <Text style={styles.codeLabel}>{item.label}</Text>
              <Text style={styles.codeValue}>{item.code}</Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

export default function ItemsScreen() {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [safeModalLocation, setSafeModalLocation] = useState<string | null>(null);
  const blackOverlayAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const TRANSITION_DURATION = 150;

  const currentLocationData = weaponsData.find(loc => loc.location === selectedLocation);

  const playTransitionAnimation = useCallback((callback: () => void) => {
    Animated.sequence([
      Animated.timing(blackOverlayAnim, { toValue: 1, duration: TRANSITION_DURATION, useNativeDriver: true }),
      Animated.timing(blackOverlayAnim, { toValue: 0, duration: TRANSITION_DURATION, useNativeDriver: true }),
    ]).start();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, TRANSITION_DURATION);
  }, [blackOverlayAnim]);

  const handleBackToLocations = useCallback(() => {
    navigation.setOptions({ headerLeft: undefined });
    playTransitionAnimation(() => setSelectedLocation(null));
  }, [navigation, playTransitionAnimation]);

  const handleLocationSelect = useCallback((location: string) => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackToLocations}
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12, paddingBottom: 10 }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={Colors.text} />
          <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '500' }}>Back</Text>
        </TouchableOpacity>
      ),
    });
    playTransitionAnimation(() => setSelectedLocation(location));
  }, [navigation, handleBackToLocations, playTransitionAnimation]);

  const renderLocationItem = useCallback(({ item }: { item: typeof weaponsData[0] }) => {
    const gradient = getLocationGradient(item.location);
    return (
      <TouchableOpacity
        style={styles.locationCard}
        onPress={() => handleLocationSelect(item.location)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={gradient as [string, string, string]}
          style={styles.locationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.locationName}>{item.location}</Text>
          <View style={styles.locationCardRight}>
            <View style={styles.weaponCountBadge}>
              <Text style={styles.weaponCount}>{item.weapons.length}</Text>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [handleLocationSelect]);

  if (selectedLocation && currentLocationData) {
    const gradient = getLocationGradient(selectedLocation);
    const locationSafeCodes = safeCodes[selectedLocation];

    return (
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[styles.blackOverlay, { opacity: blackOverlayAnim }]}
        />
        <LinearGradient
          colors={gradient as [string, string, string]}
          style={styles.locationHeaderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.locationHeaderTitle}>{selectedLocation}</Text>
          {locationSafeCodes && (
            <TouchableOpacity
              onPress={() => setSafeModalLocation(selectedLocation)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Lock size={22} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          )}
        </LinearGradient>

        <ScrollView style={styles.fullPageScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.weaponList}>
            {currentLocationData.weapons.map((weapon, index) => (
              <WeaponItem
                key={`${selectedLocation}-${index}`}
                weapon={weapon}
              />
            ))}
          </View>
          {levelOutfits[selectedLocation] && (
            <View style={styles.outfitCard}>
              <Text style={styles.outfitLabel}>Unique Level Outfit</Text>
              <View style={styles.outfitValueContainer}>
                <Text style={styles.outfitName}>{levelOutfits[selectedLocation]}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {safeModalLocation && locationSafeCodes && (
          <SafeCodesModal
            location={safeModalLocation}
            codes={locationSafeCodes}
            onClose={() => setSafeModalLocation(null)}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.blackOverlay, { opacity: blackOverlayAnim }]}
      />
      <FlatList
          data={weaponsData}
          keyExtractor={(item) => item.location}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 5,
  },
  locationCard: {
    overflow: 'hidden',
    marginBottom: 5,
  },
  locationGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  locationCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weaponCountBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weaponCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  locationHeaderGradient: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationHeaderTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#ffffff',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  fullPageScroll: {
    flex: 1,
  },
  weaponList: {
    marginTop: 16,
    paddingBottom: 0,
  },
  weaponItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weaponName: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  weaponNotesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  weaponNotes: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  outfitCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outfitLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  outfitValueContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  outfitName: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  blackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  codeLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  codeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
});
