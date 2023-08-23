import requests
import json

updating_tapestry_node_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes/5510"

headers = {
        'Content-Type': 'application/json',
      }

# request_body = {
#     'coordinates': {
#             'x': 200,
#             'y': 200,
#     }
# }

# json_request = json.dumps(request_body)

# updating_tapestry_node = requests.put(updating_tapestry_node_api_endpoint, headers=headers, data=json_request)

# if updating_tapestry_node.status_code == 200:
#     print("Done")
# else:
#     print('Error:', updating_tapestry_node.status_code)
#     print(updating_tapestry_node.content)

tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5"

tapestry_get = requests.get(tapestry_api_endpoint, headers=headers, verify=False)
info = tapestry_get.json() 

if tapestry_get.status_code == 200:
    print(info)
else:
    print('Error:', tapestry_get.status_code)
    print(tapestry_get.content)



node = {
    'post_id': 5,
}

node_body = json.dumps(node)

tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/users/lastSelectedNode"

tapestry_get = requests.get(tapestry_api_endpoint, headers=headers, data=node_body)
info = tapestry_get.json() 

if tapestry_get.status_code == 200:
    print("It worked:", info)
else:
    print('Error:', tapestry_get.status_code)
    print(tapestry_get.content)
