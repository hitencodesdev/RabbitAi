import xlsx from 'xlsx';
import { Readable } from 'stream';
import csvParser from 'csv-parser';

/**
 * Parses a Multer file into JSON array based on its extension.
 */
export const parseData = async (file) => {
  const originalname = file.originalname.toLowerCase();

  if (originalname.endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(file.buffer);

      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  } 
  
  if (originalname.endsWith('.xlsx')) {
    // Read the File Buffer directly
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    
    // Get the first sheet 
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(sheet);
    return data;
  }

  throw new Error('Unsupported file format. Please upload .csv or .xlsx.');
};
