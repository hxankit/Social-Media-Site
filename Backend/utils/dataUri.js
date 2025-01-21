
import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataUriParser();

const getDataUri = (file) => {
    if (!file || !file.originalname || !file.buffer) {
        throw new Error("Missing required parameter: file, or its properties.");
    }

    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content; // Ensure the function returns the data URI
};

export default getDataUri;

