import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
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
        colors={['#720110', '#000000']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ThemeProvider value={theme}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenListeners={{ tabPress: triggerTabFade }}
          screenOptions={{
            lazy: false,
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
          <Tabs.Screen name="finder" options={{ headerTitle: 'LEADER FINDER', lazy: true }} />
          <Tabs.Screen name="items" options={{ headerTitle: 'ITEMS' }} />
          <Tabs.Screen name="about" options={{ title: 'ABOUT', lazy: true }} />
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
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 999,
  },
});
