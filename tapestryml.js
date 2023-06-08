const axios = require('axios');

export async function tapestryGeneration(userInput) { // Have to use export so that Vue can use this JavaScript function
  let angle = 0;
  let splitted_text = [];
  let node_ids = [];
  let tapestryJsonData;

  // OpenAI API Endpoint and Key
  const api_endpoint = 'https://api.openai.com/v1/chat/completions';
  const api_key = 'Bearer API-KEY';

  // Tapestry API Endpoint
  const node_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes";

  // Tapestry API Endpoint
  const tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5";

  // OpenAI API
  const user_message = [
    // Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
    { "role": "user", "content": `I will give you some text and I would like you to give me a five or six 2-3 word summarizations of the main ideas in this text, and please make sure each idea is distinct from one another. Please split each summarization with a '~' and don't use that character in your summarization. For example, for photosynthesis you would put something like this: Light-Dependent reactions~The Calvin Cycle~Takes in CO2 and H2O~Produce O2 and Glucose. Here is my prompt for you: ${userInput}` },
  ];

  const headers = {
    'Authorization': api_key,
    'Content-Type': 'application/json',
  };

  const response_openai = await axios.post(api_endpoint, { messages: user_message, model: "gpt-3.5-turbo" }, { headers });
  const openai_json = response_openai.data;
  const new_text_content = openai_json.choices[0].message.content;

  splitted_text = new_text_content.split("~");

  // This is for the node positioning
  const increments = splitted_text.length;

  const response_tapestry = await axios.get(tapestry_api_endpoint, { verify: false });
  const json_data = response_tapestry.data;
  const parent_id_filler = 4;

  // Get the x and y coordinates of the root node
  const x_root_node_position = json_data.nodes[parent_id_filler].coordinates.x;
  const y_root_node_position = json_data.nodes[parent_id_filler].coordinates.y;

  console.log("Javascript Part 1 of Code Ran with Input:", userInput); // Right click > Inspect > Console to see progress 

  // Tapestry API - Generating nodes with text
  async function generateNodes() {
    for (let text of splitted_text) {
      // Node positioning code
      let radius = 900;
      let angle_increments = (2 * Math.PI) / increments;
      let x = x_root_node_position + radius * Math.cos(angle);
      let y = y_root_node_position + radius * Math.sin(angle);

      angle += angle_increments;

      let node = {
        title: text,
        status: 'publish',
        backgroundColor: "#11a6d8",
        // Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
        coordinates: {
          x: x,
          y: y,
        },
      };

      let request_body = {
        node: node,
        parentId: 4,
      };

      let json_node_data = JSON.stringify(request_body);

      let headers = {
        'Content-Type': 'application/json',
      };

      let response_tapestry_nodes = await axios.post(node_generating_api_endpoint, json_node_data, { headers });

      if (response_tapestry_nodes.status === 200) {
        let data = response_tapestry_nodes.data;
        console.log(data);
      } else {
        console.log('Error:', response_tapestry_nodes.status);
        console.log(await response_tapestry_nodes.text());
      }

      // Get the ids of all the child nodes that were generated
      let response_tapestry = await axios.get(tapestry_api_endpoint);
      if (response_tapestry.status === 200) {
        tapestryJsonData = response_tapestry.data; // Convert the response to JSON
        node_ids = Object.values(tapestryJsonData.nodes).map((node) => node.id);
        node_ids.splice(node_ids.indexOf(request_body.parentId), 1);
        console.log("Javascript Part 2 of Code Ran (generating child nodes)"); // Check statement
        console.log(node_ids);
      } else {
        console.log('Error:', response_tapestry.status);
      }
    }
  }
}