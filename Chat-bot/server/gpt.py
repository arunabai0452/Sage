from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)  

@app.route('/webhook', methods=['POST'])
def webhook():
    logging.info("Received a POST request at /webhook")

    # Get JSON data from request
    data = request.get_json()
    if not data or "content" not in data:
        logging.error("Invalid request body: 'content' field is missing")
        return jsonify({"error": "Invalid request body: missing 'content' field"}), 400

    received_message = data["content"]
    logging.debug(f"Extracted message: {received_message}")

    try:
        logging.info("Sending request to OpenAI API using GPT-4o-mini model...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful chatbot called Sage. You are a university assistant kinda, and you must answer university related queries. keep the answers short. DO NOT WRITE IN MARKDOWN, WRITE PLAINTEXT."},
                {"role": "user", "content": received_message}
            ],
            max_tokens=100,
            temperature=0.7
        )

        reply = response.choices[0].message.content.strip()
        logging.info(f"OpenAI response received: {reply}")

    except Exception as e:
        logging.error(f"Error processing message with OpenAI: {e}")
        return jsonify({"error": str(e)}), 500

    logging.debug("Sending reply back to the client")
    return jsonify({"reply": reply}), 200

if __name__ == "__main__":
    logging.info("Starting Flask server on http://localhost:5001 ...")
    app.run(host="localhost", port=5001)