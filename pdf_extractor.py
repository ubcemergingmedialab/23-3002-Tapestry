from flask import Flask, request
from flask_cors import CORS
import PyPDF2

app = Flask(__name__)
CORS(app)

@app.route('/extract-pdf-text', methods=['POST'])
def extract_pdf_text():
    file = request.files['file']
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text

if __name__ == '__main__':
    app.run(port=8000) #8000 is the localhost port

