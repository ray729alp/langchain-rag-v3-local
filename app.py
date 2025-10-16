from flask import Flask, render_template, request, jsonify
from chat import ChatBot
import os
import atexit
import signal

app = Flask(__name__)
chatbot = ChatBot()

def shutdown_handler(signum=None, frame=None):
    print("Shutting down gracefully...")
    os._exit(0)

# Register handlers
atexit.register(shutdown_handler)
signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data received',
                'answer': 'Please provide a valid query.'
            })
        
        message = data.get('message', '')
        category = data.get('category')
        
        print(f"Received request - Category: {category}, Message: {message}")
        
        if not message.strip():
            return jsonify({
                'error': 'Empty message',
                'answer': 'Please provide a question or message.'
            })
        
        if not category:
            return jsonify({
                'error': 'Category not specified',
                'answer': 'Please select a category first.'
            })
            
        # Get response from chatbot
        response = chatbot.chat(message, category)
        
        print(f"Chatbot response: {response}")
        
        # Ensure response is in correct format
        if isinstance(response, dict):
            answer = response.get('answer', 'No answer generated.')
            sources = response.get('sources', [])
        else:
            # Handle case where response might be a string
            answer = str(response) if response else 'No response generated.'
            sources = []
        
        return jsonify({
            'answer': answer,
            'sources': sources
        })
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in predict endpoint: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': error_msg,
            'answer': 'An error occurred while processing your request. Please try again.'
        })

if __name__ == '__main__':
    try:
        print("Starting MQA Chatbot Server...")
        print("Available categories:", list(chatbot.databases.keys()))
        app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Failed to start server: {e}")
        shutdown_handler()