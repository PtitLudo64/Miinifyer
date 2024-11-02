const fs = require("node:fs/promises");
const path = require('node:path');

const firstLetter = 97;  // ASCII code for 'a'
const lastLetter = 122;  // ASCII code for 'z'
const correspondenceArray = []; // Stores each variable name and its label

let hval = 0; // Left letter from the label
let lval = firstLetter; // Right hand letter of the label

let comStart = '';
let comEnd = ' ';

/**
 * Supplies a short name like 'a', 'b', ... 'z', 'za', 'zb', ... 'zz'
 * for a given variable or constant parameter passed in a string.
 * Stores the label and name couple in an array :
 * 
 *  ┌─────────┬───────┬───────────────┐
 *  │ (index) │ label │ name          │
 *  ├─────────┼───────┼───────────────┤
 *  │ 0       │ 'a'   │ 'timer        │
 *  │ 1       │ 'b'   │ 'date'        │
 *  │ ...     │ '...' │ '???'         │
 * 
 * That makes 702 possibilities. 
 * Enought for all variables and constants in a JS script?
 * 
 * @param {String} varName 
 */
const setLabelName = (varName) => {
  let value ='';

  if (hval <= lastLetter) {
  value =
    hval >= firstLetter
      ? String.fromCharCode(hval) + String.fromCharCode(lval)
      : String.fromCharCode(lval);
    correspondenceArray.push({label: value, name: varName});
    lval++;
    if (lval > lastLetter && hval < lastLetter) {
      hval == 0 ? hval = firstLetter : hval++;
      lval = firstLetter;
    }
  }  
}


async function minify(dir, base, ext) {
  const regArray = [
    {regex: /\s*{\s*/g, replacement: '{'},
    {regex: /\s*=\s*/g, replacement: '='},
    {regex: /\s*:\s*/, replacement: ':'},
    {regex: /\s*\+\s*/g, replacement: '+'},
    {regex: /\s*,\s*/g, replacement: ','},
    {regex: /\s*%\s*/g, replacement: '%'},
    {regex: /\s*\?\s*/g, replacement: '?'},
  ];

  const variablesArray = [
    'const', 'let'
  ];

  try {
    let data = await fs.readFile(`${dir}/${base}${ext}`, { encoding: "utf8" });
    if (data) {
      
      regArray.forEach(regEx => {
        data = data.replace(regEx.regex, regEx.replacement);
      });

      const txtArr = data.split("\n");
      let str = '';
      let isCom = false;
      let start, end;
      txtArr.forEach(txt => {
        if (ext === '.js') {
          variablesArray.forEach(v => {
            let isVar = txt.search(v+' ');
            if (isVar > -1) {
              let select = isVar + v.length + 1;
              const myVar = txt.substring(select, txt.indexOf('=', select));
              if (myVar.length > 2)
                setLabelName(myVar);
            }
          });
        }
        start = txt.indexOf(comStart);
        comEnd != '' ? end = txt.indexOf(comEnd) : end = 0;
        if ( start > -1) {
          isCom = true;
        }

        if (start>-1 && end>-1) {
          // commentaire sur 1 ligne
          isCom = false;
          txt = txt.substring(0, start);
        }

        if (isCom==true && end === -1) {
          // Commentaire sur plusieurs lignes
          txt = " ";
        }
        if (isCom==true && end > -1) {
          // fin de commentaire
          txt = txt.substring(end + 3, txt.length);
          isCom = false;
        }

        txt = txt.replace(/\s*:\s*/, ':');

        correspondenceArray.forEach( elt => {
          let globalElt = new RegExp(`(?<!-)${elt.name}\\b`, 'g');

          if (txt.indexOf(elt.name) > -1) {
            txt = txt.replace(globalElt, elt.label);
          }
        });

        str+= txt.trim();
      });
      fs.writeFile(`${dir}/${base}.min${ext}`, str, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      console.log("Fichier vide");
    }
  } catch (err) {
    console.log(err);
  }
}



if (process.argv[2]) {
  const dirName = path.dirname(process.argv[2]);
  const baseName = path.basename(process.argv[2], path.extname(process.argv[2]));
  const extName = path.extname(process.argv[2]);
  switch (extName) {
    case '.css':
        comStart = '/* ';
        comEnd = ' */';
      break;
    case '.js':
        comStart = '// ';
        comEnd = '';
      break;
  
    default:
        console.log('Format pas reconnu');
      break;
  }
  minify(dirName, baseName, extName);
} else {
  console.log('Pas de nom de fichier défini');
  console.log(`Usage : ${process.argv[1]} nomDeFichier`);
}