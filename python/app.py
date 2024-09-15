from flask import Flask, request, jsonify

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
            response = [
                {
                    "question": "If we have a graph with an adjacency matrix, A, how can we determine if the graph has any self-loops?",
                    "answers": [
                        "Check if any of the diagonal elements of A are non-zero.",
                        "Multiply A by its transpose and check for non-zero values on the main diagonal.",
                        "Subtract the identity matrix from A and check for non-zero diagonal elements.",
                        "Self-loops are indicated by a non-zero trace of the matrix A."
                    ],
                    "correct_answer": 1
                },
                {
                    "question": "What does it mean to raise an adjacency matrix to a power?",
                    "answers": [
                        "It represents the number of walks of length 'power' in the graph.",
                        "It indicates the probability of reaching a certain state after 'power' steps in a Markov chain.",
                        "The power of an adjacency matrix represents the graph's total number of edges.",
                        "It indicates the number of closed walks of length 'power' starting and ending at the same node."
                    ],
                    "correct_answer": 1
                }
            ]
            
            return jsonify(response), 200
        else:
            return jsonify({"error": "Request must include a 'topic' key"}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)