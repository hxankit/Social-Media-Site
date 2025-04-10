import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const GetDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default GetDataUri;