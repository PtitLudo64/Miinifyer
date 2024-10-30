// Stock la div #com dans la constante commentaire
const timer = document.querySelector("#com");
const bidon = 'Truc';

let separateur = " ";

// Créé une constante date et y stock l'objet Date
let date = new Date();

// Injection de l'heure, minutes et secondes dans le DOM
setInterval(() => {
  date = new Date();
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

