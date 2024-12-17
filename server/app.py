from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return {'status': 'Flask SocketIO Server Running'}

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit('welcome', {'data': 'Welcome!'})

@socketio.on('message')
def handle_message(data):
    print('Received message:', data)
    socketio.emit('response', {'data': f'Server received: {data}'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True)