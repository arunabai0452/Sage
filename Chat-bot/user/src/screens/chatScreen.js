import React  from "react";
import { StyleSheet, View } from "react-native";
import ChatBotBanner from "../components/ChatbotBanner/ChatbotBanner";
import BackgroundSVG from "../../assets/icons/BackgroundSVG";
const ChatScreen = ({ navigation }) => {
 return (
   <View style={styles.container}>
     <BackgroundSVG style={styles.svgBackground} />
     <View style={styles.content}> 
         <ChatBotBanner navigation={navigation} />
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A121D", // Base background color
  },
  svgBackground: {
    position: "absolute", // Ensures it covers the entire screen
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1, // Ensures content takes up available space
  },
});

export default ChatScreen;
