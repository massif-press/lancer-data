const fs = require('fs');
var currentDir = process.cwd();
var files = fs.readdirSync('./lib');
let contents = ""
let valid = true

files.forEach(filename => {
    contents = fs.readFileSync(`./lib/${filename}`, 'utf-8')
    try {
        JSON.parse(contents)
    } catch (e) {
        console.error(`invalid JSON in ${filename}`);
        valid = false;
    }
});

if (!valid) {
    throw "One or more JSON files are invalid."
}
