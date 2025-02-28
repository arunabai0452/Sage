import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import SageBackground from "../../../assets/Background/SageBackground.svg";

const ChatBotBanner = ({navigation}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const toggleBanner = () => {
    Animated.timing(scaleAnim, {
      toValue: isMinimized ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsMinimized(!isMinimized));
  };

  return (
    <View style={styles.container}>
      {!isMinimized ? (
        <Animated.View
          style={[styles.banner, { transform: [{ scale: scaleAnim }] }]}
        >
          <SageBackground />
          <View style={styles.textContainer}>
            <Text style={styles.title}>COLTIE SAGE</Text>
            <Text style={styles.subtitle}>
              I can assist with your questions, offer support, and chat anytime.
            </Text>

            {/* Chat Button */}
            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("Chatbot")}>
              <Text style={styles.chatButtonText}>Start Chat</Text>
            </TouchableOpacity>

            {/* Minimize Button */}
            <TouchableOpacity
              style={styles.minimizeButton}
              onPress={toggleBanner}
            >
              <AntDesign name="arrowsalt" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("Chatbot")}>
          <ImageBackground
            source={require("../../../assets/img/SageButton.png")}
            style={styles.imageBackground} // Make sure ImageBackground has a style with size
            resizeMode="cover" // You can change to "contain" if you want to fit the image inside
          >
            {/* You can add additional content here if needed */}
          </ImageBackground>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    top: 100,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    top: -50,
    left: 20,
    right: 0,
    alignItems: "left",
  },
  banner: {
    width: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    flex: 1,
    overflow: "hidden",
    position: "relative",
    elevation: 5, // Shadow for Android
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 80,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    width: "60%",
    color: "white",
    alignSelf: "left",
    marginVertical: 5,
  },
  chatButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "left",
  },
  chatButtonText: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
  minimizeButton: {
    position: "absolute",
    top: 60,
    right: 5,
    padding: 5,
  },
  floatingButton: {
    width: 60, // Define button width
    height: 60, // Define button height
    borderRadius: 35, // Optional: Rounded corners
    position: "absolute",
    top: 500,
    right: 5,
    overflow: "hidden", // Ensure content stays within rounded corners
    backgroundColor: "transparent", // Make sure no background color is blocking the button
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  meditatingMan: {
    position: "absolute",
    bottom: -10,
    right: 15,
  },
});

export default ChatBotBanner;
