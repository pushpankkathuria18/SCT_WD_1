document.addEventListener("mousemove", function (e) {
  let glow = document.createElement("div");
  glow.className = "glow";
  glow.style.left = e.pageX + "px";
  glow.style.top = e.pageY + "px";
  document.body.appendChild(glow);

  setTimeout(() => glow.remove(), 400);
});

document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("navbar").classList.toggle("show");
});
