from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def process_data():
    # Check if the request contains JSON data
    if request.is_json:
        # Get the JSON data from the request
        data = request.get_json()
        
        # Process the data (in this example, we'll just echo it back)
        response = {
            "message": "Data received successfully",
            "data": data
        }
        
        # Return the response as JSON
        return jsonify(response), 200
    else:
        # If the request doesn't contain JSON data, return an error
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)