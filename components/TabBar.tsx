import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Package, Search, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const TABS = [
  { name: 'finder', label: 'Finder', icon: Search },
  { name: 'items', label: 'Items', icon: Package },
  { name: 'about', label: 'About', icon: Info },
];

type Props = {
  state: { index: number; routes: Array<{ name: string; key: string }> };
  navigation: { navigate: (name: string) => void };
};

export default function TabBar({ state, navigation }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = state.routes[state.index]?.name === tab.name;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              if (!isActive) navigation.navigate(tab.name);
            }}
          >
            <Icon size={24} color={isActive ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabLabel, { color: isActive ? Colors.primary : Colors.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
