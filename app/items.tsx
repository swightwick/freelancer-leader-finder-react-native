import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import TabBar from '@/components/TabBar';
import { Colors } from '@/constants/colors';
import { weaponsData, Weapon } from '@/data/weapons';

// Import images at the top level
const locationImages = {
  'ambrose-island': require('../assets/locations/ambrose-island.jpg'),
  bangkok: require('../assets/locations/bangkok.jpg'),
  berlin: require('../assets/locations/berlin.jpg'),
  chongqing: require('../assets/locations/chongqing.jpg'),
  colorado: require('../assets/locations/colorado.jpg'),
  dartmoor: require('../assets/locations/dartmoor.jpg'),
  dubai: require('../assets/locations/dubai.jpg'),
  haven: require('../assets/locations/haven.jpg'),
  hokkido: require('../assets/locations/hokkido.jpg'),
  marrakesh: require('../assets/locations/marrakesh.jpg'),
  mendoza: require('../assets/locations/mendoza.jpg'),
  miami: require('../assets/locations/miami.jpg'),
  mumbai: require('../assets/locations/mumbai.jpg'),
  'new-york': require('../assets/locations/new-york.jpg'),
  paris: require('../assets/locations/paris.jpg'),
  'santa-fortuna': require('../assets/locations/santa-fortuna.jpg'),
  sapienza: require('../assets/locations/sapienza.jpg'),
  sgail: require('../assets/locations/sgail.jpg'),
  'whittleton-creek': require('../assets/locations/whittleton-creek.jpg'),
};

const getLocationImageUri = (locationName: string) => {
  const imageName = locationName.toLowerCase().replace(/ /g, '-').replace(/'/g, '');

  const imageMap: { [key: string]: any } = {
    'ambrose-island': locationImages['ambrose-island'],
    'bangkok': locationImages.bangkok,
    'berlin': locationImages.berlin,
    'chongqing': locationImages.chongqing,
    'colorado': locationImages.colorado,
    'dartmoor': locationImages.dartmoor,
    'dubai': locationImages.dubai,
    'haven-island': locationImages.haven,
    'hokkaido': locationImages.hokkido,
    'isle-of-sgail': locationImages.sgail,
    'marrakesh': locationImages.marrakesh,
    'mendoza': locationImages.mendoza,
    'miami': locationImages.miami,
    'mumbai': locationImages.mumbai,
    'new-york': locationImages['new-york'],
    'paris': locationImages.paris,
    'santa-fortuna': locationImages['santa-fortuna'],
    'sapienza': locationImages.sapienza,
    'whittleton-creek': locationImages['whittleton-creek'],
  };

  return imageMap[imageName] || null;
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
    const locationImage = getLocationImageUri(selectedLocation);

    return (
      <>
        <View style={styles.container}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.blackOverlay,
              {
                opacity: blackOverlayAnim,
              }
            ]}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLocations}
          >
            <Text style={styles.backButtonText}>← Back to Locations</Text>
          </TouchableOpacity>

          {locationImage && (
            <View style={styles.locationHeaderImageContainer}>
              <Image
                source={locationImage}
                style={styles.locationHeaderImage}
                contentFit="cover"
              />
              <View style={styles.locationHeaderOverlay}>
                <Text style={styles.locationHeaderTitle}>{selectedLocation}</Text>
              </View>
            </View>
          )}

          <ScrollView style={styles.fullPageScroll} showsVerticalScrollIndicator={false}>
            {!locationImage && (
              <Text style={styles.locationTitle}>{selectedLocation}</Text>
            )}

            <View style={styles.weaponList}>
              {currentLocationData.weapons.map((weapon, index) => {
                const isSelected = selectedWeapon?.name === weapon.name;
                const expandAnim = getWeaponExpandAnim(weapon.name);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.weaponItem,
                      isSelected && styles.weaponItemSelected
                    ]}
                    onPress={() => handleWeaponPress(weapon)}
                  >
                    <Text style={styles.weaponName}>
                      {weapon.name}
                    </Text>
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
                          }
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
        <TabBar />
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.blackOverlay,
            {
              opacity: blackOverlayAnim,
            }
          ]}
        />
        <FlatList
          data={weaponsData}
          keyExtractor={(item) => item.location}
          renderItem={({ item }) => {
            const locationImage = getLocationImageUri(item.location);
            return (
              <TouchableOpacity
                style={styles.locationCard}
                onPress={() => handleLocationSelect(item.location)}
              >
                {locationImage && (
                  <Image
                    source={locationImage}
                    style={styles.locationImage}
                    contentFit="cover"
                  />
                )}
                <View style={[styles.locationCardContent, locationImage && styles.locationCardContentWithImage]}>
                  <View>
                    <Text style={styles.locationName}>{item.location}</Text>
                    <Text style={styles.weaponCount}>{item.weapons.length} weapons</Text>
                  </View>
                  <ChevronRight size={24} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  listContent: {
    padding: 16,
  },
  locationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  locationImage: {
    width: '100%',
    height: 160,
  },
  locationCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  locationCardContentWithImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  weaponCount: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  locationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    padding: 16,
    paddingBottom: 8,
  },
  locationHeaderImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  locationHeaderImage: {
    width: '100%',
    height: '100%',
  },
  locationHeaderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  locationHeaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    backgroundColor: Colors.surface,
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
