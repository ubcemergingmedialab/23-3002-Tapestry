const axios = require('axios');

export async function deleteNodes(userInput2) {
    const tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5";

    const parentId = 4; // Change this if root node id changes
    let node_ids = [];

    let response_tapestry = await axios.get(tapestry_api_endpoint, { verify: false });
        if (response_tapestry.status === 200) {
            const json_data = response_tapestry.data; // Convert the response to JSON
            node_ids = Object.values(json_data.nodes).map((node) => node.id);
            node_ids.splice(node_ids.indexOf(parentId), 1);
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
}