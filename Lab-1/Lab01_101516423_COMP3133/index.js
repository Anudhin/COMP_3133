const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'input_countries.csv';
const canadaFile = 'canada.txt';
const usaFile = 'usa.txt';

if (fs.existsSync(canadaFile)) fs.unlinkSync(canadaFile);
if (fs.existsSync(usaFile)) fs.unlinkSync(usaFile);

const canadaStream = fs.createWriteStream(canadaFile);
const usaStream = fs.createWriteStream(usaFile);

canadaStream.write('country,year,population\n');
usaStream.write('country,year,population\n');

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    const country = row.country.toLowerCase();
    if (country === 'canada') {
      canadaStream.write(`${row.country},${row.year},${row.population}\n`);
    } else if (country === 'united states') {
      usaStream.write(`${row.country},${row.year},${row.population}\n`);
    }
  })
  .on('end', () => {
    console.log('CSV processing completed!');
    canadaStream.end();
    usaStream.end();
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });
