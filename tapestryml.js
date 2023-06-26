const axios = require('axios');

export async function tapestryGeneration(userInput) {
  let i = 0;
  let angle = 0;
  let cn_angle = 0;
  let splitted_text = [];
  let cn_splitted_text = [];
  let node_ids = [];
  let gc_node_ids = [];
  let tapestryJsonData;
  let gc_tapestryJsonData;
  let cn_nodes_array = [];
  let node_array_test = []; 
  let gc_node_ids_array = [];

  // OpenAI API Endpoint and Key
  const api_endpoint = 'https://api.openai.com/v1/chat/completions';
  const api_key = 'Bearer API-KEY';

  // Tapestry API Endpoint - Node Generation
  const node_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes";
  // Tapestry API Endpoint - Link Generation 
  const link_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/links";
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

  let response_tapestry = await Promise.resolve().then(() => axios.get(tapestry_api_endpoint, { verify: false }));
  const json_data = response_tapestry.data;
  const parent_id_filler = 4;

  console.log(json_data);

  // Get the x and y coordinates of the root node
  const x_root_node_position = json_data.nodes[parent_id_filler].coordinates.x;
  const y_root_node_position = json_data.nodes[parent_id_filler].coordinates.y;

  console.log("x root coordinate:", x_root_node_position);
  console.log("y root coordinate:", y_root_node_position);

  console.log("Javascript Part 1 of Code Ran with Input:", userInput);

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
        level: 1,
      };

      let request_body = {
        node: node,
        parentId: 4,
      };

      let json_node_data = JSON.stringify(request_body);

      let headers = {
        'Content-Type': 'application/json',
      };

      try {
        let response_tapestry_nodes = await axios.post(node_generating_api_endpoint, json_node_data, { headers });

        if (response_tapestry_nodes.status === 200) {
          let data = response_tapestry_nodes.data;
          console.log("Generated nodes data", data);
          node_array_test.push(data.node.id);
          console.log(node_array_test);
        } else {
          console.log('Error:', response_tapestry_nodes.status);
        }
      }catch(error) {
        continue; 
      }
      console.log("Node array test data:", node_array_test); // !!!

      //Get the ids of all the child nodes that were generated
      let response_tapestry = await Promise.resolve().then(() => axios.get(tapestry_api_endpoint, { verify: false }));
      if (response_tapestry.status === 200) {
        tapestryJsonData = response_tapestry.data; // Convert the response to JSON
        node_ids = Object.values(tapestryJsonData.nodes).map((node) => node.id);
        node_ids.splice(node_ids.indexOf(request_body.parentId), 1);
        console.log("Javascript Part 2 of Code Ran (generating child nodes) and node ids:", node_ids); // Check statements
        console.log("Node ids (what we currently have):", node_ids);
      } else {
        console.log('Error:', response_tapestry.status);
      }
    }

    // Child Node Generating
    for (let node_id of node_array_test) {
      let cn_headers = {
        'Authorization': api_key,
        'Content-Type': 'application/json',
      };

      // Follow up messages autogenerated for new branches off child nodes
      let child_node_message = [
        // Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
        {
          role: 'user',
          content: `For each next prompt I'm going to give you, please give me a couple 2-3 word summarizations of the main ideas and please make sure each idea is distinct from one another. Please split each summarization with a '~' and don't use that character in your summarization. Make sure each of the summarizations are directly related to the prompt I gave you, since the goal is to get more specific. Most importantly, please make sure that whatever you generate still loosely relates to the first prompt I gave you, ${userInput}. Do not repeat any previous summarizations. Here is my new prompt for you: ${splitted_text[i]}`,
        },
      ];

      // cn means child node
      let cn_response_openai = await Promise.resolve().then(() => axios.post(api_endpoint, { messages: child_node_message, model: 'gpt-3.5-turbo' }, { headers: cn_headers }));
      let cn_openai_json = cn_response_openai.data;
      let cn_new_text_content = cn_openai_json.choices[0].message.content;

      cn_splitted_text = cn_new_text_content.split('~');

      for (let cn_text of cn_splitted_text) {

        // Position coordinates for child nodes (to make grandchildren off of)
        let x_child_node_position = tapestryJsonData.nodes[node_id].coordinates.x; // Should be the same as the Python code: x_child_node_position = json_data['nodes'][f'{node_id}']['coordinates']['x']
        let y_child_node_position = tapestryJsonData.nodes[node_id].coordinates.y; // Reference for myself: y_child_node_position = json_data['nodes'][f'{node_id}']['coordinates']['y']

        let cn_radius = 320;
        let cn_angle_increments = (2 * Math.PI) / (cn_splitted_text.length + 1); // Added one to account for the child node taking up space
        let x_cn = x_child_node_position + cn_radius * Math.cos(cn_angle);
        let y_cn = y_child_node_position + cn_radius * Math.sin(cn_angle);

        cn_angle += cn_angle_increments;

        let cn_node = {
          id: 0,
          title: cn_text,
          status: 'publish',
          // Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
          coordinates: {
            x: x_cn,
            y: y_cn,
          },
          level: 2,
        };

        // PUT THE CN NODES IN AN ARRAY HERE SO THAT WE CAN COMPARE THE TEXTS INSIDE OF THEM AND ADD LINKS !!!
        cn_nodes_array.push(cn_node);

        let cn_request_body = {
          node: cn_node,
          parentId: node_id,
        };

        let cn_json_node_data = JSON.stringify(cn_request_body);

        try {
          let cn_response_tapestry_nodes = await Promise.resolve().then(() => axios.post(node_generating_api_endpoint, cn_json_node_data, { headers }));

          if (cn_response_tapestry_nodes.status === 200) {
            let cn_data = cn_response_tapestry_nodes.data;
            console.log(cn_data);
            gc_node_ids_array.push(cn_data.link.target);
          } else {
            console.log('Error:', cn_response_tapestry_nodes.status);
          }
        }catch(error) {
          continue;
        }

      }

      i++;
    }
  }

  // Call the function to generate nodes 
  await generateNodes();

  // Ids of all the grandchild nodes that were generated
  console.log(gc_node_ids_array);

  // Adding the gc node ID to each cn_node in cn_nodes_array in the "id" field
  for (let i = 0; i < cn_nodes_array.length; i++) {
    cn_nodes_array[i].id = gc_node_ids_array[i];
  }

  console.log('Done.');
  console.log(cn_nodes_array);
  console.log(cn_nodes_array[0]);
  //console.log(cn_nodes_array); // Just to check and see what information is put in the array - CORRECT
  //console.log(cn_nodes_array[0].title); // Check what this returns - CORRECT

  // Generating links between sibling nodes:
  // Compare each element in a list to each other (only once)
  for (let i=0; i < cn_nodes_array.length; i++) {
    for (let j= i + 1; j < cn_nodes_array.length; j++) {
      const compareA = cn_nodes_array[i].title; // You just want to compare the text inside this node array (not all the other node data)
      const compareB = cn_nodes_array[j].title;

    // Add code to call ChatGPT to assign a number between the two texts (based on how related they are)
    const comparison = [
      // Content field contains a prompt engineered text that tells OpenAI to compare the two texts in the nodes
      { "role": "user", "content": `Given two texts, please assign a single number between 1 to 10 that describes how closely related they are in terms of topic. 1 would be unrelated and 10 would be very closely related. Do not include any other text other than a single number between 1-10 that describes the two texts' relationship. Here are the two texts: ${compareA} and ${compareB}`},
    ];
  
    const headers = {
      'Authorization': api_key,
      'Content-Type': 'application/json',
    };
  
    const compare_response_openai = await axios.post(api_endpoint, { messages: comparison, model: "gpt-3.5-turbo" }, { headers });
    const compare_openai_json = compare_response_openai.data;
    const compare_string_val_openai = compare_openai_json.choices[0].message.content;
    // Extract the ChatGPT response from the JSON and convert it into a number using JavaScript Number() function
    const compare_num_val_openai = Number(compare_string_val_openai);
    console.log("Comparison node A:", compareA);
    console.log("Comparison node B:", compareB);
    console.log("Comparison value:", compare_num_val_openai);

      //If the number is above a certain threshold, add a link between the nodes by calling the Tapestry link API
      if (compare_num_val_openai >= 4) { // threshold value is set to 4 here !!!
        let link_request_body = {
          'source': cn_nodes_array[i].id,
          'target': cn_nodes_array[j].id,
        }

        console.log(link_request_body);

        //let json_link_data = JSON.stringify(link_request_body);

        let response_tapestry_links = await axios.post(link_generating_api_endpoint, link_request_body);
        console.log(response_tapestry_links);

        if (response_tapestry_links.status === 200) {
          let link_data = response_tapestry_links.data;
          console.log("New Sibling Link Generated.");
          console.log(link_data);
        } else {
          console.log('Error:', response_tapestry_links.status);
          console.log(await response_tapestry_links.text());
          continue;
        }
      }
    }
  }
}