from flask import Flask, request, jsonify
from vectorstore import generate_quiz

app = Flask(__name__)

@app.route('/api/questions', methods=['POST'])
def get_questions():
    # Check if the request contains JSON data
    if request.is_json:
        # Get the JSON data from the request
        data = request.get_json()
        
        # Check if the 'topic' key is in the request
        if 'topic' in data:
            # Here we're ignoring the topic and always returning the same hardcoded response
            response = generate_quiz(data['topic'])
            
            return jsonify(response), 200
        else:
            return jsonify({"error": "Request must include a 'topic' key"}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)