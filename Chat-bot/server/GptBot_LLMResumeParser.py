from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging
import os
import requests
from io import BytesIO
from pdfminer.high_level import extract_text
import json
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)

### PDF Extraction ###
def extract_text_from_pdf(file_obj):
    return extract_text(file_obj)

### /gpt Endpoint (Unchanged) ###
@app.route('/gpt', methods=['POST'])
def gpt():
    logging.info("Received a POST request at /gpt")
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
                {
                    "role": "system",
                    "content": (
                        "You are a helpful chatbot called Sage. You are a university assistant kinda, "
                        "and you must answer university related queries. Keep the answers short. "
                        "DO NOT WRITE IN MARKDOWN, WRITE PLAINTEXT."
                    )
                },
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

### /resume Endpoint - Revised ###
@app.route('/resume', methods=['POST'])
def resume():
    logging.info("Received resume processing request")
    data = request.get_json()
    if not data or "file_url" not in data or "filename" not in data:
        logging.error("Missing file_url or filename in request")
        return jsonify({"error": "Missing file_url or filename"}), 400

    file_url = data["file_url"]
    filename = data["filename"]
    logging.info(f"Processing resume for file: {filename} from URL: {file_url}")

    try:
        # 1. Download the PDF from the URL
        r = requests.get(file_url)
        if r.status_code != 200:
            raise Exception(f"Failed to download file, status code: {r.status_code}")

        # 2. Extract text from the PDF
        pdf_file = BytesIO(r.content)
        extracted_text = extract_text_from_pdf(pdf_file)
        logging.debug("Extracted text from PDF")

        # 3. Send the text to OpenAI with a structured JSON request prompt
        system_prompt = (
            "You are a specialized resume parser. You must extract the following fields from the raw resume text:\n"
            "1) name\n"
            "2) contact\n"
            "3) email\n"
            "4) skills\n"
            "5) education\n\n"
            "Return ONLY valid JSON with exactly these keys:\n"
            "{\n"
            "  \"name\": \"\",\n"
            "  \"contact\": \"\",\n"
            "  \"email\": \"\",\n"
            "  \"skills\": [],\n"
            "  \"education\": []\n"
            "}\n"
            "No extra text. If a field is missing, leave it blank or empty array.\n"
        )

        user_prompt = (
            f"Resume text:\n---\n{extracted_text}\n---\n"
            "Please extract the requested fields in the specified JSON format."
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.0
        )

        llm_output = response.choices[0].message.content.strip()
        logging.info(f"OpenAI structured resume output: {llm_output}")

        # 4. Parse the JSON from the LLM
        try:
            parsed_json = json.loads(llm_output)
        except json.JSONDecodeError:
            # If the LLM doesn't follow instructions perfectly, fallback
            logging.error("Could not decode JSON from LLM output")
            return jsonify({"error": "Invalid JSON from LLM"}), 500

        # 5. Return the final structured result
        return jsonify({"result": parsed_json}), 200

    except Exception as e:
        logging.error(f"Error processing resume: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logging.info("Starting Flask server on http://localhost:5001 ...")
    app.run(host="localhost", port=5001)