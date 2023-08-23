import pdf from 'pdf-parse';

export async function extractTextFromFile(file) {
    const data = await pdf(file);

    return data.text;
}