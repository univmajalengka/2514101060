/* =====================================================
   DATA HERO
===================================================== */
const destinations = [
  {
    name: "Pagoda Merah",
    image: "img/tiongkok-pagoda.jpeg",
  },
  {
    name: "Taman Minka",
    image: "img/jepang-minka.jpeg",
  },
  {
    name: "Taman Hanok",
    image: "img/korea-hanok.jpeg",
  },
  {
    name: "Cappadocia",
    image: "img/cappadocia-balon.jpeg",
  },
  {
    name: "Kuil Ganesha",
    image: "img/kuil-ganesha.jpeg",
  },
  {
    name: "Red Fort",
    image: "img/india-redfort.jpeg",
  },
  {
    name: "Mekkah",
    image: "img/arabsaudi-mekkah.jpeg",
  },
  {
    name: "Santorini",
    image: "img/yunani-santorini.jpeg",
  },
  {
    name: "Stonehenge",
    image: "img/inggris-stonehenge.jpeg",
  },
  {
    name: "Minifarm",
    image: "img/minifarm.jpeg",
  },
  {
    name: "Lauterbrunnen",
    image: "img/swiss-lauterbrunnen.jpeg",
  },
  {
    name: "Cotswold",
    image: "img/inggris-cotswold.jpeg",
  },
  {
    name: "Zaanse Schans",
    image: "img/belanda-zaanse.jpeg",
  },
];

/* =====================================================
   ELEMENT
===================================================== */
const cardDeck = document.getElementById("cardDeck");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const slideNumber = document.getElementById("slideNumber");
const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

/* =====================================================
   CREATE HERO CARDS
===================================================== */
destinations.forEach((destination, index) => {
  const card = document.createElement("article");
  card.className = "travel-card";
  card.dataset.index = index;
  card.dataset.position = index;
  card.innerHTML = `
    <img
      src="${destination.image}"
      alt="${destination.name}"
    >
    <div class="card-info">
      <small>DESTINASI</small>
      <h3>
        ${destination.name}
      </h3>
    </div>
  `;
  cardDeck.appendChild(card);
});
let cards = Array.from(document.querySelectorAll(".travel-card"));
let currentIndex = 0;
let isAnimating = false;

/* =====================================================
   UPDATE STACK
===================================================== */
function updateStack() {
  cards.forEach((card, index) => {
    card.classList.remove("shuffle-out");
    card.dataset.position = index;
    if (index > 3) {
      card.style.opacity = "0";
      card.style.pointerEvents = "none";
    } else {
      card.style.opacity = "1";
      card.style.pointerEvents = index === 0 ? "auto" : "none";
    }
  });
  updateNumber();
}

/* =====================================================
   SLIDE NUMBER
===================================================== */
function updateNumber() {
  const number = String(currentIndex + 1).padStart(2, "0");
  const total = String(destinations.length).padStart(2, "0");
  slideNumber.textContent = `${number} / ${total}`;
}

/* =====================================================
   NEXT
===================================================== */
function nextCard() {
  if (isAnimating) return;
  isAnimating = true;
  const activeCard = cards[0];
  activeCard.classList.add("shuffle-out");
  setTimeout(() => {
    cardDeck.appendChild(activeCard);
    cards.push(cards.shift());
    currentIndex = (currentIndex + 1) % destinations.length;
    updateStack();
    isAnimating = false;
  }, 600);
}

/* =====================================================
   PREVIOUS
===================================================== */
function previousCard() {
  if (isAnimating) return;
  isAnimating = true;
  const lastCard = cards.pop();
  cardDeck.insertBefore(lastCard, cardDeck.firstChild);
  cards.unshift(lastCard);
  currentIndex = (currentIndex - 1 + destinations.length) % destinations.length;
  lastCard.dataset.position = "3";
  updateStack();
  setTimeout(() => {
    isAnimating = false;
  }, 650);
}

/* =====================================================
   BUTTON
===================================================== */
nextBtn.addEventListener("click", () => {
  nextCard();
  resetAutoPlay();
});
prevBtn.addEventListener("click", () => {
  previousCard();
  resetAutoPlay();
});

/* =====================================================
   AUTO PLAY
===================================================== */
let autoPlay = setInterval(nextCard, 4500);
function resetAutoPlay() {
  clearInterval(autoPlay);
  autoPlay = setInterval(nextCard, 4500);
}

/* =====================================================
   KEYBOARD
===================================================== */
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextCard();
    resetAutoPlay();
  }
  if (event.key === "ArrowLeft") {
    previousCard();
    resetAutoPlay();
  }
});

/* =========================================================
    NAVBAR ACTIVE ON SCROLL 
========================================================= */
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = [
  { id: "beranda", element: document.getElementById("beranda") },
  { id: "destinasi", element: document.getElementById("destinasi") },
  { id: "paket", element: document.getElementById("paket") },
  { id: "galeri", element: document.getElementById("galeri") },
  { id: "video", element: document.getElementById("video") },
  { id: "tentang", element: document.getElementById("tentang") },
  { id: "kontak", element: document.getElementById("kontak") },
].filter((section) => section.element);

/* Ganti active */
function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

/* Deteksi section yang sedang terlihat */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  },
  { root: null, rootMargin: "-35% 0px -55% 0px", threshold: 0 },
);

/* Observe semua section */
sections.forEach((section) => {
  sectionObserver.observe(section.element);
});

/* =====================================================
   THEME
===================================================== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeBtn.querySelector("i");
  if (document.body.classList.contains("dark")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

/* =====================================================
   MOBILE MENU
===================================================== */
menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  const icon = menuBtn.querySelector("i");
  if (navMenu.classList.contains("show")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});

/* =====================================================
   CLOSE MOBILE MENU
===================================================== */
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    const icon = menuBtn.querySelector("i");
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  });
});

/* =====================================================
   INITIAL
===================================================== */
updateStack();

/* =========================================================
   DESTINATION SLIDER
========================================================= */
const destinationTrack = document.getElementById("destinationTrack");
const destinationCards = document.querySelectorAll(".destination-card");
const destinationPrev = document.getElementById("destinationPrev");
const destinationNext = document.getElementById("destinationNext");
const destinationNumber = document.getElementById("destinationNumber");
const destinationProgress = document.getElementById("destinationProgress");

let destinationIndex = 0;

/* Berapa card yang terlihat */
function getVisibleCards() {
  if (window.innerWidth <= 600) {
    return 1;
  }
  if (window.innerWidth <= 900) {
    return 2;
  }
  return 3;
}

/* Update slider */
function updateDestinationSlider() {
  const visibleCards = getVisibleCards();
  const card = destinationCards[0];
  if (!card) return;
  const cardWidth = card.offsetWidth;
  const gap = 18;
  const maxIndex = destinationCards.length - visibleCards;
  if (destinationIndex > maxIndex) {
    destinationIndex = maxIndex;
  }
  if (destinationIndex < 0) {
    destinationIndex = 0;
  }
  destinationTrack.style.transform = `translateX(-${destinationIndex * (cardWidth + gap)}px)`;

  /* Angka */
  const currentNumber = String(destinationIndex + 1).padStart(2, "0");
  const totalNumber = String(destinationCards.length).padStart(2, "0");
  destinationNumber.textContent = `${currentNumber} / ${totalNumber}`;

  /* Progress */
  const progress = ((destinationIndex + 1) / destinationCards.length) * 100;
  destinationProgress.style.width = `${progress}%`;

  /* Button */
  destinationPrev.disabled = destinationIndex === 0;
  destinationNext.disabled = destinationIndex === maxIndex;
}

/* Next */
destinationNext.addEventListener("click", () => {
  const visibleCards = getVisibleCards();
  const maxIndex = destinationCards.length - visibleCards;
  if (destinationIndex < maxIndex) {
    destinationIndex++;
    updateDestinationSlider();
  }
});

/* Previous */
destinationPrev.addEventListener("click", () => {
  if (destinationIndex > 0) {
    destinationIndex--;
    updateDestinationSlider();
  }
});

/* Resize */
window.addEventListener("resize", updateDestinationSlider);

/* Initial */
updateDestinationSlider();

/* ========================================================= 
  GALLERY 
========================================================= */
const galleryMore = document.getElementById("galleryMore");
const galleryGrid = document.getElementById("galleryGrid");
if (galleryMore && galleryGrid) {
  galleryMore.addEventListener("click", () => {
    const hiddenPhotos = galleryGrid.querySelectorAll(".gallery-hidden");
    const isExpanded = galleryMore.classList.contains("expanded");
    hiddenPhotos.forEach((photo) => {
      photo.style.display = isExpanded ? "none" : "block";
    });
    galleryMore.classList.toggle("expanded");
    if (isExpanded) {
      galleryMore.innerHTML = ` Lihat Semua <i class="fa-solid fa-arrow-down"></i> `;
    } else {
      galleryMore.innerHTML = ` Tutup Galeri <i class="fa-solid fa-arrow-up"></i> `;
    }
  });
}
