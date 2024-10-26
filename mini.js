const fs = require("node:fs/promises");
const path = require('node:path');

let comStart = '';
let comEnd = ' ';


async function minify(dir, base, ext) {
  // const cr = /[\s]/g;
  const regArray = [
    {regex: /\s*{\s*/, replacement: '{'},
    {regex: /\s*=\s*/, replacement: '='},
    {regex: /\s*:\s*/, replacement: ':'},
    {regex: /\s*\+\s*/, replacement: '+'},
    {regex: /\s*,\s*/g, replacement: ','},
  ];

  try {
    const data = await fs.readFile(`${dir}/${base}${ext}`, { encoding: "utf8" });
    if (data) {
      const txtArr = data.split("\n");
      let str = '';
      let isCom = false;
      let start, end;
      txtArr.forEach(txt => {
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

        regArray.forEach(regEx => {
          txt = txt.replace(regEx.regex, regEx.replacement);
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