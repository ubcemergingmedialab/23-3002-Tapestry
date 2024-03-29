# 23-1002-Tapestry

## Project Description
Our goal with Tapestry ML is to use machine learning to automatically generate a web of interconnected content in Tapestry Tool. 

## Branch Description
| Branch Name  | Description |
| ------------- | ------------- |
| main  | The default branch that has the most up-to-date stable code.  |
| ui-changes  | The branch containing functional code with UI changes made before final round of user interviews (August 2023).  |
| generating-tapestries | The branch containing code for the original function for automatically generating tapestries. |
| link-connection | The branch containing code for generating links between sibling nodes based on their correlation value. |
| remote-site | The branch containing code relevant to the remote website, tapestry.emlx.ca. |

## Versioning
- Currently working on Tapestry 2.0 

## Building
First, ensure that you are familiar with and have installed Git and Github and Visual Studio Code (the code editor we use), as well as Node.js and Vue Language Features plugin. No specific versioning of Visual Studio Code is required.
1. Download the Tapestry Tool 2.0 WordPress Plugin and follow the installation instructions found here: https://github.com/tapestry-tool/tapestry-wp 
2. Download this Tapestry ML project to a local folder and replace the Tapestry Tool src folder with the file from this repository (tapestry-wp > templates > vue > src). For the most updated version of the project, ensure that you are in the main branch.
   - Make sure to make the following edits to the code (Ctrl+F "USER-EDITS" in the tapestryml.js and LOtapestryml.js files to see all places that require changes):
      - OpenAI API Key: You can get a key for free by creating an account on the OpenAI website and generating your own secret key. Replace the string in the relevant places in the code.
      - Tapestry ID and endpoint link replacements: Log in to Wordpress and create a new tapestry page (ensure the Tapestry Tool 2.0 Wordpress Plugin: https://github.com/tapestry-tool/tapestry-wp has been downloaded and src file has been replaced with the code from this repository first). Then right click and select "Inspect", then "Network". Refresh the page and look for the only item in the "Name" list with a single number. Enter that value in the tapestry_id variable and save the file.
3. Open up a command prompt or terminal window and run the following:
   ```shell
   npm run build
   npm start
Log into WordPress and open a tapestry page linked to the code.

## Dependencies
- Tapestry Tool 2.0 Wordpress Plugin: https://github.com/tapestry-tool/tapestry-wp\
- Vue Language Features (Volar) Plugin (v1.8.8): https://marketplace.visualstudio.com/items?itemName=Vue.volar

## Troubleshooting
- If running tapestry on localhost, you must run "npm start" in a command prompt/terminal and have MAMP open. Ensure both the Apache and MySQL servers are running.
- If you are having trouble deleting a Tapestry due to the error "Node MetaId Invalid", go into MAMP > Open WebStart Page > Tools > PHPMyAdmin > tapestry > wp_posts (contains nodes and tapestry objects) or wp_postmeta (contains information on the content and relation between nodes and tapestries). The error message indicates that a node from wp_posts was unable to find its corresponding metacontent stored in wp_postmeta. This may be resolved by adding a new entry with the missing ID.
- If there is a glitch when you submit your first prompt using the "Write a Prompt" feature, simply delete the root node and try again.
- In order to use the "Upload a PDF" feature, make sure to run the 'pdf_extractor.py' file. This will initiate the Flask app, enabling it to run and actively monitor the designated ports.

## Team
### Faculty:
Dr. Steven Barnes, Professor of Teaching and Director, Undergraduate Program in Neuroscience, University of British Columbia

### Current EML Student Team:
- Victoria Lim -  Lead and UI/UX Designer
- Sophia Yang - Developer
  
### Other contributors: 
Grace Bell - Volunteer 

## Documentation
- [Project Wiki Link](https://wiki.ubc.ca/Documentation:23-3002_Tapestry_Tool_ML)

Note that our license covers the EML components, and NOT those of OpenAI. 
