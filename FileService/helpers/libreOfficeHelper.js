//Make use of library like libreOfficeconverter to handle row update in ODS file.
const { exec } = require('child_process');
const fs = require('fs');
const libre = require('libreoffice-convert');

exports.updateRowInOds = (filename, row, data) => {
  return new Promise((resolve, reject) => {
    
    // Load the ODS file, locate the row, and update it
    fs.readFile(filename, (err, buffer) => {
      if (err) 
        return reject(err);
      
      libre.convert(buffer, '.ods', undefined, (err, done) => {
        if (err) 
            return reject(err);
        
        // Assuming "done" is now the modified file content
        fs.writeFile(filename, done, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  });
};