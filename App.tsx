import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ProfileScreen from "./screens/ProfileScreen";
import DashboardScreen from "./screens/DashboardScreen";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import LoginScreen from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Анимированная иконка для табов
const AnimatedIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Ionicons 
        name={name as any} 
        size={26} 
        color={focused ? "#4A90E2" : "#888"} 
      />
    </Animated.View>
  );
};

// Кастомный компонент для фона таб-бара
const CustomTabBarBackground = () => (
  <LinearGradient
    colors={['#FFFFFF', '#F5F5F5']}
    style={StyleSheet.absoluteFillObject}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  />
);

// Кастомный индикатор активной вкладки
const ActiveTabIndicator = ({ focused }: { focused: boolean }) => {
  const widthValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(widthValue, {
      toValue: focused ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        height: 3,
        width: widthValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
        backgroundColor: '#4A90E2',
        borderRadius: 3,
        marginTop: 4,
      }}
    />
  );
};

// Стек с вкладками
const MainTabs = ({ route }: { route: any }) => {
  const { user, serverUrl } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarBackground: () => <CustomTabBarBackground />,
      }}
    >
      <Tab.Screen
        name="Главная"
        component={HomeScreen}
        initialParams={{ user, serverUrl }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedIcon name="home" focused={focused} />
              <ActiveTabIndicator focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Карта"
        component={MapScreen}
        initialParams={{ user, serverUrl }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedIcon name="map" focused={focused} />
              <ActiveTabIndicator focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Каталог"
        component={DashboardScreen}
        initialParams={{ user, serverUrl }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedIcon name="book" focused={focused} />
              <ActiveTabIndicator focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Профиль"
        component={ProfileScreen}
        initialParams={{ user, serverUrl }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedIcon name="person" focused={focused} />
              <ActiveTabIndicator focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Главная точка входа
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;