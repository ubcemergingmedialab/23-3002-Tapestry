const axios = require('axios');

export async function deleteNodes(userInput2) {

    const parent_id_filler = 4; // Change this if root node id changes
    const tapestry_id_filler = 5; // Change this if needed

    const updating_tapestry_node_api_endpoint = `http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/${tapestry_id_filler}/nodes/${parent_id_filler}`;
    const tapestry_api_endpoint = `http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/${tapestry_id_filler}`;

    let node_ids = [];

    let response_tapestry = await axios.get(tapestry_api_endpoint, { verify: false });
        if (response_tapestry.status === 200) {
            const json_data = response_tapestry.data;
            node_ids = Object.values(json_data.nodes).map((node) => node.id);
            node_ids.splice(node_ids.indexOf(parent_id_filler), 1);
            console.log("Node Ids To Delete:", node_ids);
        } else {
            console.log('Error:', response_tapestry.status);
        }

    let node_ids_delete = node_ids;

    for (let node_id_delete of node_ids_delete) {
      let node_deletion = `http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes/${node_id_delete}`;

        JSON.stringify(node_id_delete);

        let deleteNodes = await axios.delete(node_deletion, { verify: false });

        if(deleteNodes.status === 200) {
            console.log("Node Deleted.");
        } else {
            console.log("Error:", deleteNodes.status);
        }
    }

    console.log("All nodes deleted.");

    let root_node = {
        title: "Root Node",
      };
  
      let headers = {
        'Content-Type': 'application/json',
      };
      const update_response = await axios.put(updating_tapestry_node_api_endpoint, JSON.stringify(root_node), { headers });
  
      if(update_response.status === 200) {
        console.log("Root Node Successfully Returned to Original State.");
      } else {
        console.log('Error:', update_response.status);
      }
}