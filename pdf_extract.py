import PyPDF2
import requests

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        text = ''
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extract_text()
        
        user_message = [
            {"role": "user", "content": f"Please format the text given to you, getting rid of grammatical and flow mistakes: {text}"},
        ]

        api_endpoint = 'https://api.openai.com/v1/chat/completions'
        api_key = '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'

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        response_openai = requests.post(api_endpoint, headers=headers, json={"messages": user_message})
        openai_json = response_openai.json()
        formatted_text = openai_json['choices'][0]['message']['content']

        return text
    

# Usage example
pdf_file_path = './L10.pdf'
extracted_text = extract_text_from_pdf(pdf_file_path)
print(extracted_text)