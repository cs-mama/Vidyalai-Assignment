const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');

const app = express();
const port = 3001;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const { file, pages } = req.body;
  const selectedPages = pages.split(',').map(page => parseInt(page));

  try {
    const pdfDoc = await PDFDocument.load(file);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNum of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const pdfBytes = await newPdfDoc.save();

    res.setHeader('Content-Disposition', 'attachment; filename=extracted.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
