document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initReveal();
  initCounters();
  initHeader();
  initScrollProgress();
  initFAQ();
  initContactForm();
  initSpotlightCards();
  initParticles();
  initParallax();
});

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("menuOverlay");
  const drawer = overlay?.querySelector(".menu-drawer");
  if (!toggle || !overlay || !drawer) return;

  const setMenu = (open) => {
    toggle.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    overlay.setAttribute("aria-hidden", String(!open));
    if (open) drawer.querySelector("a")?.focus();
  };

  toggle.addEventListener("click", () => setMenu(!overlay.classList.contains("active")));
  overlay.addEventListener("click", (event) => {
    if (!drawer.contains(event.target)) setMenu(false);
  });
  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && overlay.classList.contains("active")) setMenu(false);
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const staggerGroups = document.querySelectorAll(
    ".services-grid, .portfolio-grid, .plans-grid, .testimonials-grid-modern, .process-list, .faq-list"
  );

  staggerGroups.forEach((group) => {
    group.querySelectorAll(".reveal").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 420)}ms`);
    });
  });

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("active");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px" });

  elements.forEach((element) => observer.observe(element));
}

function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };

  update();
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;

  const animate = (element) => {
    const target = Number(element.dataset.target || 0);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const startedAt = performance.now();
    const duration = 1300;

    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
}

function initHeader() {
  const header = document.querySelector(".header");
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (!header) return;

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 30);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!("IntersectionObserver" in window) || !navLinks.length) return;
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -65%", threshold: [0, .15, .4] });
  sections.forEach((section) => observer.observe(section));
}

function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    const toggle = () => {
      const willOpen = !item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", willOpen);
      question.setAttribute("aria-expanded", String(willOpen));
    };

    question.addEventListener("click", toggle);
    question.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const text = `Olá, Morus! Meu nome é ${name}.\n\nEmail: ${email}\n\nSobre meu projeto: ${message}`;
    const url = `https://wa.me/5521981573792?text=${encodeURIComponent(text)}`;
    if (status) status.textContent = "Tudo certo — abrindo o WhatsApp com sua mensagem.";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function initSpotlightCards() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const cards = document.querySelectorAll(
    ".service-card, .plan-card, .testimonial-card, .contato-card, .contato-form, .portfolio-card"
  );

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x.toFixed(2)}%`);
      card.style.setProperty("--my", `${y.toFixed(2)}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "0%");
    });
  });
}

function initParticles() {
  const canvas = document.querySelector(".hero-particles");
  if (!canvas || window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const particles = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), radius: Math.random() * 1.2 + .4, speed: Math.random() * .0004 + .00015, opacity: Math.random() * .3 + .15 }));
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      if (particle.y < 0) particle.y = 1;
      context.beginPath();
      context.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(220,190,120,${particle.opacity})`;
      context.fill();
    });
    frame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else draw();
  });
}

function initParallax() {
  const hero = document.querySelector(".hero-cinematic");
  const video = hero?.querySelector(".hero-video-bg");
  if (!hero || !video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking || window.scrollY > hero.offsetHeight) return;
    ticking = true;
    requestAnimationFrame(() => {
      video.style.transform = `translateY(${window.scrollY * .12}px) scale(1.04)`;
      ticking = false;
    });
  }, { passive: true });
}
