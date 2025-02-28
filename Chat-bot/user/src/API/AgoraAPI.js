import { ChatClient, ChatOptions, ChatMessage } from 'react-native-agora-chat';

const AGORA_APP_KEY = '411303875#1502849';
const API_URL = "https://a41.chat.agora.io";

const chatClient = ChatClient.getInstance();


export async function fetchNewToken(username, password) {
    try {
      const url = `${API_URL}/411303875/1502849/token`;
      console.log("🔄 Fetching token from URL:", url);
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username: username,
          password: password
        }),
      });
  
      console.log("📡 Token fetch response:", response.status, response.statusText);
      const responseText = await response.text();
      console.log("Raw token fetch response body:", responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch new token: ${response.statusText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log("✅ Fetched new token:", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("❌ Error fetching new token:", error);
      return null;
    }
  }

  async function isUserLoggedIn() {
    try {
      const isLoggedIn = await chatClient.isLoginBefore();
      if (isLoggedIn) {
        console.log("✅ User is already logged in. Skipping login.");
        return true;
      }
    } catch (error) {
      console.error("❌ Error checking login status:", error);
    }
    return false;
  }

  export async function initializeAgoraChat() {
    try {
      const options = new ChatOptions({
        appKey: AGORA_APP_KEY,
        autoLogin: false,
        isHttpDNS: true,
        apiUrl: API_URL,
        server: "msync-api-41.chat.agora.io"
      });
    
      await chatClient.init(options);
      console.log("✅ ChatClient initialized successfully");
    
      // Token expiration handling
      chatClient.addConnectionListener({
        onTokenWillExpire: async () => {
          console.log("⚠️ Token will expire soon. Fetching a new token...");
          const newToken = await fetchNewToken("user123", "user123");
          if (newToken) {
            await chatClient.renewAgoraToken(newToken);
            console.log("✅ Token renewed successfully");
          }
        },
        onTokenDidExpire: async () => {
          console.log("⛔ Token expired! Fetching a new token...");
          const newToken = await fetchNewToken("user123", "user123");
          if (newToken) {
            await chatClient.renewAgoraToken(newToken);
            console.log("✅ Token renewed successfully");
          }
        }
      });
    
    } catch (error) {
      console.error("❌ Error initializing ChatClient:", error);
    }
  }

// Function to login with token (calls fetchNewToken if necessary)
export async function loginAgoraUserWithToken(username, password, token) {
    try {
      if (await isUserLoggedIn()) return;
    
      console.log(`🔑 Logging in as ${username}`);
    
      const token = await fetchNewToken(username, password);
      if (!token) throw new Error("Failed to obtain token for login");
    
      await chatClient.loginWithToken(username, token);
      console.log("✅ Logged in successfully");
    } catch (error) {
      console.error(`❌ Error logging in: ${JSON.stringify(error, null, 2)}`);
    }
  }

/**
 * Add listeners for connection and incoming messages.
 */
export function addAgoraListeners({ onConnected, onDisconnected, onMessageReceived }) {
  chatClient.addConnectionListener({
    onConnected: () => {
      console.log("✅ Connected to Agora Chat");
      onConnected && onConnected();
    },
    onDisconnected: () => {
      console.log("❌ Disconnected from Agora Chat");
      onDisconnected && onDisconnected();
    },
  });

  chatClient.chatManager.addMessageListener({
    onMessagesReceived: (messages) => {
      onMessageReceived && onMessageReceived(messages);
    },
  });
}

/**
 * Send a text message to a target user (for example, your bot).
 */
export async function sendMessageToBot(botUsername, text) {
    if (!chatClient.isConnected) {
      console.error("❌ Not connected. Cannot send message.");
      return;
    }
    try {
      const message = new ChatMessage({
        msgId: Date.now().toString(), // Unique ID
        chatType: 0, // 0 = single chat
        to: botUsername,
        body: { type: 'txt', content: text }, // Use correct message structure
        from: chatClient.currentUserName,
      });
  
      await chatClient.chatManager.sendMessage(message);
      console.log(`✅ Sent message to ${botUsername}: ${text}`);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }


  