const express = require('express');
const multer = require('multer');
const PDFParser = require('pdf2json');

const app = express();
const port = 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.post('/extract-pdf-text', upload.single('file'), (req, res) => {
    const fileBuffer = req.file.buffer;
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
    pdfParser.on('pdfParser_dataReady', pdfData => {
        let text = '';
        pdfData.formImage.Pages.forEach(page => {
            page.Texts.forEach(item => {
                text += Buffer.from(item.R[0].T, 'base64').toString() + ' '; 
            });
        });
        res.send(text);
    });

    pdfParser.parseBuffer(fileBuffer); 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
