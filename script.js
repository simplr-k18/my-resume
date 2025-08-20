
// script.js
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Toggle "flipped" class when clicked
      card.classList.toggle("flipped");
    });
  });
});
