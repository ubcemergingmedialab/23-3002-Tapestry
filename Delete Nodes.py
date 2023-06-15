import requests
import json

#Use this to get all the node IDS - REMEMBER TO REMOVE THE PARENT ID
tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5"

response_tapestry = requests.get(tapestry_api_endpoint, verify=False)

if response_tapestry.status_code == 200:  
    json_data = response_tapestry.json()  # Convert the response to JSON
    # print(json_data)
else:
    print('Error:', response_tapestry.status_code)

parent_id = 4
node_ids = list(node['id'] for node in json_data['nodes'].values())
node_ids.remove(parent_id) 

print(node_ids)

# USE THIS CODE TO DELETE THEM. REMEMBER TO REPLACE THE "NODE_IDS_DELETE" FIELD WITH A COPY-PASTE OF THE
# ARRAY OF NODE IDS THAT WERE PRINTED FROM THE ABOVE STEP (REMEMBER THAT THE NODE IDS NEED TO BE NUMBERS NOT STRINGS)
node_ids_delete = node_ids

for node_id_delete in node_ids_delete:
    node_deletion = f"http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes/{node_id_delete}"

    # Pass the array of node IDs in the request body
    delete = requests.delete(node_deletion, json=node_id_delete)

    if delete.status_code == 200:
        print("Node deleted.")
    else:
        print('Error:', delete.status_code)
        print(delete.content)