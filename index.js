import { readdir, readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";

const inputFolderPath = process.argv[2] || 'test-data/input';

try {
  const inputFilenames = await readdir(inputFolderPath);
  const inputFilePaths = inputFilenames.map((name) => inputFolderPath + '/' + name);

  console.log('directory readout', inputFilePaths);
} catch (e) {
  console.error(e);
}