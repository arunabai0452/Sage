import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Icons for back & refresh
import ChatScreen from "./src/screens/chatScreen";
import ChatbotScreen from "./src/screens/chatBotScreen";
import BackgroundSVG from "./assets/icons/BackgroundSVG";

const Stack = createStackNavigator();

function CustomHeader({ navigation }) {
  return (
    <View style={styles.headerWrapper}>
      {/* Transparent Overlay */}
      <View style={styles.headerOverlay} />
      <View style={styles.headerContainer}>
        {/* Left - Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        {/* Center - Profile Image & Name */}
        <View style={styles.headerTitle}>
          <Image source={require("./assets/img/SageButton.png")} style={styles.profileImage} />
          <Text style={styles.headerText}>COLTIE SAGE</Text>
        </View>
        {/* Right - Refresh Button */}
        <TouchableOpacity onPress={() => console.log("History/Refresh action")} style={styles.headerButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Global Background */}
      <BackgroundSVG style={styles.svgBackground} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Chatbot"
            component={ChatbotScreen}
            options={({ navigation }) => ({
              header: () => <CustomHeader navigation={navigation} />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerOverlay: {
    position: "absolute",
    width: "100%",
    height: 150, // Adjust to fit header height
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 80, // Space for status bar
    paddingBottom: 10,
    backgroundColor: "transparent", // Makes header transparent
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 35,
    marginRight: 8,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerButton: {
    padding: 10,
  },
});