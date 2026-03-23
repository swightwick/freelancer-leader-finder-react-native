import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { LeaderContext } from "@/hooks/leader-store";
import { Colors } from "@/constants/colors";
import TabBar from "@/components/TabBar";

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

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
        <ThemeProvider value={theme}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          screenOptions={{
            animation: 'fade',
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="finder" options={{ headerTitle: 'LEADER FINDER' }} />
          <Tabs.Screen name="items" options={{ title: 'ITEMS' }} />
          <Tabs.Screen name="about" options={{ title: 'ABOUT' }} />
        </Tabs>
        </ThemeProvider>
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
