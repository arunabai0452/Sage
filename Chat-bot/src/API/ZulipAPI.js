const zulipBaseUrl = "https://sage.zulipchat.com/api/v1"; // Ensure the correct API path

const authHeader = {
  username: "arunabai0452@gmail.com", // Replace with your bot's email
  password: "tkaADRLSobzMLDM9uKef1yIsYiTcdmC2", // Replace with your bot's API key
};

// Function to check connection
export const checkConnection = async () => {
  try {
    const response = await fetch(`${zulipBaseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Basic authentication is used here
      headers: {
        Authorization:
          "Basic " + btoa(`${authHeader.username}:${authHeader.password}`),
      },
    });

    // Check for successful status code
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Connection successful:", data);
    return true;
  } catch (error) {
    console.error("Connection error:", error.message);
    return false;
  }
};

// Function to fetch messages from a stream/topic
export const getMessages = async (
  stream,
  topic,
  numBefore = 1,
  numAfter = 1
) => {
  try {
    // Construct the query parameters as part of the URL
    const params = new URLSearchParams({
      narrow: JSON.stringify([
        { operator: "is", operand: "private" }, // Filter for privchatbot-bot@sage.zulipchat.comate messages
        { operator: "sender", operand: "Sage_bot-bot@sage.zulipchat.com" }, // Replace with your bot's Zulip email
        //{ operator: "stream", operand: stream }, //{ operator: "topic", operand: topic },
      ]),
      anchor: "newest",
      num_before: numBefore.toString(),
      num_after: numAfter.toString(),
    });

    // Make the GET request with the query parameters in the URL
    const response = await fetch(
      `${zulipBaseUrl}/messages?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + btoa(`${authHeader.username}:${authHeader.password}`),
        },
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    // Attempt to parse the response as JSON
    const data = await response.json();

    if (!data.messages) {
      throw new Error('Invalid response format: "messages" field missing');
    }

    console.log("Messages fetched successfully:", data);
    return data.messages;
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }
};

export const sendMessage = async (stream, topic, content) => {
  try {
    // Ensure all required parameters are provided
    if (!content) {
      //|| !stream || !topic
      console.error(
        "Error: Missing required parameters (content, stream, or topic)."
      );
      return null;
    }
    //  const params = new URLSearchParams({
    //    type: "stream", // 'type' should always be 'stream' for sending to a stream
    //    to: stream, // The stream to which the message will be sent
    //    topic: topic, // The topic within the stream
    //    content: content, // The content of the message
    //  });
    
    const params = new URLSearchParams({
      type: "private",
      to: "Sage_bot-bot@sage.zulipchat.com",
      content: content,
    });
    // Send the message using fetch
    const response = await fetch(
      `${zulipBaseUrl}/messages?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + btoa(`${authHeader.username}:${authHeader.password}`), // Ensure credentials are properly encoded
        },
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      const errorResponse = await response.json(); // Capture error response content
      console.error("Failed to send message:", {
        status: response.status,
        statusText: response.statusText,
        error: errorResponse,
      });
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Message sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending message:", error.message);
    return null;
  }
};
