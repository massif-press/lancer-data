#!/usr/bin/env node
const readline = require('readline');

const fs = require('fs');

const path = require('path');

const folderPath = '../lib';
const ignore = ['manufacturers.json', 'weapons.json', 'systems.json', 'mods.json'];

const ignoreWords = ['{VAL}', '({VAL})', '{VAL}+', 'HP', 'GRIT', 'SP', 'AP', '(AP)'];

function decapitalize() {
  function decap(string) {
    const words = string.split(' ');
    const capitalizedWords = words.map((word) => {
      if (ignoreWords.some((x) => x === word)) return word;
      else if (word === word.toUpperCase()) {
        return word.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        return word;
      }
    });
    const capitalizedString = capitalizedWords.join(' ');
    return capitalizedString;
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    files.forEach((file) => {
      if (ignore.some((x) => x === file)) return;
      const filePath = path.join(folderPath, file);
      console.log(filePath);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', file, err);
          return;
        }

        try {
          let fixed = 0;
          const jsonObject = JSON.parse(data);
          if (Array.isArray(jsonObject)) {
            jsonObject.forEach((e) => {
              if (e.name) {
                if (e.name.includes('ERR:')) return;
                if (e.name === e.name.toUpperCase()) {
                  const decapped = decap(e.name);
                  if (e.name !== decapped) {
                    // console.log('decapped:', e.name, decapped);
                    e.name = decapped;
                    fixed++;
                  }
                }
              }
            });
            fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), (err) => {
              if (err) {
                console.error('Error writing file:', file, err);
                return;
              }
            });

            console.log(`fixed: ${fixed} in file: ${file}`);
          }
        } catch (err) {
          console.error('Error parsing JSON in file:', file, err);
        }
      });
    });
  });
}

function collapseEffect() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(folderPath, file);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err);
            return;
          }

          try {
            let jsonData = JSON.parse(data);
            let modified = false;

            jsonData = jsonData.map((obj) => {
              if (obj.hasOwnProperty('effect') && typeof obj.effect === 'object') {
                obj.effect = obj.effect.description;
                modified = true;
              }
              return obj;
            });

            if (modified) {
              fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                  console.error(`Error writing file ${file}:`, err);
                } else {
                  console.log(`Updated ${file}`);
                }
              });
            }
          } catch (parseError) {
            console.error(`Error parsing JSON in file ${file}:`, parseError);
          }
        });
      }
    });
  });
}

async function collectEffects() {
  const collection = {
    active_effects: [],
    add_status: [],
    add_condition: [],
    remove_condition: [],
    add_resist: [],
    damage: [],
    range: [],
    save: [],
    bonus_damage: [],
  };

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    const promises = [];

    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(folderPath, file);
        promises.push(
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading file ${file}:`, err);
              return;
            }
            try {
              const jsonData = JSON.parse(data);
              if (!Array.isArray(jsonData)) return;
              console.log(`Processing ${file} with ${jsonData.length} entries`);
              jsonData.forEach((obj) => {
                const elemArr = [obj];
                if (obj.actions) elemArr.push(...obj.actions);
                if (obj.deployables) elemArr.push(...obj.deployables);
                elemArr.forEach((e) => {
                  if (e.active_effects) {
                    for (const effect of e.active_effects) {
                      if (Object.keys(effect).length > 2) {
                        collection.active_effects.push(effect);
                      }
                    }
                  }
                  if (e.add_status) collection.add_status.push(e.add_status);
                  if (e.add_condition) collection.add_condition.push(e.add_condition);
                  if (e.remove_condition) collection.remove_condition.push(e.remove_condition);
                  if (e.add_resist) collection.add_resist.push(e.add_resist);
                  if (e.damage) collection.damage.push(e.damage);
                  if (e.range) collection.range.push(e.range);
                  if (e.save) collection.save.push(e.save);
                  if (e.bonus_damage) collection.bonus_damage.push(e.save);
                });
              });
            } catch (parseError) {
              console.error(`Error parsing JSON in file ${file}:`, parseError);
            }
          })
        );
      }
    });
  });

  await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for all files to be processed

  await fs.writeFile(
    'output/activeEffects.json',
    JSON.stringify(collection, null, 2),
    'utf8',
    (err) => {
      if (err) {
        console.error('Error writing activeEffects.json:', err);
      } else {
        console.log('activeEffects.json updated');
      }
    }
  );
}

// run

const functions = {
  1: { name: 'Decapitalize Item names', fn: decapitalize },
  2: { name: 'Collapse Effect Props', fn: collapseEffect },
  3: { name: 'Collect Active Effects', fn: collectEffects },
};

console.log('Choose a function:');
for (const key in functions) {
  console.log(`${key}. ${functions[key].name}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('> ', (answer) => {
  if (functions[answer]) {
    functions[answer].fn();
  } else {
    console.log('Invalid choice.');
  }
  rl.close();
});
