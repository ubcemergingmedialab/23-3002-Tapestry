# 23-1002-Tapestry

Will be updated once tapestries are automatically generated. 

## Project Description
Our goal with Tapestry ML is to use machine learning to automatically generate a web of interconnected content in Tapestry Tool. 

## Branch Description
Brief Description of project here

## External Assets

### Included
- [Name of asset and link if applicable](https://www.google.com)

## Versioning
- Currently working on Tapestry 2.0 

## Getting Started

1. OpenAI API Key:
   - You can get a key for free by creating an account on the OpenAI website and generating your own secret key. Replace the string in the relevant places in the code (Ctrl+F "OPEN-AI-API-KEY" in tapestryml.js and LOtapestryml.js).
3. Tapestry ID and endpoint link replacements:
   - Log in to Wordpress and create a new tapestry page (ensure the Tapestry Tool 2.0 Wordpress Plugin: https://github.com/tapestry-tool/tapestry-wp has been downloaded and the relevant code files from this repository has been replaced first). Then right click and select "Inspect", then "Network". Refresh the page and look for the only item in the "Name" list with a single number. Enter that value in the tapestry_id variable (replace 5) and save the file.

## Building

1. Download the Tapestry Tool 2.0 Wordpress Plugin and follow the installation instructions found here: https://github.com/tapestry-tool/tapestry-wp 
2. Download this Tapestry ML project to a local folder and replace the Tapestry Tool code files downloaded previously with their respective files from this repository.
  - Make sure to make the necessary edits to the code outlined in the "Getting Started" section, including editing endpoint links and API keys to fit your tapestry page.
4. Open up a command prompt or terminal window and run the following:
   ```
   npm run build
   npm start
   ```
   Log into Wordpress and open a tapestry page linked to the code. 

## Dependencies
- Tapestry Tool 2.0 Wordpress Plugin: https://github.com/tapestry-tool/tapestry-wp\

## Contributing (Optional) 

1. Instructions for public contributions here
2. Create a wiki page if this is long

## Team

### Faculty:
Dr. Steven Barnes, Associate Professor of Teaching, Department of Psychology

### Current EML Student Team:

- Victoria Lim -  Lead and UI/UX Designer
- Sophia Yang - Developer
- Jung Yi Cau - Designer
- Grace Bell - Volunteer 

## Troubleshooting
- List any common 'gotcha's with the project here

## Documentation
- [Project Wiki Link Here](https://wiki.ubc.ca/Documentation:23-3002_Tapestry_Tool_ML)
- [Link to other forms of doc here]()
