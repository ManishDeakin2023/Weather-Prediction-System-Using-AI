from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample data (will be dynamically retrieved and stored in corresponding dictionary)
users = [{"id": 1, "name": "John Doe"}, {"id": 2, "name": "Jane Smith"}]

# Example endpoint data request of all data under 'users'
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

# Example endpoint data request (with direct specification)
@app.route('/users/<int:user_id>', methods=['GET'])

# Creation of example endpoints, adjust as necessary depending on data type retrieval
def get_user(user_id):
    user = next((user for user in users if user['id'] == user_id), None)
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)

if __name__ == '__main__':
    app.run(debug=True)


