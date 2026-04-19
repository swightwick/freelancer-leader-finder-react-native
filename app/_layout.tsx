import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Animated } from "react-native";
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

function RootLayoutNav() {
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const triggerTabFade = () => {
    Haptics.selectionAsync();
    overlayAnim.stopAnimation();
    overlayAnim.setValue(1);
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LeaderContext>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.primary, Colors.shadow]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ThemeProvider value={theme}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenListeners={{ tabPress: triggerTabFade }}
          screenOptions={{
            sceneStyle: { backgroundColor: 'transparent' },
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 17,
              letterSpacing: 3,
              paddingBottom: 10,
            },
            headerShadowVisible: false,
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="finder" options={{ headerTitle: 'LEADER FINDER' }} />
          <Tabs.Screen name="items" options={{ headerTitle: 'ITEMS', lazy: false }} />
          <Tabs.Screen name="about" options={{ title: 'ABOUT' }} />
        </Tabs>
        </ThemeProvider>
        <Animated.View
          pointerEvents="none"
          style={[styles.overlay, { opacity: overlayAnim }]}
        />
      </LinearGradient>
    </LeaderContext>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.shadow,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.shadow,
    zIndex: 999,
  },
});
