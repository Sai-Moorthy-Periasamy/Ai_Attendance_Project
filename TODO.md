# TODO for Enhancing OCR Processing in MarkUploadPage.jsx

1. [x] Update handleUpload function to use data.words instead of data.text.
2. [x] Filter words by confidence > 50%.
3. [x] Sort words by y-coordinate (bbox.top).
4. [x] Group words into rows based on y-position proximity (threshold 10px).
5. [x] For each row, sort by x-coordinate and map to columns (rollno, name, marks), skip header row.
6. [x] Set ocrData with parsed records.
7. [x] Test the functionality with a sample table image (adjusted yThreshold to 20px for better row detection).
