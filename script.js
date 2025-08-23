document.addEventListener("DOMContentLoaded", () => {
  // === Skill card flip (existing) ===
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Flip only on mobile
      if (window.innerWidth <= 768) {
        card.classList.toggle("flipped");
      }
    });
  });

  // Reset flips when resizing back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      skillCards.forEach((card) => card.classList.remove("flipped"));
    }
  });

  // === Scroll reveal for sections ===
  const sections = document.querySelectorAll("section");

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach((section) => {
      const boxTop = section.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        section.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // === Floating particles in hero background ===
  const canvas = document.createElement("canvas");
  canvas.classList.add("particles");
  document.querySelector(".hero").appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 25000); // density
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 120, ${p.alpha})`;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;

      // bounce softly
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
});
