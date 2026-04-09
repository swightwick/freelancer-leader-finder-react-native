import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLeaders } from '@/hooks/leader-store';
import LeaderCard from '@/components/LeaderCard';
import FilterSection from '@/components/FilterSection';
import LeaderModal from '@/components/LeaderModal';
import { Leader } from '@/types/leader';
import { Colors } from '@/constants/colors';

export default function LeaderFinderScreen() {
  const { leaders, filteredCount, totalCount, filters } = useLeaders();
  const [selectedLeaderIndex, setSelectedLeaderIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dismissedLeaders, setDismissedLeaders] = useState<Set<string>>(new Set());
  const animationKey = useMemo(() => JSON.stringify(filters), [filters]);
  const isClearingRef = useRef(false);

  useEffect(() => {
    isClearingRef.current = false;
  }, [animationKey]);

  const handleLeaderLongPress = useCallback((leader: Leader) => {
    setDismissedLeaders(prev => {
      const next = new Set(prev);
      if (next.has(leader.name)) {
        next.delete(leader.name);
      } else {
        next.add(leader.name);
      }
      return next;
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderLeader = ({ item, index }: { item: Leader; index: number }) => (
    <LeaderCard
      leader={item}
      onPress={() => { setSelectedLeaderIndex(index); setModalVisible(true); }}
      onLongPress={handleLeaderLongPress}
      staggerDelay={isClearingRef.current ? 0 : Math.min(index, 3) * 80}
      animationKey={animationKey}
      isDisabled={dismissedLeaders.has(item.name)}
    />
  );

  const renderHeader = () => (
    <View>
      <FilterSection onClearDismissed={() => { isClearingRef.current = true; setDismissedLeaders(new Set()); }} />
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
        extraData={dismissedLeaders}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        initialNumToRender={100}
        maxToRenderPerBatch={100}
        windowSize={21}
      />
      <LeaderModal
        leaders={leaders}
        initialIndex={selectedLeaderIndex}
        visible={modalVisible}
        onClose={handleCloseModal}
        dismissedLeaders={dismissedLeaders}
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
