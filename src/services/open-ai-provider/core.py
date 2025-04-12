import os

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/testChat', methods = ['POST']) 
def testChat():
    data = request.json
    prompt = data.get('prompt')
