import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import SendButton from "../../assets/icons/sendButton";
import DocumentPicker from "react-native-document-picker";
import BackgroundSVG from "../../assets/icons/BackgroundSVG";

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showCart, setShowCart] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const suggestions = [
    "Admissions",
    "Housing",
    "Majors",
    "Events",
    "Contact",
    "Bus Schedule",
  ];

  useEffect(() => {
    if (input.trim() === "" && messages.length === 0) {
      setShowCart(true);
    } else {
      setShowCart(false);
    }
  }, [input, messages]);

  const handleDislikePress = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), type: "feedback" }, // Add feedback card as a bot message
    ]);
  };
  const FeedbackCard = () => {
    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState("");

    return (
      <View style={styles.feedbackCard}>
        {/* Header */}
        <Text style={styles.feedbackTitle}>How can we do better?</Text>

        {/* Input Field */}
        <TextInput
          style={styles.feedbackInput}
          placeholder="Enter your feedback"
          placeholderTextColor="#aaa"
          value={feedback}
          onChangeText={setFeedback}
        />

        {/* Rating Selection */}
        <Text style={styles.feedbackText}>
          From 1-5 how accurate were the responses?
        </Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => setRating(num)}
              style={styles.ratingCircle}
            >
              <Text style={{ color: rating === num ? "#D81B60" : "white" }}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => console.log(feedback, rating)}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSetMessage = (input) => { 
    if (input.trim() !== "") {
                const userMessage = {
                  id: messages.length,
                  message: input,
                  type: "user",
                };

                const botReply = {
                  id: messages.length + 1,
                  message: `You said: "${input}". I'm still learning! 😊`,
                  type: "bot",
                };

                setMessages([...messages, userMessage, botReply]);
                setInput(""); // Clear input after sending
              }
  };
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const fileName = result[0].name;
      setInput(`Attached file: ${fileName} - send it?`);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error("Error picking file:", err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <BackgroundSVG />
      {showCart && (
        <>
          {/* Title & Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>I’m COLTIE SAGE</Text>
            <Text style={styles.subtitle}>
              Ready to chat? Just type your question and get answers! Need some
              ideas to get started?
            </Text>
          </View>
          {/* 2x2 Button Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setInput("I want to know more about COLTIE?");
                }}
              >
                <Ionicons name="help-circle" size={24} color="white" />
                <Text style={styles.cardTitle}>Ask a question</Text>
                <Text style={styles.cardSubtitle}>
                  “I want to know more about COLTIE?”
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={handleFilePick}>
                <Ionicons name="attach" size={24} color="white" />
                <Text style={styles.cardTitle}>Upload a file</Text>
                <Text style={styles.cardSubtitle}>
                  Use the upload button for feedback on your resume.
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setInput("Find a profile with similar research interests.");
                }}
              >
                <Ionicons name="people" size={24} color="white" />
                <Text style={styles.cardTitle}>Get matched</Text>
                <Text style={styles.cardSubtitle}>
                  “Find a profile with similar research interests.”
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, styles.highlightedCard]}
                onPress={() => {
                  setInput("What resources are available at my University?");
                }}
              >
                <Ionicons name="school" size={24} color="white" />
                <Text style={styles.cardTitle}>Find Support</Text>
                <Text style={styles.cardSubtitle}>
                  “What resources are available at my University?”
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {messages.length > 0 && (
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View>
              <View
                style={[
                  item.type !== "feedback" && styles.messageBubble,
                  item.type === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                {item.type === "feedback" && <FeedbackCard />}
                {item.type !== "feedback" && (
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    <HTMLView
                      value={`<p>${item.message}</p>`}
                      stylesheet={styles.messageText}
                    />
                  </Text>
                )}
              </View>
              {item.type === "bot" && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackAskText}>
                    How was this response?
                  </Text>
                  <View style={styles.feedbackIcons}>
                    <TouchableOpacity onPress={() => console.log("Thumbs Up")}>
                      <Ionicons
                        name="thumbs-up-outline"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDislikePress}>
                      <Ionicons
                        name="thumbs-down-outline"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
        />
      )}
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={suggestions}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionButton}
              onPress={() => handleSetMessage(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        {/* Attachment Button */}
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleFilePick}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

        {/* Rounded Text Input */}
        <View style={styles.roundedInput}>
          <TextInput
            style={styles.input}
            placeholder="Start typing..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSetMessage(input)}
            returnKeyType="send" // Makes return key look like "Send"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 250,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  gridContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 5,
  },
  highlightedCard: {
    borderColor: "#0094FF",
    borderWidth: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardSubtitle: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    padding: 10,
    bottom: 50,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D81B60", // Pink color for button
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  roundedInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // Light transparent white
    borderRadius: 20,
    paddingLeft: 15,
    height: 40,
  },
  input: {
    flex: 1,
    color: "black",
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    maxWidth: "75%",
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4669AA",
    borderTopRightRadius: 0,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#0A1019",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    p: {
      color: "#fff", // Ensures text inside <p> tags is white
    },
    color: "#fff", // Ensures general text color is white
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    margin: 10,
  },
  chatContainer: {
    paddingTop: 150,
    flexGrow: 1,
    padding: 15,
    borderRadius: 12,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
    marginLeft: 15,
    maxWidth: "65%",
  },

  feedbackAskText: {
    color: "#8C8C8C",
    fontSize: 10,
    fontWeight: "bold",
  },

  feedbackIcons: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: -10,
    gap: 15, // Space between thumbs up/down icons
  },
  feedbackCard: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 15,
    height: 400,
    marginVertical: 5,
    alignSelf: "flex-start",
    maxWidth: "100%",
    maxHeight: "100%",
  },

  feedbackTitle: {
    color: "#D81B60",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  feedbackInput: {
    width: "100px",
    height: 230,
    backgroundColor: "#fff",
    color: "black",
    padding: 10,
    marginBottom: 10,
  },

  feedbackText: {
    color: "black",
    marginBottom: 10,
  },

  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  ratingCircle: {
    width: 25,
    height: 25,
    borderRadius: 18,
    backgroundColor: "#D9D9D9",
    color: "#737373",
    justifyContent: "center",
    alignItems: "center",
  },

  submitButton: {
    backgroundColor: "#D81B60",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  submitText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center", // Ensure text inside is centered
  },
  suggestionsContainer: {
    position: "absolute",
    bottom:110,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  suggestionButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  suggestionText: {
    color: "#000",
    display: "flex",
    alignContent: "center",
    fontWeight: "bold",
  },
});

export default ChatbotScreen;
