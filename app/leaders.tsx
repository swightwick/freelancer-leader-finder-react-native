import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Info } from 'lucide-react-native';
import { useLeaders } from '@/hooks/leader-store';
import LeaderCard from '@/components/LeaderCard';
import FilterSection from '@/components/FilterSection';
import LeaderModal from '@/components/LeaderModal';
import InfoModal from '@/components/InfoModal';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';

export default function LeaderFinderScreen() {
  const navigation = useNavigation();
  const { leaders, filteredCount, totalCount, filters } = useLeaders();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const animatedValues = useRef<Map<string, Animated.Value>>(new Map()).current;
  const previousLeaders = useRef<Leader[]>([]);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setInfoModalVisible(true)}
          style={{ marginRight: 4, padding: 8 }}
        >
          <Info size={20} color={Colors.iconPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const currentLeaderNames = new Set(leaders.map(l => l.name));
    const previousLeaderNames = new Set(previousLeaders.current.map(l => l.name));
    
    // Reset all animations when filters change
    leaders.forEach((leader) => {
      if (!animatedValues.has(leader.name)) {
        animatedValues.set(leader.name, new Animated.Value(0));
      }
      
      // Always animate in when filters change or leader is new
      if (!previousLeaderNames.has(leader.name) || previousLeaders.current.length !== leaders.length) {
        const animValue = animatedValues.get(leader.name)!;
        animValue.setValue(0);
        Animated.spring(animValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
          delay: Math.random() * 100, // Stagger animations
        }).start();
      }
    });
    
    // Animate out leaders that are no longer visible
    previousLeaders.current.forEach((leader) => {
      if (!currentLeaderNames.has(leader.name)) {
        const animValue = animatedValues.get(leader.name);
        if (animValue) {
          Animated.timing(animValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            animatedValues.delete(leader.name);
          });
        }
      }
    });
    
    previousLeaders.current = leaders;
  }, [filtersKey, leaders, animatedValues]);

  const handleLeaderPress = (leader: Leader) => {
    setSelectedLeader(leader);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedLeader(null), 300);
  };

  const renderLeader = ({ item }: { item: Leader }) => {
    const animatedValue = animatedValues.get(item.name);
    return (
      <LeaderCard 
        leader={item} 
        onPress={handleLeaderPress}
        animatedValue={animatedValue}
      />
    );
  };

  const renderHeader = () => (
    <View>
      <FilterSection />
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredCount} of {totalCount} leaders
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No leaders found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters to see more results
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leaders}
        renderItem={renderLeader}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
      
      <LeaderModal
        leader={selectedLeader}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
      
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});