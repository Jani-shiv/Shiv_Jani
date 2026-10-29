const projects = {
  voting: {
    kicker: "PROJECT 01 / CONTAINERIZATION",
    title: "Voting Web App",
    description: "A container-focused voting application project. The portfolio describes the project at a high level until its repository contents, architecture, and current state are reviewed.",
    focus: "Containerizing a web application",
    tech: "Docker · Web application",
    note: "Next portfolio upgrade: add a verified repository URL, architecture diagram, setup steps, and a short explanation of the container workflow.",
    url: "https://github.com/Jani-shiv/Voting-Docker-image"
  },
  rhcsa: {
    kicker: "PROJECT 02 / LINUX LEARNING",
    title: "RHCSA Study Guide",
    description: "A learning repository for Linux administration and RHEL-related revision. It demonstrates a documentation-first approach to building and organizing technical knowledge.",
    focus: "Linux administration & documentation",
    tech: "Linux · RHEL · RHCSA study",
    note: "Next portfolio upgrade: link the exact repository, then add topic coverage and a few representative exercises after checking the README.",
    url: "https://github.com/Jani-shiv/rhcsa-study-guide"
  },
  elastic: {
    kicker: "PROJECT 03 / SEARCH & OBSERVABILITY",
    title: "Elastic & Cloud-Native Work",
    description: "An area of ongoing technical exploration connected to Elastic, search, observability, AI-enabled workflows, and community learning. This card is a focus area, not a claim that one specific project is production-ready.",
    focus: "Search, observability & technical community",
    tech: "Elastic · Cloud-native concepts",
    note: "Add the exact public repository and demo link when the project scope, implementation, and available artifacts are confirmed.",
    url: "https://github.com/Jani-shiv"
  }
};

const modal = document.querySelector("#project-modal");
const closeButtons = document.querySelectorAll(".modal-close, .modal-close-text");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const toast = document.querySelector(".toast");

function openProject(key) {
  const project = projects[key];
  if (!project) return;
  document.querySelector("#modal-kicker").textContent = project.kicker;
  document.querySelector("#modal-title").textContent = project.title;
  document.querySelector("#modal-description").textContent = project.description;
  document.querySelector("#modal-focus").textContent = project.focus;
  document.querySelector("#modal-tech").textContent = project.tech;
  document.querySelector("#modal-note").textContent = project.note;
  document.querySelector("#modal-link").href = project.url;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();
    openProject(button.dataset.open);
  });
});
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", event => {
    if (!event.target.closest("button")) openProject(card.dataset.project);
  });
});
closeButtons.forEach(button => button.addEventListener("click", closeModal));
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const cursorGlow = document.querySelector(".cursor-glow");
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.body.classList.add("has-pointer");
  window.addEventListener("pointermove", event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
// Automatically sync latest stories from Medium feed (@shiv-jani)
async function syncMediumStories() {
  const container = document.querySelector("#medium-posts-container");
  if (!container) return;

  const feedUrl = "https://medium.com/feed/@shiv-jani";
  const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(feedUrl);

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) return;
    const json = await res.json();
    if (!json.contents) return;

    const parser = new DOMParser();
    const xml = parser.parseFromString(json.contents, "text/xml");
    const items = xml.querySelectorAll("item");
    if (!items || items.length === 0) return;

    const cardsHtml = Array.from(items).map(item => {
      const title = item.querySelector("title")?.textContent || "Medium Article";
      const link = item.querySelector("link")?.textContent || "https://medium.com/@shiv-jani";
      const pubDateRaw = item.querySelector("pubDate")?.textContent;
      const pubDate = pubDateRaw ? new Date(pubDateRaw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "";
      
      const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toUpperCase().replace(/-/g, " "));
      const categoryTag = categories.slice(0, 2).join(" / ") || "DEVOPS / ARTICLE";

      const descText = item.querySelector("description")?.textContent || "";
      const imgMatch = descText.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch ? imgMatch[1] : "";
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = descText;
      const snippetEl = tempDiv.querySelector(".medium-feed-snippet");
      const snippet = snippetEl ? snippetEl.textContent.trim() : "";

      return `
        <a class="writing-card reveal" href="${link}" target="_blank" rel="noopener noreferrer">
          <div class="writing-card-header">
            <span class="writing-category">${categoryTag}</span>
            ${pubDate ? `<span class="writing-date">${pubDate}</span>` : ""}
          </div>
          ${imgSrc ? `
          <div class="writing-art">
            <img class="writing-thumb" src="${imgSrc}" alt="${title.replace(/"/g, '&quot;')}" loading="lazy">
          </div>` : ""}
          <h3>${title}</h3>
          ${snippet ? `<p>${snippet}</p>` : ""}
          <span class="read-link">Read on Medium <b>↗</b></span>
        </a>
      `;
    }).join("");

    if (cardsHtml.trim()) {
      container.innerHTML = cardsHtml;
      container.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
    }
  } catch (err) {
    // Keep pre-rendered static fallback if offline or proxy error
    console.debug("Medium sync fallback active:", err);
  }
}

syncMediumStories();
