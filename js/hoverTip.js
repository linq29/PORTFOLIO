const tip = document.getElementById("hover-tip");

if (tip) {
  const thumbLinks = document.querySelectorAll(".thumb, .side-thumb");

  thumbLinks.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const label = el.dataset.hoverTip || "";
      tip.textContent = label;
      tip.classList.add("visible");
    });

    el.addEventListener("mousemove", (e) => {
      const offset = 16;
      let x = e.clientX + offset;
      let y = e.clientY + offset;

      if (x + tip.offsetWidth > window.innerWidth - 8) {
        x = e.clientX - tip.offsetWidth - offset;
      }
      if (y + tip.offsetHeight > window.innerHeight - 8) {
        y = e.clientY - tip.offsetHeight - offset;
      }

      tip.style.left = x + "px";
      tip.style.top = y + "px";
    });

    el.addEventListener("mouseleave", () => {
      tip.classList.remove("visible");
    });
  });
}
