const stitch = document.getElementById("stitch");
const stitchImg = document.getElementById("stitchImg");
const bg = document.getElementById("magic-background");
const message = document.getElementById("message");
const headerOrig = document.getElementById("headerOrig");

const originalMessage = message.innerHTML; // zapamiętujemy pierwotny format HTML
const originalHeader = headerOrig.innerHTML;

const maxClicksNormal = 5;
const COOLDOWN_TIME = 5000;

let clickCount = 0;
let clickTimestamps = [];
let cooldownTimeout = null;
let cooldownEnd = 0; // czas zakończenia cooldownu

// ustawienia tła
bg.style.position = "fixed";
bg.style.top = "0";
bg.style.left = "0";
bg.style.width = "100%";
bg.style.height = "100%";
bg.style.pointerEvents = "none";
bg.style.overflow = "hidden";
bg.style.zIndex = "-1";

const count = 200,
  defaults = {
    origin: { y: 0.7 }, // start konfetti od 70% wysokości ekranu
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

// Funkcja generująca unoszące się cząsteczki (świetlisty pył)
function createFairyDust() {
  const dust = document.createElement("div");
  dust.classList.add("dust");
  dust.style.position = "absolute";
  dust.style.width = 2 + Math.random() * 4 + "px";
  dust.style.height = dust.style.width;
  dust.style.borderRadius = "50%";
  dust.style.background = `rgba(200, ${170 + Math.random() * 60}, ${
    220 + Math.random() * 30
  }, ${0.5 + Math.random() * 0.5})`;
  dust.style.top = Math.random() * 100 + "%";
  dust.style.left = Math.random() * 100 + "%";
  dust.style.animation = `floatDust ${5 + Math.random() * 6}s linear forwards`;
  bg.appendChild(dust);
  setTimeout(() => dust.remove(), 11000);
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti");
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement("div");
    conf.classList.add("confetti");

    // losowa pozycja startowa na dole
    conf.style.left = Math.random() * 100 + "vw";

    // losowy kolor i animacja
    conf.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    conf.style.animationDuration = Math.random() * 1.5 + 2.5 + "s";
    conf.style.animationDelay = Math.random() * 0.5 + "s";
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(conf);
    setTimeout(() => conf.remove(), 3500);
  }
}

stitch.addEventListener("click", function (e) {
  e.preventDefault();
  const now = Date.now();

  // aktualizujemy cooldownEnd przy każdym kliknięciu
  cooldownEnd = now + COOLDOWN_TIME;

  clickTimestamps.push(now);
  clickTimestamps = clickTimestamps.filter((t) => now - t <= COOLDOWN_TIME);

  // bonusowy obrazek po 10 kliknięciach w COOLDOWN_TIME
  if (clickTimestamps.length >= 10) {
    stitchImg.src = "angry.png"; // obrazek bonusowy
    headerOrig.textContent = "PRZEMSAŃ KLIKAĆ!!!";
    headerOrig.style.color = "#FF0000";
    message.textContent = "Uważaj! Stitch poluje na Twojego palucha 😱";
    message.style.color = "#FF0000";
    clickTimestamps = []; // reset licznika

    let remaining = Math.max(0, cooldownEnd - now);

    if (cooldownTimeout) clearTimeout(cooldownTimeout);

    cooldownTimeout = setTimeout(() => {
      stitchImg.src = "stitch.png";
      headerOrig.textContent = originalHeader;
      headerOrig.style.color = "#F64CFC";
      message.innerHTML = originalMessage;
      message.style.color = "#333";
      clickCount = 0;
      cooldownTimeout = null;
    }, remaining);

    return; // brak konfetti przy bonusie
  }

  // Normalne kliknięcie
  if (clickCount < maxClicksNormal) {
    clickCount++;
    stitchImg.src = "stitch_happy.png";
    //createConfetti();
    // warstwowe wystrzały
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    if (cooldownTimeout) clearTimeout(cooldownTimeout);

    cooldownEnd = now + COOLDOWN_TIME;
    cooldownTimeout = setTimeout(() => {
      stitchImg.src = "stitch.png";
      headerOrig.textContent = originalHeader;
      headerOrig.style.color = "#F64CFC";
      message.innerHTML = originalMessage;
      message.style.color = "#333";
      clickCount = 0;
      cooldownTimeout = null;
    }, COOLDOWN_TIME);
  }
});

// Generowanie losowych gwiazdek w tle
function stars() {
  const starsContainer = document.getElementById("stars");
  const starCount = 30; // mniej gwiazdek = lepsza wydajność

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3 + 2 + "px";
    star.style.height = star.style.width;
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    star.style.opacity = Math.random(); // różna jasność — ładniejszy efekt

    starsContainer.appendChild(star);
    setTimeout(() => star.remove(), 8000 + Math.random() * 4000); // losowy czas życia
  }
}

// generuj nowe gwiazdki co 5 sekund
setInterval(stars, 5000);

// i od razu pierwsza partia
stars();

// Uruchamianie efektów w losowych odstępach:
setInterval(createFairyDust, 100); // delikatny pył co 400ms
