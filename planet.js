document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Add a little "hover wobble" effect for the planet
const planet = document.querySelector('.planet');
planet.addEventListener('mouseover', () => {
  planet.style.transform = 'scale(1.05)';
});

planet.addEventListener('mouseout', () => {
  planet.style.transform = 'scale(1)';
});