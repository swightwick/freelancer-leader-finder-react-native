import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLeaders } from '@/hooks/leader-store';
import { Filters } from '@/types/leader';
import { Colors } from '@/constants/colors';
import { Circle, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { hairColorOptions } from '@/constants/hairColors';
import { attributeIcons, attributeNames } from '@/constants/attributeIcons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const attributeFilters = (Object.keys(attributeIcons) as Array<keyof typeof attributeIcons>).map(key => ({
  key,
  label: attributeNames[key],
  icon: attributeIcons[key],
}));

interface FilterSectionProps {
  onClearDismissed?: () => void;
}

export default function FilterSection({ onClearDismissed }: FilterSectionProps) {
  const { filters, updateFilter, clearFilters, filtersCollapsed, toggleFiltersCollapsed } = useLeaders();

  const handleToggleCollapsed = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleFiltersCollapsed();
  };

  const renderToggleFilter = (
    key: keyof Omit<Filters, 'hair'>,
    label: string,
    IconComponent: React.ComponentType<{ size: number; color: string }>
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          updateFilter(key, !value);
        }}
        activeOpacity={0.7}
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
      <View style={styles.header}>
        <Text style={styles.title}>Features</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleCollapsed} style={styles.clearButton} activeOpacity={0.7}>
            {filtersCollapsed ? <Eye size={16} color={Colors.textSecondary} /> : <EyeOff size={16} color={Colors.textSecondary} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); clearFilters(); onClearDismissed?.(); }} style={styles.clearButton} activeOpacity={0.7}>
            <Trash2 size={14} color={Colors.textSecondary} />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

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
              {hairColorOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.hairButton,
                    filters.hair === option.value && styles.hairButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateFilter('hair', option.value);
                  }}
                  activeOpacity={0.7}
                >
                  {option.value !== 'any' && option.value !== 'bald' && (
                    <Circle
                      size={12}
                      fill={option.color ?? ''}
                      color={option.color ?? ''}
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
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    textTransform: 'uppercase',
    letterSpacing: 3,
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
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  hairButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  hairButtonTextActive: {
    color: Colors.text,
  },
});
