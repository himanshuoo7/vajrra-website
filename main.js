// Vajrra site: nav state, mobile menu, products dropdown, industry tabs, scroll reveals, contact form.
(() => {
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }),
    );
  }

  // Products dropdown: click or hover opens it; Escape, a click outside, or
  // leaving it closes it.
  const item = document.querySelector(".nav-item");
  const trigger = item && item.querySelector(".nav-trigger");
  if (item && trigger) {
    const setOpen = (open) => {
      item.classList.toggle("open", open);
      trigger.setAttribute("aria-expanded", String(open));
    };
    const hover = window.matchMedia("(hover: hover)");
    // with a mouse, hovering already opened it — a click must not shut it again
    trigger.addEventListener("click", () => setOpen(hover.matches || !item.classList.contains("open")));
    item.addEventListener("mouseenter", () => hover.matches && setOpen(true));
    item.addEventListener("mouseleave", () => hover.matches && setOpen(false));
    document.addEventListener("click", (e) => !item.contains(e.target) && setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !item.classList.contains("open")) return;
      setOpen(false);
      trigger.focus();
    });
    item.querySelectorAll(".menu-link").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  }

  // Industry tabs (roving tabindex + arrow keys)
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  // Contact form: no backend yet — hand the address to the visitor's mail app.
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value.trim();
      const note = document.querySelector(".form-note");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "Please enter a valid work email.";
        return;
      }
      const subject = encodeURIComponent(form.dataset.subject || "Talk to Vajrra");
      const body = encodeURIComponent(`Hi Vajrra team,\n\nI'd like to learn more.\n\nReach me at: ${email}\n`);
      window.location.href = `mailto:hello@vajrra.ai?subject=${subject}&body=${body}`;
      note.textContent = "Opening your email app…";
    });
  }

  // Signed in? The accounts service tells this site who (and only this site):
  // the header's "Sign in" becomes the person's name, and "Sign up" goes away.
  const ACCOUNTS = "https://accounts.vajrra.ai";
  fetch(`${ACCOUNTS}/v1/web-session`, { credentials: "include" })
    .then((response) => (response.ok ? response.json() : null))
    .then((session) => {
      if (!session || session.signedIn !== true) return;
      const first = String(session.name || "").trim().split(/\s+/)[0].slice(0, 24) || "Account";
      document.querySelectorAll(".nav-signin").forEach((link) => {
        link.textContent = "";
        const initial = document.createElement("span");
        initial.className = "nav-initial";
        initial.textContent = first.charAt(0).toUpperCase();
        link.append(initial, first);
        link.href = `${ACCOUNTS}/signin/done`;
        link.title = String(session.email || "");
        link.classList.add("signed-in");
      });
      document.querySelectorAll(`a[href="${ACCOUNTS}/signin?mode=signup"]`).forEach((link) => link.remove());
      document.querySelectorAll(`.mobile-menu a[href="${ACCOUNTS}/signin"]`).forEach((link) => {
        link.textContent = `${first} · Your account`;
        link.href = `${ACCOUNTS}/signin/done`;
      });
    })
    .catch(() => {});

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
