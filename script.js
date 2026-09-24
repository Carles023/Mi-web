/* =========================================================
   WEB PERSONAL · Carles Tudela Garcia — interacció mínima
   ========================================================= */
(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* 0. BOTÓ DE TEMA (fosc / clar) */
  const rel = document.documentElement;
  const btnTema = $("#btnTema");
  const metaTema = $("#metaTema");
  const CLAU = "tema";

  const pintaTema = () => {
    const clar = rel.dataset.theme === "light";
    const objectiu = clar ? "fosc" : "clar";
    if (btnTema) {
      $(".btn-tema__txt", btnTema).textContent = clar ? "Fosc" : "Clar";
      btnTema.setAttribute("aria-label", "Canviar a mode " + objectiu);
    }
    if (metaTema) metaTema.content = clar ? "#f4f4f1" : "#0a0a0b";
  };
  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const nou = rel.dataset.theme === "light" ? "dark" : "light";
      rel.dataset.theme = nou;
      localStorage.setItem(CLAU, nou);
      pintaTema();
    });
    pintaTema();
  }

  /* 1. Any al peu */
  const any = $("#any");
  if (any) any.textContent = new Date().getFullYear();

  /* 2. Menú mòbil */
  const btnMenu = $("#btnMenu"), nav = $("#nav");
  if (btnMenu && nav) {
    btnMenu.addEventListener("click", () => {
      const obert = nav.classList.toggle("oberta");
      btnMenu.setAttribute("aria-expanded", obert);
    });
    $$("a", nav).forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("oberta");
      btnMenu.setAttribute("aria-expanded", "false");
    }));
  }

  /* 3. Barra de progrés */
  const barra = $("#progresBarra");
  let fent = false;
  const pinta = () => {
    const d = document.documentElement;
    const total = d.scrollHeight - d.clientHeight;
    barra.style.width = (total > 0 ? (d.scrollTop / total) * 100 : 0) + "%";
    fent = false;
  };
  addEventListener("scroll", () => { if (!fent) { fent = true; requestAnimationFrame(pinta); } }, { passive: true });
  pinta();

  /* 4. Enllaç actiu */
  const enllacos = $$(".nav a[href^='#']");
  const seccions = enllacos.map(a => $(a.getAttribute("href"))).filter(Boolean);
  const obsNav = new IntersectionObserver(ents => {
    ents.forEach(e => e.isIntersecting &&
      enllacos.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id)));
  }, { rootMargin: "-45% 0px -50% 0px" });
  seccions.forEach(s => obsNav.observe(s));

  /* 5. Aparició al fer scroll */
  const revelador = new IntersectionObserver((ents, obs) => {
    ents.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add("visible"), i * 80);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach(el => revelador.observe(el));

  /* 6. Barres d'estadístiques (cada una del seu color) */
  $$(".bares i[data-barra]").forEach(b => {
    new IntersectionObserver((ents, obs) => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        b.style.width = b.dataset.barra + "%";
        obs.unobserve(b);
      });
    }, { threshold: 0.4 }).observe(b);
  });

  /* 7. Copiar el correu */
  const btnCopiar = $("#copiar"), mail = $("#mail");
  if (btnCopiar && mail) {
    btnCopiar.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(mail.textContent.trim());
        btnCopiar.textContent = "Copiat";
      } catch { btnCopiar.textContent = "Copia manual"; }
      setTimeout(() => (btnCopiar.textContent = "Copiar"), 1600);
    });
  }
})();