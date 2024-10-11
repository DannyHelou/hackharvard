from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

@app.route('/test', methods=['GET'])
def test():
    return jsonify(message="Hello from Flask!")

if __name__ == '__main__':
    app.run(debug=True)