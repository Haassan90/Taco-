from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})

orders = []

@app.route('/orders', methods=['GET', 'POST'])
def manage_orders():
    if request.method == 'POST':
        data = request.get_json()
        orders.append(data)
        return jsonify({"message": "Order added!", "order": data})
    return jsonify(orders)

if __name__ == '__main__':
    app.run(debug=True)
