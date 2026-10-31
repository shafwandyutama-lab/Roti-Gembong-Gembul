
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});
  

const canvas = document.querySelector("#plum-petals");
const ctx = canvas.getContext("2d");

let petals = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Petal {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial
      ? Math.random() * canvas.height
      : -20;

    this.size = Math.random() * 5 + 4;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.025 - 0.012;
    this.swing = Math.random() * 0.03 + 0.01;
    this.phase = Math.random() * Math.PI * 2;
    this.opacity = Math.random() * 0.4 + 0.45;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.phase) * 0.5;
    this.rotation += this.rotationSpeed;
    this.phase += this.swing;

    if (
      this.y > canvas.height + 20 ||
      this.x < -30 ||
      this.x > canvas.width + 30
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#f4a7bb";

    // Bentuk kelopak bunga
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(
      this.size, -this.size,
      this.size * 1.3, this.size * 0.5,
      0, this.size
    );
    ctx.bezierCurveTo(
      -this.size * 1.3, this.size * 0.5,
      -this.size, -this.size,
      0, -this.size
    );
    ctx.fill();

    ctx.restore();
  }
}

function createPetals() {
  const amount = window.innerWidth < 600 ? 18 : 35;

  petals = Array.from(
    { length: amount },
    () => new Petal()
  );
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  petals.forEach((petal) => {
    petal.update();
    petal.draw();
  });

  animationId = requestAnimationFrame(animatePetals);
}

function startPetals() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  resizeCanvas();
  createPetals();
  animatePetals();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else if (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    animatePetals();
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  createPetals();
});

startPetals();
