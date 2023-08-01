// import { getDocument } from 'pdfjs-dist';

// export async function extractTextFromPDF(file) {
//   // Create a new FileReader instance
//   const reader = new FileReader();

//   // Create a promise that resolves with the file's ArrayBuffer
//   const arrayBuffer = await new Promise((resolve) => {
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsArrayBuffer(file);
//   });

//   // Pass the ArrayBuffer to getDocument
//   const pdf = await getDocument({ data: arrayBuffer }).promise;

//   let text = '';
//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     text += content.items.map(item => item.str).join(' ');
//   }

//   return text;
// }

// export async function extractTextFromPDF(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async function(event) {
//       const pdfData = new Uint8Array(event.target.result);
//       try {
//         const pdf = await getDocument(pdfData).promise;
//         let text = '';
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           text += content.items.map(item => item.str).join(' ');
//         }
//         resolve(text);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = function(event) {
//       reject(new Error("Error reading file: " + event));
//     };
//     reader.readAsArrayBuffer(file);
//   });
// }

// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// // Specify the path to the worker script
// GlobalWorkerOptions.workerSrc = './pdf.worker.js';

// export async function extractTextFromPDF(file) {
//   const PDFDocumentInstance = await getDocument(file).promise;

//   // Create an array to store all the promises
//   let allPagesText = [];
  
//   // Get the total number of pages in the PDF
//   let totalPages = PDFDocumentInstance.numPages;

//   // Loop through each page
//   for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//       allPagesText.push(getPageText(pageNum, PDFDocumentInstance));
//   }

//   // Return a Promise that is resolved when all the page texts are retrieved
//   return Promise.all(allPagesText).then(function (pagesText) {
//       // Join all the page texts into a single string
//       return pagesText.join(" ");
//   });
// }

// function getPageText(pageNum, PDFDocumentInstance) {
//   // Return a Promise that is resolved once the text of the page is retrieved
//   return new Promise(function (resolve, reject) {
//       PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
//           // The main trick to obtain the text of the PDF page, use the getTextContent method
//           pdfPage.getTextContent().then(function (textContent) {
//               var textItems = textContent.items;
//               var finalString = "";

//               // Concatenate the string of the item to the final string
//               for (var i = 0; i < textItems.length; i++) {
//                   var item = textItems[i];

//                   finalString += item.str + " ";
//               }

//               // Resolve promise with the text retrieved from the page
//               resolve(finalString);
//           });
//       });
//   });
// }