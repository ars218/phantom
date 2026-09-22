/* =========================================================
   Phantom by ART — cinematic motion (GSAP + ScrollTrigger)
   3D hero via @google/model-viewer
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const productWrap = document.getElementById("product-wrap");
  const productStage = document.getElementById("product-stage");
  const productGlow = document.querySelector(".product-glow");
  const modelViewer = document.getElementById("product-model");
  const navItems = document.querySelectorAll(".nav-item");
  const colorCards = document.querySelectorAll(".color-card");
  const form = document.getElementById("notify-form");
  const toast = document.getElementById("toast");
  const featureCards = document.querySelectorAll(".feature-card");
  const flecksContainer = document.getElementById("flecks-container");
  const orbs = document.querySelector(".orbs");

  const THEMES = {
    midnight: {
      inner: "#2a4a8a",
      mid: "#0e1a34",
      outer: "#050a14",
      accent: [0.49, 0.71, 1.0, 1.0],
      emissive: [0.08, 0.14, 0.28, 1.0],
      filter:
        "drop-shadow(0 28px 48px rgba(0,0,0,0.5)) brightness(1.02) saturate(1.05) hue-rotate(0deg)",
    },
    aura: {
      inner: "#0b8a7a",
      mid: "#044e46",
      outer: "#011412",
      accent: [0.24, 0.88, 0.82, 1.0],
      emissive: [0.04, 0.22, 0.2, 1.0],
      filter:
        "drop-shadow(0 28px 48px rgba(0,0,0,0.5)) brightness(1.08) saturate(1.25) hue-rotate(145deg)",
    },
  };

  let isSwitching = false;
  let mouse = { x: 0, y: 0 };
  let currentMouse = { x: 0, y: 0 };
  let materialsTinted = false;

  function disableAutoRotateIfNeeded() {
    if (!modelViewer) return;
    if (reduceMotion) {
      modelViewer.removeAttribute("auto-rotate");
      modelViewer.autoRotate = false;
    }
  }
  disableAutoRotateIfNeeded();

  function tintModelMaterials(theme) {
    if (!modelViewer) return false;
    const colors = THEMES[theme];
    if (!colors) return false;

    try {
      const model = modelViewer.model;
      if (!model || !model.materials || !model.materials.length) return false;

      model.materials.forEach((mat, i) => {
        const pbr = mat.pbrMetallicRoughness;
        if (!pbr) return;

        const factor =
          i % 2 === 0
            ? colors.accent
            : theme === "aura"
              ? [0.12, 0.35, 0.34, 1]
              : [0.18, 0.24, 0.38, 1];

        if (typeof pbr.setBaseColorFactor === "function") {
          pbr.setBaseColorFactor(factor);
        } else if (pbr.baseColorFactor) {
          pbr.baseColorFactor = factor;
        }

        if (mat.setEmissiveFactor) {
          mat.setEmissiveFactor(colors.emissive.slice(0, 3));
        } else if (mat.emissiveFactor) {
          mat.emissiveFactor = colors.emissive.slice(0, 3);
        }
      });

      materialsTinted = true;
      modelViewer.style.filter = "drop-shadow(0 28px 48px rgba(0,0,0,0.5))";
      return true;
    } catch (err) {
      console.warn("Material tint failed, using CSS filter", err);
      return false;
    }
  }

  function applyThemeToModel(theme) {
    if (!modelViewer) return;
    const colors = THEMES[theme];
    if (!colors) return;

    const ok = tintModelMaterials(theme);
    if (!ok) {
      modelViewer.style.filter = colors.filter;
    }
  }

  if (modelViewer) {
    modelViewer.addEventListener("load", () => {
      disableAutoRotateIfNeeded();
      applyThemeToModel(body.getAttribute("data-theme") || "midnight");
    });
    if (modelViewer.loaded) {
      applyThemeToModel(body.getAttribute("data-theme") || "midnight");
    }
  }

  function spawnFleck() {
    if (!flecksContainer || reduceMotion) return;
    const fleck = document.createElement("span");
    fleck.className = "fleck";
    const size = Math.random() * 3.5 + 1.2;
    fleck.style.width = `${size}px`;
    fleck.style.height = `${size}px`;
    fleck.style.left = `${Math.random() * 100}%`;
    fleck.style.bottom = "-20px";
    fleck.style.opacity = String(Math.random() * 0.45 + 0.15);
    const duration = Math.random() * 7 + 5;
    fleck.style.animation = `fleckRise ${duration}s linear forwards`;
    flecksContainer.appendChild(fleck);
    setTimeout(() => fleck.remove(), duration * 1000);
  }

  if (!reduceMotion) {
    setInterval(spawnFleck, 380);
    for (let i = 0; i < 8; i++) setTimeout(spawnFleck, i * 120);
  }

  function setTheme(theme) {
    if (isSwitching || !THEMES[theme]) return;
    if (body.getAttribute("data-theme") === theme) return;
    isSwitching = true;

    colorCards.forEach((card) => {
      const on = card.dataset.theme === theme;
      card.classList.toggle("active", on);
      card.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const colors = THEMES[theme];

    if (typeof gsap !== "undefined" && !reduceMotion) {
      const tl = gsap.timeline({
        onComplete: () => {
          body.setAttribute("data-theme", theme);
          applyThemeToModel(theme);
          isSwitching = false;
        },
      });

      tl.to(
        body,
        {
          "--bg-inner": colors.inner,
          "--bg-mid": colors.mid,
          "--bg-outer": colors.outer,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0
      );

      if (productWrap) {
        tl.to(
          productWrap,
          {
            filter: "blur(10px) brightness(1.15)",
            scale: 0.92,
            rotateY: theme === "aura" ? 18 : -18,
            duration: 0.45,
            ease: "power2.in",
          },
          0
        );
        tl.add(() => {
          body.setAttribute("data-theme", theme);
          applyThemeToModel(theme);
        });
        tl.to(productWrap, {
          filter: "blur(0px) brightness(1)",
          scale: 1,
          rotateY: 0,
          duration: 0.85,
          ease: "back.out(1.4)",
        });
      }

      if (productGlow) {
        tl.fromTo(
          productGlow,
          { scale: 0.7, opacity: 0.4 },
          { scale: 1.15, opacity: 1, duration: 1, ease: "power2.out" },
          0.2
        );
      }
    } else {
      body.setAttribute("data-theme", theme);
      applyThemeToModel(theme);
      isSwitching = false;
    }
  }

  colorCards.forEach((card) => {
    card.style.touchAction = "manipulation";
    const activate = (e) => {
      e.preventDefault();
      setTheme(card.dataset.theme);
    };
    card.addEventListener("click", activate);
    card.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") activate(e);
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (input && !input.checkValidity()) {
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
        const label = submitBtn.querySelector("span:first-child");
        if (label) label.textContent = "You're in";
        else submitBtn.textContent = "You're in";
      }
      if (typeof gsap !== "undefined" && toast && !reduceMotion) {
        gsap.fromTo(
          toast,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }
        );
      }
    });
  }

  const sections = ["hero", "colorways", "sound", "fit", "features", "cta"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateNav() {
    const y = window.scrollY + window.innerHeight * 0.32;
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

  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true }
  );

  function parallaxLoop() {
    if (reduceMotion) return;
    currentMouse.x += (mouse.x - currentMouse.x) * 0.06;
    currentMouse.y += (mouse.y - currentMouse.y) * 0.06;

    if (orbs) {
      orbs.style.transform = `translate(${currentMouse.x * -28}px, ${currentMouse.y * -20}px)`;
    }

    requestAnimationFrame(parallaxLoop);
  }
  parallaxLoop();

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP / ScrollTrigger missing — static page");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-copy > *", {
    y: 36,
    opacity: 0,
    duration: reduceMotion ? 0.01 : 1,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.2,
  });

  if (productWrap && !reduceMotion) {
    gsap.from(productWrap, {
      scale: 0.82,
      opacity: 0,
      rotateY: -24,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.35,
    });
  }

  if (reduceMotion) {
    gsap.set(featureCards, { opacity: 1, y: 0 });
    return;
  }

  const isMobile = () => window.innerWidth <= 900;

  if (productStage && productWrap) {
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      endTrigger: "#features",
      end: "top 55%",
      pin: isMobile() ? false : productStage,
      pinSpacing: false,
      scrub: 0.7,
      onUpdate: (self) => {
        const p = self.progress;
        const mobile = isMobile();

        gsap.set(productWrap, {
          scale: 1 - p * (mobile ? 0.08 : 0.14),
          rotate: p * (mobile ? 4 : 10),
          y: p * (mobile ? 20 : 48),
          rotateX: p * -6,
        });

        if (modelViewer) {
          const az = 25 + p * 55;
          const pol = 75 - p * 18;
          const rad = 105 + p * 12;
          modelViewer.cameraOrbit = `${az.toFixed(1)}deg ${pol.toFixed(1)}deg ${rad.toFixed(1)}%`;
        }

        if (p > 0.82) {
          gsap.set(productStage, { opacity: 1 - (p - 0.82) / 0.18 });
        } else if (!mobile) {
          gsap.set(productStage, { opacity: 1 });
        } else {
          gsap.set(productStage, {
            opacity: p > 0.7 ? 1 - (p - 0.7) / 0.3 : 0.95,
          });
        }
      },
    });
  }

  if (modelViewer) {
    ScrollTrigger.create({
      trigger: "#fit",
      start: "top 80%",
      end: "center center",
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const fov = 28 - p * 4;
        modelViewer.fieldOfView = `${fov.toFixed(1)}deg`;
      },
    });
  }

  gsap.from(featureCards, {
    y: 56,
    opacity: 0,
    scale: 0.94,
    duration: 0.9,
    stagger: 0.14,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#features",
      start: "top 72%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".color-card", {
    y: 48,
    opacity: 0,
    scale: 0.92,
    duration: 0.85,
    stagger: 0.12,
    ease: "back.out(1.3)",
    scrollTrigger: {
      trigger: "#colorways",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  document.querySelectorAll(".section-head, .sound-copy, .cta-panel").forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.fromTo(
    ".eq span",
    { scaleY: 0.2, opacity: 0.3 },
    {
      scaleY: 1,
      opacity: 1,
      duration: 0.6,
      stagger: { each: 0.04, from: "center" },
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#sound",
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    }
  );

  gsap.to(".scroll-cue", {
    opacity: 0,
    scrollTrigger: {
      trigger: "#hero",
      start: "70% top",
      end: "bottom top",
      scrub: true,
    },
  });

  if (!isMobile()) {
    featureCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -10, duration: 0.4, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
      });
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
})();
