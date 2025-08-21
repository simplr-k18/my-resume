document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Only toggle on click for mobile/tablet
      if (window.innerWidth <= 768) {
        card.classList.toggle("flipped");
      }
    });
  });

  // Remove flipped class when window is resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      skillCards.forEach(card => {
        card.classList.remove("flipped");
      });
    }
  });
});
