import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLeaders } from '@/hooks/leader-store';
import { Filters } from '@/types/leader';
import { Colors } from '@/constants/colors';
import { 
  Gem, 
  Glasses, 
  Crown, 
  Replace, 
  Zap,
  Circle,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';

const hairOptions = [
  { label: 'Any', value: 'any' as const, color: Colors.textTertiary },
  { label: 'Black', value: 'black' as const, color: '#1a1a1a' },
  { label: 'Blonde', value: 'blonde' as const, color: '#f4d03f' },
  { label: 'Brown', value: 'brown' as const, color: '#8b4513' },
  { label: 'Gray', value: 'gray' as const, color: '#808080' },
  { label: 'Red', value: 'red' as const, color: '#dc143c' },
  { label: 'Bald', value: 'bald' as const, color: Colors.textTertiary },
];

const attributeFilters = [
  { key: 'earrings' as const, label: 'Earrings', icon: Gem },
  { key: 'glasses' as const, label: 'Glasses', icon: Glasses },
  { key: 'hat' as const, label: 'Hat', icon: Crown },
  { key: 'necklace' as const, label: 'Necklace', icon: Replace },
  { key: 'tattoo' as const, label: 'Tattoo', icon: Zap },
];

export default function FilterSection() {
  const { filters, updateFilter, clearFilters, filtersCollapsed, toggleFiltersCollapsed } = useLeaders();

  const renderToggleFilter = (
    key: keyof Omit<Filters, 'hair'>,
    label: string,
    IconComponent: React.ComponentType<any>
  ) => {
    const value = filters[key];
    const isActive = value === true;
    
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.filterToggle,
          isActive && styles.filterToggleActive,
          isActive && styles.filterToggleHas,
        ]}
        onPress={() => {
          updateFilter(key, !value);
        }}
      >
        <IconComponent 
          size={16} 
          color={isActive ? Colors.iconPrimary : Colors.textSecondary}
        />
        <Text style={[
          styles.filterToggleText,
          isActive && styles.filterToggleTextActive,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, filtersCollapsed && styles.containerCollapsed]}>
      <TouchableOpacity 
        style={[styles.header, filtersCollapsed && styles.headerCollapsed]}
        onPress={toggleFiltersCollapsed}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>Filters</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          {filtersCollapsed ? (
            <ChevronDown size={20} color={Colors.text} />
          ) : (
            <ChevronUp size={20} color={Colors.text} />
          )}
        </View>
      </TouchableOpacity>

      {!filtersCollapsed && (
        <>
          <View style={styles.filtersGrid}>
            {attributeFilters.map((filter) => 
              renderToggleFilter(filter.key, filter.label, filter.icon)
            )}
          </View>
          
          <View style={styles.hairSection}>
            <Text style={styles.sectionTitle}>Hair Color</Text>
            <View style={styles.hairGrid}>
              {hairOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.hairButton,
                    filters.hair === option.value && styles.hairButtonActive,
                  ]}
                  onPress={() => updateFilter('hair', option.value)}
                >
                  {option.value !== 'any' && option.value !== 'bald' && (
                    <Circle 
                      size={12} 
                      fill={option.color}
                      color={option.color}
                      style={styles.hairColorIndicator}
                    />
                  )}
                  <Text
                    style={[
                      styles.hairButtonText,
                      filters.hair === option.value && styles.hairButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerCollapsed: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerCollapsed: {
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  filterToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterToggleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  filterToggleHas: {
    backgroundColor: Colors.primary + '15',
  },
  filterToggleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterToggleTextActive: {
    color: Colors.text,
  },
  hairSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  hairGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hairButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hairColorIndicator: {
    marginRight: 2,
  },
  hairButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hairButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  hairButtonTextActive: {
    color: Colors.text,
  },
});