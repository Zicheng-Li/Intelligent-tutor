from flask import Flask, request, jsonify
from flask_cors import CORS
from vectorstore import generate_quiz

app = Flask(__name__)

# Allow requests from the React app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/questions', methods=['POST'])
def get_questions():
    print("Received a request at /api/questions")

    if request.is_json:
        print("Request is JSON")
        data = request.get_json()
        print(f"Request JSON data: {data}")
        
        if 'topic' in data:
            print(f"Topic found in request: {data['topic']}")
            print(f"User ID: {data['userId']}")
            print(f"Class ID: {data['classId']}")

            response = generate_quiz(data['topic'], data['userId'], data['classId'])
            print(f"Generated response: {response}")

            return jsonify(response), 200
        else:
            print("Error: 'topic' key is missing in the request")
            return jsonify({"error": "Request must include a 'topic' key"}), 400
    else:
        print("Error: Request is not JSON")
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
