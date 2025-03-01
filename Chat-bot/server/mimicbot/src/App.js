import React, { useState, useEffect, useRef } from "react";
import AC from "agora-chat"; 

function App() {
  const appKey = "411303875#1502849";
  const mimicbotUsername = "mimicbot";
  const mimicbotPassword = "mimicbot"; 
  const targetUser = "user123";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const chatClient = useRef(null);
  const isLoggingIn = useRef(false); 

  const addLog = (logMessage) => {
    setLogs((prev) => [...prev, logMessage]);
    console.log(logMessage);
  };

  const displayMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  // Fetch token from Agora’s REST API.
  const fetchToken = async () => {
    try {
      if (isLoggingIn.current) return; 
      isLoggingIn.current = true;

      const url = `https://a41.chat.agora.io/411303875/1502849/token`;
      addLog(`🔄 Fetching token for ${mimicbotUsername} from ${url}...`);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username: mimicbotUsername,
          password: mimicbotPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token fetch failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      addLog("✅ Token fetched successfully.");
      return data.access_token;
    } catch (error) {
      addLog(`❌ Error fetching token: ${error.message}`);
      return null;
    } finally {
      isLoggingIn.current = false;
    }
  };

  // Log out any existing session.
  const logoutMimicbot = async () => {
    if (chatClient.current) {
      try {
        addLog("🔴 Logging out mimicbot...");
        await chatClient.current.close();
        setIsLoggedIn(false);
        addLog("✅ Logged out successfully.");
      } catch (error) {
        addLog(`❌ Error logging out: ${error.message}`);
      }
    }
  };

  // Login mimicbot with the fetched token.
  const loginMimicbot = async () => {
    try {
      const token = await fetchToken();
      if (!token) {
        addLog("❌ Failed to obtain token.");
        return;
      }

      await logoutMimicbot();

      chatClient.current = new AC.connection({ appKey });

      chatClient.current.addEventHandler("chatEvents", {
        onConnected: () => {
          setIsLoggedIn(true);
          addLog("✅ Connected to Agora Chat.");
        },
        onDisconnected: () => {
          setIsLoggedIn(false);
          addLog("❌ Disconnected from Agora Chat.");
        },
        onTextMessage: (msg) => {
          addLog(`📩 Received from ${msg.from}: ${msg.msg}`);
          displayMessage(msg.from, msg.msg);
          if (msg.from === targetUser) {
            callWebhook(msg.msg);
          }
        },
        onError: (error) => {
          if (error.message.includes("already logged on another device")) {
            addLog("⚠️ Duplicate login detected. Logging out and retrying...");
            logoutMimicbot().then(() => loginMimicbot());
          } else {
            addLog(`❌ Error: ${error.message}`);
          }
        },
        onTokenWillExpire: async () => {
          addLog("⚠️ Token will expire soon.");
          const newToken = await fetchToken();
          if (newToken) {
            await chatClient.current.renewAgoraToken(newToken);
            addLog("✅ Token renewed successfully.");
          }
        },
        onTokenExpired: async () => {
          addLog("⛔ Token expired.");
          const newToken = await fetchToken();
          if (newToken) {
            await chatClient.current.renewAgoraToken(newToken);
            addLog("✅ Token renewed successfully.");
          }
        },
      });

      addLog(`🔑 Logging in as ${mimicbotUsername}...`);
      await chatClient.current.open({
        user: mimicbotUsername,
        accessToken: token,
      });
      addLog("✅ Mimicbot logged in successfully.");
    } catch (error) {
      addLog(`❌ Login error: ${error.message}`);
    }
  };

  const callWebhook = async (receivedMessage) => {
    try {
      const webhookUrl = "http://localhost:5001/webhook"; 
      addLog(`🔄 Calling webhook with message: ${receivedMessage}`);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: targetUser,
          content: receivedMessage,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook call failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
      const data = await response.json();
      addLog(`✅ Webhook reply: ${data.reply}`);
      await sendMessageToPeer(targetUser, data.reply);
    } catch (error) {
      addLog(`❌ Error calling webhook: ${error.message}`);
    }
  };

  // Send message from mimicbot to targetUser.
  const sendMessageToPeer = async (toUser, text) => {
    try {
      const message = AC.message.create({
        chatType: "singleChat",
        type: "txt",
        to: toUser,
        msg: text,
      });
      await chatClient.current.send(message);
      addLog(`✅ Sent message to ${toUser}: ${text}`);
    } catch (error) {
      addLog(`❌ Error sending message: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    displayMessage(mimicbotUsername, input);
    await sendMessageToPeer(targetUser, input);
    setInput("");
  };

  // Auto-login on component mount.
  useEffect(() => {
    loginMimicbot();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Mimicbot Agora Chat Client</h2>
      {isLoggedIn ? (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "auto",
              padding: "10px",
              background: "#fff",
              marginBottom: "20px",
            }}
          >
            {messages.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ width: "70%", padding: "10px" }}
          />
          <button onClick={handleSendMessage} style={{ padding: "10px 20px" }}>
            Send
          </button>
        </>
      ) : (
        <p>Logging in as Mimicbot...</p>
      )}
      <h3>Logs</h3>
      <div
        style={{
          border: "1px solid #ccc",
          height: "150px",
          overflowY: "auto",
          padding: "10px",
          background: "#eee",
        }}
      >
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}

export default App;