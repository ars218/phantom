/* Phantom by ART — scroll experience */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const productWrap = document.getElementById("product-wrap");
  const productStage = document.getElementById("product-stage");
  const lid = document.querySelector(".case-lid");
  const budLeft = document.querySelector(".bud-left");
  const budRight = document.querySelector(".bud-right");
  const soundRing = document.querySelector(".sound-ring");
  const navItems = document.querySelectorAll(".nav-item");
  const colorBtns = document.querySelectorAll(".color-btn");
  const form = document.getElementById("notify-form");
  const toast = document.getElementById("toast");
  const featureCards = document.querySelectorAll(".feature-card");

  /* Theme switch — early, page-wide CSS vars */
  function setTheme(theme) {
    body.setAttribute("data-theme", theme);
    colorBtns.forEach((btn) => {
      const on = btn.dataset.theme === theme;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (productWrap && !reduceMotion) {
      gsap.fromTo(
        productWrap,
        { rotateY: theme === "aura" ? -12 : 12, scale: 0.96 },
        { rotateY: 0, scale: 1, duration: 0.9, ease: "power2.out" }
      );
    }
  }

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  /* Notify CTA — toast only */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (input && input.value && !input.checkValidity()) {
        input.reportValidity();
        return;
      }
      if (toast) {
        toast.hidden = false;
        toast.textContent = "You're on the list.";
      }
      if (input) {
        input.value = "";
        input.disabled = true;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "You're in";
      }
    });
  }

  /* Active nav on scroll */
  const sections = ["hero", "colorways", "sound", "fit", "features", "cta"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateNav() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0]?.id;
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }
    navItems.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP / ScrollTrigger missing — static page");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Intro fade */
  gsap.from(".hero-copy > *", {
    y: 28,
    opacity: 0,
    duration: reduceMotion ? 0.01 : 0.9,
    stagger: 0.12,
    ease: "power2.out",
    delay: 0.15,
  });

  if (reduceMotion) {
    gsap.set(featureCards, { opacity: 1, y: 0 });
    gsap.set(productWrap, { clearProps: "all" });
    return;
  }

  /* Pin product mid-scroll with light rotate/scale */
  const pinEnd = document.getElementById("features");

  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    endTrigger: pinEnd,
    end: "top center",
    pin: productStage,
    pinSpacing: false,
    scrub: 0.65,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(productWrap, {
        scale: 1 - p * 0.12,
        rotate: p * 8,
        y: p * 40,
      });
      /* Fade product out as features arrive */
      if (p > 0.85) {
        gsap.set(productStage, { opacity: 1 - (p - 0.85) / 0.15 });
      } else {
        gsap.set(productStage, { opacity: 1 });
      }
    },
  });

  /* Sound ring glow */
  gsap.to(soundRing, {
    opacity: 1,
    scrollTrigger: {
      trigger: "#sound",
      start: "top 70%",
      end: "center center",
      scrub: true,
    },
  });

  /* Fit: buds settle into case + lid eases */
  const fitTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#fit",
      start: "top 75%",
      end: "center center",
      scrub: true,
    },
  });

  fitTl
    .to(budLeft, { y: 55, x: 8, scale: 0.72, ease: "none" }, 0)
    .to(budRight, { y: 55, x: -8, scale: 0.72, ease: "none" }, 0)
    .to(lid, { rotateX: -48, y: -18, transformOrigin: "50% 100%", ease: "none" }, 0);

  /* Features stagger */
  gsap.from(featureCards, {
    y: 48,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#features",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  /* Section copy fades */
  document.querySelectorAll(".section-copy, .cta-panel").forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  /* Hide scroll cue after leaving hero */
  gsap.to(".scroll-cue", {
    opacity: 0,
    scrollTrigger: {
      trigger: "#hero",
      start: "80% top",
      end: "bottom top",
      scrub: true,
    },
  });
})();
