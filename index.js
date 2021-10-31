import { readdir, readFile, writeFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";

const inputFolderPath = process.argv[2] || 'test-data/input';
const outputFolderPath = process.argv[3] || 'test-data/output';
const outputFileName = `collated-${Date.now()}.pdf`;
const outputPath = outputFolderPath + '/' + outputFileName;

try {
  const inputFilenames = await readdir(inputFolderPath);
  const inputFilePaths = inputFilenames.map((name) => inputFolderPath + '/' + name);

  inputFilePaths.forEach((path) => console.log('reading from', path));

  const inputBuffers = await Promise.all(inputFilePaths.map((path) => readFile(path)));
  const inputPDFDocs = await Promise.all(inputBuffers.map((buffer) => PDFDocument.load(buffer)));
  const outputDoc = await PDFDocument.create();
  const copiedPages = await Promise.all(inputPDFDocs.map((doc) => outputDoc.copyPages(doc, [0])));
  const flattenedPages = copiedPages.flat();
  flattenedPages.forEach((page) => outputDoc.addPage(page));
  const outputBuffer = await outputDoc.save();

  console.log('writing', flattenedPages.length, 'pages to', outputPath)

  await writeFile(outputPath, outputBuffer);

  console.log('All done!');
} catch (e) {
  console.error(e);
}