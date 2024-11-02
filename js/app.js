// Stock la div #com dans la constante commentaire
const timer = document.querySelector("#com");
const allTitles = document.querySelectorAll('.title');
const root = document.documentElement;
const titlesArr = [];
allTitles.forEach(t => {titlesArr.push(t.innerText)});

let hue = 0;
let separateur = " ";

// Créé une constante date et y stock l'objet Date
let date = new Date();

// Injection de l'heure, minutes et secondes dans le DOM
setInterval(() => {
  hue < 360 ? hue+=2 : hue=0;
  root.style.setProperty('--hue', hue); // Ne pas remplacer --hue!
  date = new Date();
  if (date.getSeconds() % 10 == 0) {
    let temp = titlesArr[0];
    titlesArr.shift();
    titlesArr.push(temp);
    allTitles.forEach((t, i) => {t.innerText = titlesArr[i]});
  }
  separateur =
    date.getSeconds() % 2 == 0
      ? " "
      : '<span class="flash" style="color:var(--txt-accent-color)">:</span>';
  timer.innerHTML =
    date
      .getHours()
      .toLocaleString("fr-FR", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
    separateur +
    date
      .getMinutes()
      .toLocaleString("fr-FR", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
    separateur +
    date
      .getSeconds()
      .toLocaleString("fr-FR", { minimumIntegerDigits: 2, useGrouping: false });
}, 1000);

// Plusieurs lignes de commentaires
// à la suite pour le test de 
// minification

