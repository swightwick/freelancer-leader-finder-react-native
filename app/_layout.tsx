import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import { LeaderContext } from "@/hooks/leader-store";
import { Colors } from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <LeaderContext>
      <Stack 
        screenOptions={{ 
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="leaders" 
          options={{ 
            headerTitle: () => (
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: Colors.text,
                textAlign: 'left',
                alignSelf: 'flex-start',
                flex: 1,
                marginLeft: -10,
              }}>
                Freelancer Leader Finder
              </Text>
            ),
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.text,
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
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