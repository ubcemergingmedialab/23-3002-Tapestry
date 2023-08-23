import requests
import openai
import json

#OpenAI API Endpoint and Key
api_endpoint = 'https://api.openai.com/v1/chat/completions'
api_key = 'Bearer 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' 
#api_endpoint_dalle = "https://api.openai.com/v1/images/generations"

#OpenAI API
user_message = [
    # Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
    {"role": "user", "content": f"How can you take image input?"},
]

headers = {
    'Content-Type': 'application/json',
    'Authorization': api_key,
}

response_openai = requests.post(api_endpoint, headers=headers, json={"messages": user_message, "model": "gpt-4"})
openai_json = response_openai.json()
new_text_content = openai_json['choices'][0]['message']['content']

print(new_text_content)







# api_key = 'Bearer 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'

# headers = {
#     'Content-Type': 'application/json',
#     'Authorization': api_key,
# }

# response_dalle = {
#   "prompt": "raspberry bread",
#   "n": 1,
#   "size": "1024x1024"
# }

# api_endpoint_dalle = "https://api.openai.com/v1/images/generations"

# response = requests.post(api_endpoint_dalle, headers=headers, json=response_dalle)

# response_data = response.json()  
# image_url = response_data['data'][0]['url'] 
# print(image_url)