import requests
import json

#OpenAI API Endpoint and Key
api_endpoint = 'https://api.openai.com/v1/chat/completions'
api_key = 'Bearer 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' 

#Tapestry API Endpoint
node_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes"

#OpenAI API
user_input = input(">: ")
message_history = [
    # Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
    {"role": "user", "content": f"I will give you some text and I would like you to give me a couple 2-3 word summarizations of the main ideas in this text, and please make sure each idea is distinct from one another. Please split each summarization with a '/' and don't use that character in your summarization. For example, for photosynthesis you would put something like this: Light-Dependent reactions/The Calvin Cycle/Takes in CO2 and H2O/Produce O2 and Glucose. Here is my prompt for you: {user_input}"},
]

headers = {
    'Authorization': api_key,
    'Content-Type': 'application/json'
}

response_openai = requests.post(api_endpoint, headers=headers, json={"messages": message_history, "model": "gpt-3.5-turbo"})
openai_json = response_openai.json()
new_text_content = openai_json['choices'][0]['message']['content']

splitted_text = new_text_content.split("/")

#Tapestry API - Generating nodes with text
for text in splitted_text:
    node = {
        "title": text,
        'status': 'publish'
    }

    request_body = {
        "node": node,
        "parentId": 4
    }

    json_node_data = json.dumps(request_body)

    headers = {
        "Content-Type": "application/json"
    }

    response_tapestry_nodes = requests.post(node_generating_api_endpoint, headers=headers, data=json_node_data)

    if response_tapestry_nodes.status_code == 200:
        data = response_tapestry_nodes.json()
        print(data)
    else:
        print('Error:', response_tapestry_nodes.status_code)
        print(response_tapestry_nodes.content)