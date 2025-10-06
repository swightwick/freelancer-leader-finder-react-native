import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Package, Search, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Finder', path: '/finder', icon: Search },
    { name: 'Items', path: '/items', icon: Package },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tab}
            onPress={() => router.push(tab.path as any)}
          >
            <Icon
              size={24}
              color={isActive ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? Colors.primary : Colors.textSecondary },
              ]}
            >
              {tab.name}
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
