// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Active nav link based on scroll
const links = [...document.querySelectorAll(".nav-link")];
const sections = links
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActive() {
  const y = window.scrollY + 120;
  let current = sections[0]?.id || "profile";

  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }

  links.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
}

window.addEventListener("scroll", setActive, { passive: true });
setActive();
