const axios = require('axios');

export async function tapestryLOGeneration(userInput) {
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
  const api_key = 'Bearer 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';

  // Tapestry API Endpoint - Node Generation
  const node_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes";
  // Tapestry API Endpoint - Link Generation 
  const link_generating_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/links";
  // Tapestry API Endpoint
  const tapestry_api_endpoint = "http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5";

  // Adding a root node programmatically 
  let root_node_1 = {
    title: userInput,
    status: 'publish',
    backgroundColor: "#006C92",
    // Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
    coordinates: {
      x: 200,
      y: 200,
    },
  };

  let root_request_body = {
    node: root_node_1
  };

  let json_root_node_data = JSON.stringify(root_request_body);

  let root_headers = {
    'Content-Type': 'application/json',
  };

  let add_root_node = await axios.post(node_generating_api_endpoint, json_root_node_data, { root_headers });

  if (add_root_node.status === 200) {
    let root_node_data = add_root_node.data;
    console.log("Root node data:", root_node_data);
  } else {
    console.log('Error:', add_root_node.status);
  }

  const get_parent_id = await axios.get(tapestry_api_endpoint);
  console.log(get_parent_id);
  const parent_id_filler = get_parent_id.data.rootId;

  if(get_parent_id.status === 200) {
    console.log("Root Node ID:", parent_id_filler);
  } else {
    console.log('Error:', get_parent_id.status);
  }

  // Change the following if using different site
  //const parent_id_filler = 5611; // Change this if needed
  const tapestry_id_filler = 5; // Change this if needed

  const updating_tapestry_node_api_endpoint = `http://localhost/wordpress/wp-json/tapestry-tool/v1/tapestries/5/nodes/${parent_id_filler}`;

  // Filling parent node with text
  if(userInput.length <= 30) { // If user input is short, just make the root node text the user input
    let root_node = {
      title: userInput,
      backgroundColor: "#006C92",
      permissions: {
        public: ["read", "add", "edit"],
        authenticated: ["read", "add", "edit"],
      },
      contentType: "text",
    };

    let headers = {
      'Content-Type': 'application/json',
    };
    const update_response = await axios.put(updating_tapestry_node_api_endpoint, JSON.stringify(root_node), { headers });

    if(update_response.status === 200) {
      console.log("Root Node Successfully Updated.");
    } else {
      console.log('Error:', update_response.status);
    }
  } else {
    const message = [
      // Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
      { "role": "user", "content": `Please summarize this text into a broad, general topic less than 20 characters long (around 1-3 words): ${userInput}`},
    ];
  
    const headers = {
      'Authorization': api_key,
      'Content-Type': 'application/json',
    };
  
    const summarize_response_openai = await axios.post(api_endpoint, { messages: message, model: "gpt-3.5-turbo" }, { headers });
    const openai_json_rootnodetext = summarize_response_openai.data;
    const summarized_user_input = openai_json_rootnodetext.choices[0].message.content;

    let root_node = {
      title: summarized_user_input,
      backgroundColor: "#006C92",
      permissions: {
        public: ["read", "add", "edit"],
        authenticated: ["read", "add", "edit"],
      },
      contentType: "text",
    };

    let headers_tapestry = {
      'Content-Type': 'application/json',
    };
    const update_response = await axios.put(updating_tapestry_node_api_endpoint, JSON.stringify(root_node), { headers_tapestry });

    if(update_response.status === 200) {
      console.log("Root Node Successfully Updated with Summarized Text:", summarized_user_input);
    } else {
      console.log('Error:', update_response.status);
    }
  }
  
  // OpenAI API
  const user_message = [
    // Content field contains a prompt engineered text that tells OpenAI how to split up its responses for each node
    { "role": "user", "content": `I will give you some text and I would like you to give me NO LESS THAN five and NO MORE THAN six 2-3 word summarizations of the main ideas in this text, separated by a '~', and please make sure each idea is distinct from one another. Again, please split each summarization with a '~' and don't use that character in your summarization. Have at least 5 different summarizations. For example, for photosynthesis you would put something like this: Light-Dependent reactions~The Calvin Cycle~Takes in CO2 and H2O~Produce O2 and Glucose. Here is my prompt for you: ${userInput}` },
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
        backgroundColor: "#1DADE1",
        // Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
        coordinates: {
          x: x,
          y: y,
        },
        permissions: {
          public: ["read", "add", "edit"],
          authenticated: ["read", "add", "edit"],
        },
        contentType: "text",
      };

      let request_body = {
        node: node,
        parentId: parent_id_filler,
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

        let cn_radius = 320; // 320 original
        let cn_angle_increments = (2 * Math.PI) / (cn_splitted_text.length + 1); // Added one to account for the child node taking up space
        let x_cn = x_child_node_position + cn_radius * Math.cos(cn_angle);
        let y_cn = y_child_node_position + cn_radius * Math.sin(cn_angle);

        cn_angle += cn_angle_increments;

        let cn_node = {
          id: 0,
          title: cn_text,
          status: 'publish',
          backgroundColor: "#66A7BE",
          // Sets the x y coordinates of the node on the screen (if you don't specify, x: 3000 and y: 3000 are default)
          coordinates: {
            x: x_cn,
            y: y_cn,
          },
          permissions: {
            public: ["read", "add", "edit"],
            authenticated: ["read", "add", "edit"],
          },
          contentType: "text",
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

  // Sibling node connection code
  const compareNodes = [];
  const compareTexts = [];
  let compareValues = [];

  for (let i = 0; i < cn_nodes_array.length; i++) {
    for (let j = i + 1; j < cn_nodes_array.length; j++) {
      compareNodes.push([cn_nodes_array[i], cn_nodes_array[j]]);
      compareTexts.push([cn_nodes_array[i].title, cn_nodes_array[j].title])
    }
  }

  const message = [
    {
      role: 'user',
      content: `Given an array of text pairs, assign values between 0 to 100 that describe how related each pair of texts are topically. 0 would indicate that their topics are completely unrelated and 100 would indicate that their topics are very related. Separate each value with a ~ character. If there are 120 elements in the array I give you (meaning 120 pairs of texts), make sure you generate 120 comparison values and that they match up int he order they appear in the array. The final string should have the format of this example (do not include anything else other than numbers and ~ character): "23~45~87~12~46". Here are the comparisons:\n${compareTexts}`,
    },
  ];

  const compare_response_openai = await axios.post(api_endpoint, { messages: message, model: 'gpt-3.5-turbo' }, { headers });
  const compare_string_val_openai = compare_response_openai.data.choices[0].message.content;
  console.log("Original OpenAI output:", compare_string_val_openai);
  compareValues = compare_string_val_openai.split("~");
  console.log("Array after splitting (should be string values):", compareValues);
  console.log("Compare Values array:", compareValues);
  console.log("compareTexts array:", compareTexts);
  console.log("compareNodes array:", compareNodes);

  for (let i = 0; i < compareNodes.length; i++) {
    const pair = compareNodes[i];
    const compareValue = compareValues[i];

    if (Number(compareValue) >= 70) { // threshold value is arbitrarily set to 70 here !!!
      const link_request_body = {
        'source': pair[0].id, //This is technically compareNodes[i][0]
        'target': pair[1].id, //This is technically compareNodes[i][1]
        'comparisonValue': Number(compareValue),
      };

      console.log("Link request body:", link_request_body);

      const response_tapestry_links = await axios.post(link_generating_api_endpoint, link_request_body);
      console.log("Response tapestry links:", response_tapestry_links);

      if (response_tapestry_links.status === 200) {
        const link_data = response_tapestry_links.data;
        console.log('New Sibling Link Generated.');
        console.log("Link data of new link:", link_data);
      } else {
        console.log('Error:', response_tapestry_links.status);
        console.log(await response_tapestry_links.text());
        continue;
      }
    }
  }

  console.log('Done Sibling Node Connections. Refresh Page.');
  location.reload();
}