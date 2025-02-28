import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ message, sender }) => {
  const isUser = sender === 'user';
  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3369FF",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "green",
  },
  messageText: {
    fontSize: 16,
    color: "red",
  },
});

export default ChatMessage;