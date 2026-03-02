import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { weaponsData, Weapon } from '@/data/weapons';

const locationGradients: Record<string, string[]> = {
  'ambrose-island': ['#071219', '#19273b', '#414c64'],
  'bangkok': ['#382a29', '#775b4d', '#bb9076'],
  'berlin': ['#290d43', '#510e7d', '#9417c1'],
  'chongqing': ['#1f080e', '#682138', '#d86f9b'],
  'colorado': ['#32292e', '#573d3c', '#8e594f'],
  'dartmoor': ['#191714', '#332f30', '#46454a'],
  'dubai': ['#6e5c52', '#b7977f', '#ebcca8'],
  'haven': ['#3c5a63', '#7e908d', '#b3ccd6'],
  'hawkes-bay': ['#372d30', '#6e605f', '#b5b0a7'],
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

export default function ItemsScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blackOverlayAnim = useRef(new Animated.Value(0)).current;
  const weaponExpandAnim = useRef<Map<string, Animated.Value>>(new Map()).current;

  const currentLocationData = weaponsData.find(loc => loc.location === selectedLocation);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedLocation]);

  const handleLocationSelect = (location: string) => {
    Animated.sequence([
      Animated.timing(blackOverlayAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(blackOverlayAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setSelectedLocation(location);
      setSelectedWeapon(null);
    }, 150);
  };

  const handleBackToLocations = () => {
    Animated.sequence([
      Animated.timing(blackOverlayAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(blackOverlayAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setSelectedWeapon(null);
      setSelectedLocation(null);
    }, 150);
  };

  const handleWeaponPress = (weapon: Weapon) => {
    if (selectedWeapon?.name === weapon.name) {
      setSelectedWeapon(null);
    } else {
      setSelectedWeapon(weapon);
    }
  };

  const getWeaponExpandAnim = (weaponName: string) => {
    if (!weaponExpandAnim.has(weaponName)) {
      weaponExpandAnim.set(weaponName, new Animated.Value(0));
    }
    return weaponExpandAnim.get(weaponName)!;
  };

  useEffect(() => {
    if (selectedWeapon) {
      const anim = getWeaponExpandAnim(selectedWeapon.name);
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedWeapon]);

  if (selectedLocation && currentLocationData) {
    const gradient = getLocationGradient(selectedLocation);

    return (
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[styles.blackOverlay, { opacity: blackOverlayAnim }]}
        />
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLocations}>
          <Text style={styles.backButtonText}>← Back to Locations</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={gradient as [string, string, string]}
          style={styles.locationHeaderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.locationHeaderTitle}>{selectedLocation}</Text>
        </LinearGradient>

        <ScrollView style={styles.fullPageScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.weaponList}>
            {currentLocationData.weapons.map((weapon, index) => {
              const isSelected = selectedWeapon?.name === weapon.name;
              const expandAnim = getWeaponExpandAnim(weapon.name);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.weaponItem, isSelected && styles.weaponItemSelected]}
                  onPress={() => handleWeaponPress(weapon)}
                >
                  <Text style={styles.weaponName}>{weapon.name}</Text>
                  {isSelected && (
                    <Animated.View
                      style={[
                        styles.weaponNotesContainer,
                        {
                          opacity: expandAnim,
                          maxHeight: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 500],
                          }),
                        },
                      ]}
                    >
                      <Text style={styles.weaponNotes}>{weapon.notes}</Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
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
          renderItem={({ item }) => {
            const gradient = getLocationGradient(item.location);
            return (
              <TouchableOpacity
                style={styles.locationCard}
                onPress={() => handleLocationSelect(item.location)}
              >
                <LinearGradient
                  colors={gradient as [string, string, string]}
                  style={styles.locationGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.locationName}>{item.location}</Text>
                  <View style={styles.locationCardRight}>
                    <Text style={styles.weaponCount}>{item.weapons.length} weapons</Text>
                    <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
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
    padding: 16,
  },
  locationCard: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  locationGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  locationCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weaponCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  backButton: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  locationHeaderGradient: {
    width: '100%',
    height: 140,
    justifyContent: 'flex-end',
    padding: 20,
  },
  locationHeaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  fullPageScroll: {
    flex: 1,
  },
  weaponList: {
    marginTop: 16,
    paddingBottom: 20,
  },
  weaponItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weaponItemSelected: {
    borderColor: Colors.primary,
  },
  weaponName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
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
  blackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
});
