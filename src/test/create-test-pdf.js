const fs = require('fs');
const PDFDocument = require('pdfkit');

// Create a document
const doc = new PDFDocument();

// Pipe its output to a file
doc.pipe(fs.createWriteStream('public/test-files/test.pdf'));

// Add content to the PDF
doc.fontSize(25).text('Test Training Material', 100, 100);
doc.fontSize(16).text('This is a test PDF for end-to-end testing', 100, 150);

// Add some more content
doc.moveDown();
doc.fontSize(14).text('This PDF is used to test the training module functionality in the Agent Agreement Nexus application.', {
  width: 400,
  align: 'justify'
});

doc.moveDown();
doc.text('When an agent views this PDF and marks it as completed, a record should be created in the training_completions table.');

// Finalize the PDF and end the stream
doc.end();
