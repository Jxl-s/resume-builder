from flask import Flask, request, jsonify
from meta_ai_api import MetaAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
ai = MetaAI()

@app.route('/prompt', methods=['POST'])
def prompt():
    message = request.json.get('message')
    response = ai.prompt(message=message)
    print(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)