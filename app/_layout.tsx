import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LeaderContext } from "@/hooks/leader-store";
import { Colors } from "@/constants/colors";
import TabBar from "@/components/TabBar";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <LeaderContext>
      <LinearGradient
        colors={['#720110', '#000000']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Stack
          screenOptions={{
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="finder"
            options={{
              headerTitle: 'LEADER FINDER',
              animation: 'none',
            }}
          />
          <Stack.Screen name="items" options={{ title: 'ITEMS', animation: 'none' }} />
          <Stack.Screen name="about" options={{ title: 'ABOUT', animation: 'none' }} />
        </Stack>
        <TabBar />
      </LinearGradient>
    </LeaderContext>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
