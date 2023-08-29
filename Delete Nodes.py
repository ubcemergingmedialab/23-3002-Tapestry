import requests
import json

# Run this script to delete all nodes in the specified tapestry (if delete nodes button doesn't work)
# Note: Remember to replace the tapestry_id variable with your tapestry id

tapestry_id = 0 
tapestry_api_endpoint = f"https://tapestry.emlx.ca/wp/wp-json/tapestry-tool/v1/tapestries/{tapestry_id}"

response_tapestry = requests.get(tapestry_api_endpoint, verify=False)

if response_tapestry.status_code == 200:  
    json_data = response_tapestry.json()  # Convert the response to JSON
    # print(json_data)
else:
    print('Error:', response_tapestry.status_code)

node_ids = list(node['id'] for node in json_data['nodes'].values())

node_ids_delete = node_ids

for node_id_delete in node_ids_delete:
    node_deletion = f"https://tapestry.emlx.ca/wp/wp-json/tapestry-tool/v1/tapestries/{tapestry_id}/nodes"

    delete = requests.delete(node_deletion, json=node_id_delete)

    if delete.status_code == 200:
        print("Node deleted.")
    else:
        print('Error:', delete.status_code)
        print(delete.content)
