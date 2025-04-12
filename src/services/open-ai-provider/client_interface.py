from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv


class ChatGPTInterface:
    def __init__(self):
        dotenv_path = Path('app.env')
        load_dotenv(dotenv_path)
        self.client = OpenAI()
        
    def generateFDAR(self):
        pass
