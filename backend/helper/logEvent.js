const fs = require('fs').promises;
const path = require('path');

const fileName = path.join(__dirname, '../logs', 'logs.log');
const logEvents=  async(msg) => {
    try {
     fs.appendFile(filename, msg)
    }catch (error) {
        console.error(error);
    }
}
