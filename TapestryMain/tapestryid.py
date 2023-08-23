import requests
endpoint = "https://tapestry.emlx.ca/wp/wp-json/tapestry-tool/v1/tapestryIDs"

response = requests.get(endpoint)
print(response)