import requests
import json
import math

i = 0
angle = 0
cn_angle = 0

#OpenAI API Endpoint and Key
api_endpoint = 'https://api.openai.com/v1/chat/completions'
api_key = 'Bearer YOUR-API-KEY' 

#Tapestry API Endpoint
node_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes"

# Tapestry API Endpoint
tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5"

#OpenAI API
user_input = input(">: ")
user_message = [
    # Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
    {"role": "user", "content": f"I will give you some text and I would like you to give me a five or six 2-3 word summarizations of the main ideas in this text, and please make sure each idea is distinct from one another. Please split each summarization with a '/' and don't use that character in your summarization. For example, for photosynthesis you would put something like this: Light-Dependent reactions/The Calvin Cycle/Takes in CO2 and H2O/Produce O2 and Glucose. Here is my prompt for you: {user_input}"},
]

headers = {
    'Authorization': api_key,
    'Content-Type': 'application/json'
}

response_openai = requests.post(api_endpoint, headers=headers, json={"messages": user_message, "model": "gpt-3.5-turbo"})
openai_json = response_openai.json()
new_text_content = openai_json['choices'][0]['message']['content']

splitted_text = new_text_content.split("/")

# This is for the node positioning
increments = len(splitted_text)

# This is for the node positioning
response_tapestry = requests.get(tapestry_api_endpoint, verify=False)
json_data = response_tapestry.json()

# This is the parent ID for the root node - figure out how to automatically get this later
parent_id_filler = 4

# Get the x and y coordinates of the root node
x_root_node_position = json_data['nodes'][f'{parent_id_filler}']['coordinates']['x']
y_root_node_position = json_data['nodes'][f'{parent_id_filler}']['coordinates']['y']

#Tapestry API - Generating nodes with text
for text in splitted_text:
    # Node positioning code 
    radius = 900
    angle_increments = (2 * math.pi) / increments
    x = x_root_node_position + radius * math.cos(angle)
    y = y_root_node_position + radius * math.sin(angle)

    angle += angle_increments

    node = {
        'title': text,
        'status': 'publish',
        # Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
        'coordinates': {
        'x': x,
        'y': y,
      },
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

    # Get the ids of all the child nodes that were generated
    response_tapestry = requests.get(tapestry_api_endpoint, verify=False)
    json_data = response_tapestry.json()
    node_ids = list(node['id'] for node in json_data['nodes'].values())
    node_ids.remove(request_body["parentId"]) 

    if response_tapestry.status_code == 200:  
        json_data = response_tapestry.json()  # Convert the response to JSON
        print(node_ids)
    else:
        print('Error:', response_tapestry.status_code)


# Child Node Generating
for node_id in node_ids:

    cn_headers = {
        'Authorization': api_key,
        'Content-Type': 'application/json'
    }

    #Follow up messages autogenerated for new branches off child nodes
    child_node_message = [
        # Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
        {"role": "user", "content": f"For each next prompt I'm going to give you, please give me a couple 2-3 word summarizations of the main ideas and please make sure each idea is distinct from one another. Please split each summarization with a '/' and don't use that character in your summarization. Make sure each of the summarizations are directly related to the prompt I gave you, since the goal is to get more specific. Most importantly, please make sure that whatever you generate still loosely relates to the first prompt I gave you, {user_input}. Do not repeat any previous summarizations. Here is my new prompt for you: {splitted_text[i]}"},
    ]

    #cn means child node
    cn_response_openai = requests.post(api_endpoint, headers=cn_headers, json={"messages": child_node_message, "model": "gpt-3.5-turbo"})
    cn_openai_json = cn_response_openai.json()
    cn_new_text_content = cn_openai_json['choices'][0]['message']['content']

    cn_splitted_text = cn_new_text_content.split("/")
        
    for cn_text in cn_splitted_text:

        # Position coordinates for child nodes (to make grandchildren off of)
        x_child_node_position = json_data['nodes'][f'{node_id}']['coordinates']['x']
        y_child_node_position = json_data['nodes'][f'{node_id}']['coordinates']['y']
        print(f"x_child_node_position: {x_child_node_position}")
        print(f"y_child_node_position: {y_child_node_position}")

        cn_radius = 320
        cn_angle_increments = (2 * math.pi) / (len(cn_splitted_text) + 1) # Added one to account for the child node taking up space
        x_cn = x_child_node_position + cn_radius * math.cos(cn_angle)
        y_cn = y_child_node_position + cn_radius * math.sin(cn_angle)

        cn_angle += cn_angle_increments

        cn_request_body = {
            "node": {
                "title": cn_text,
                'status': 'publish',
                'coordinates': {
                    'x': x_cn,
                    'y': y_cn,
                },
            }, 
            "parentId": node_id  #Parentid is child node id
        }

        cn_json_node_data = json.dumps(cn_request_body)

        response_tapestry_child_nodes = requests.post(node_generating_api_endpoint, headers=headers, data=cn_json_node_data)

        if response_tapestry_child_nodes.status_code == 200:
            cn_data = response_tapestry_child_nodes.json()
            print(cn_data)
        else:
            print('Error:', response_tapestry_child_nodes.status_code)
            print(response_tapestry_child_nodes.content)
        
    i += 1
