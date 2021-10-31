import { readdir, readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";

const inputFolderPath = process.argv[2] || 'test-data/input';

try {
  const inputFilenames = await readdir(inputFolderPath);
  const inputFilePaths = inputFilenames.map((name) => inputFolderPath + '/' + name);

  const inputBuffers = await Promise.all(inputFilePaths.map((path) => readFile(path)));
  const inputPDFDocs = await Promise.all(inputBuffers.map((buffer) => PDFDocument.load(buffer)));
  const outputDoc = await PDFDocument.create();
  const copiedPages = await Promise.all(inputPDFDocs.map((doc) => outputDoc.copyPages(doc, [0])));
  const flattenedPages = copiedPages.flat();
  flattenedPages.forEach((page) => outputDoc.addPage(page));
  
  console.log(outputDoc);
} catch (e) {
  console.error(e);
}