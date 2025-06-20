document.addEventListener("DOMContentLoaded", function () {
  // --- CONFIGURATION ---
  const klimentInfo = {
    name: "Kliment Ho",
    linkedin: "https://linkedin.com/in/klh005",
    // Array of GitHub usernames to fetch repositories from
    githubUsernames: ["DevKlim", "klh005"],
    githubProfile: "https://github.com/DevKlim", // Primary profile for general links
    email: "klh005@ucsd.edu",
    phone: "669-265-7796",
    heroTitle: "Kliment Ho",
    heroSubtitle:
      "AI Engineer & Data Scientist | Crafting Intelligent Solutions & Innovative Experiences.",
    heroVideo: "assets/videos/hero-background-steam.mp4",
    fallbackProjectBannerImage:
      "assets/images/placeholders/featured_banner_placeholder.jpg",
  };

  // --- GENERAL UTILITIES ---
  const updateTextContent = (selector, text, parent = document) => {
    const element = parent.querySelector(selector);
    if (element) element.textContent = text;
  };
  const updateHref = (selector, link, parent = document) => {
    const element = parent.querySelector(selector);
    if (element) element.href = link;
  };
  const updateSrc = (selector, path, parent = document) => {
    const element = parent.querySelector(selector);
    if (element) element.src = path;
  };

  // --- POPULATE SITE WITH KLIMENT'S INFO ---
  updateTextContent(".logo", klimentInfo.name);
  updateTextContent(".hero-content h1", klimentInfo.heroTitle);
  updateTextContent(
    ".hero-content p.hero-subheading",
    klimentInfo.heroSubtitle
  );
  if (document.getElementById("hero-video-bg")) {
    const videoSource = document
      .getElementById("hero-video-bg")
      .querySelector("source");
    if (videoSource) videoSource.src = klimentInfo.heroVideo;
    document.getElementById("hero-video-bg").load();
  }

  const footerYear = document.getElementById("current-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  updateTextContent(
    "footer .container p:first-child",
    `© ${new Date().getFullYear()} ${klimentInfo.name}. All Rights Reserved.`
  );
  updateHref('.social-links a[aria-label="GitHub"]', klimentInfo.githubProfile); // Uses primary for footer
  updateHref('.social-links a[aria-label="LinkedIn"]', klimentInfo.linkedin);

  if (document.body.classList.contains("resume-page")) {
    updateTextContent(
      '.resume-contact-info p a[href^="tel:"]',
      klimentInfo.phone
    );
    updateTextContent(
      '.resume-contact-info p a[href^="mailto:"]',
      klimentInfo.email
    );
    updateHref(
      '.resume-contact-info p a[href*="linkedin.com"]',
      klimentInfo.linkedin
    );
    updateHref(
      '.resume-contact-info p a[href*="github.com"]',
      klimentInfo.githubProfile
    ); // Uses primary for resume
    updateTextContent(".resume-content h1.page-title", klimentInfo.name);
    const resumeFooterYear = document.getElementById("current-year-resume");
    if (resumeFooterYear)
      resumeFooterYear.textContent = new Date().getFullYear();
  }

  // --- NAVIGATION ---
  const navLinks = document.querySelectorAll(
    '.main-nav a[href^="#"], .cta-button[href^="#"]'
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href");
      const targetIdClean = targetId.startsWith("/#")
        ? targetId.substring(1)
        : targetId;

      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/index.html" &&
        targetIdClean.startsWith("#")
      ) {
        window.location.href = "/" + targetIdClean;
      } else {
        let targetElement = document.querySelector(targetIdClean);
        if (targetElement) {
          // Adjust for fixed header height
          const headerOffset =
            document.querySelector(".site-header").offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const sections = document.querySelectorAll("main section[id]"); // Target sections within main for accuracy
  const mainNavLinks = document.querySelectorAll(".main-nav ul li a");

  function changeNav() {
    let currentSectionId = "";
    const headerHeight = document.querySelector(".site-header").offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 5; // 5px buffer
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSectionId = section.id;
      }
    });

    // If near the top, default to hero
    if (
      window.scrollY <
        (sections.length > 0
          ? sections[0].offsetTop - headerHeight - 50
          : window.innerHeight / 2) &&
      (window.location.pathname === "/" ||
        window.location.pathname === "/index.html")
    ) {
      currentSectionId = "hero";
    }

    mainNavLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      let sectionIdFromLink = linkHref.includes("#")
        ? linkHref.substring(linkHref.lastIndexOf("#") + 1)
        : null;

      if (sectionIdFromLink === currentSectionId) {
        link.classList.add("active");
      }
      // Special handling for "Projects" link to highlight for #featured-curated-projects OR #all-github-projects
      if (
        sectionIdFromLink === "featured-curated-projects" &&
        (currentSectionId === "featured-curated-projects" ||
          currentSectionId === "all-github-projects" ||
          currentSectionId === "page-content-start")
      ) {
        link.classList.add("active");
      }
    });

    // Ensure correct active link for non-scrolling pages
    if (window.location.pathname.includes("resume.html")) {
      document
        .querySelector('.main-nav ul li a[href="resume.html"]')
        ?.classList.add("active");
    } else if (window.location.pathname.includes("project-detail.html")) {
      // For project detail, we might want "Projects" to be active
      document
        .querySelector('.main-nav ul li a[href="#featured-curated-projects"]')
        ?.classList.add("active");
    } else if (
      (window.location.pathname === "/" ||
        window.location.pathname === "/index.html") &&
      !currentSectionId
    ) {
      // Default to home if on index and no specific section is active yet (e.g. very top of page)
      document
        .querySelector('.main-nav ul li a[href="#hero"]')
        ?.classList.add("active");
    }
  }

  if (document.querySelector("body")) {
    changeNav();
    window.addEventListener("scroll", changeNav);
  }

  // --- FEATURED CURATED PROJECTS BANNER ROTATOR ---
  const featuredCuratedSlidesContainer = document.getElementById(
    "featured-curated-slides-container"
  );
  const featuredCuratedDotsContainer = document.getElementById(
    "featured-curated-dots-container"
  );
  let currentFeaturedSlideIndex = 0;
  let featuredRotatorInterval;
  let featuredSlides = [];
  let featuredDots = [];

  function setupFeaturedCuratedRotator() {
    if (
      !featuredCuratedSlidesContainer ||
      typeof projectsData === "undefined" ||
      projectsData.length === 0
    ) {
      const bannerSection = document.getElementById(
        "featured-curated-projects"
      );
      if (bannerSection) bannerSection.style.display = "none";
      return;
    }

    featuredCuratedSlidesContainer.innerHTML = "";
    featuredCuratedDotsContainer.innerHTML = "";

    projectsData.forEach((project, index) => {
      const slide = document.createElement("div");
      slide.classList.add("featured-slide");
      const imageUrl =
        project.mainImageUrl ||
        project.thumbnailUrl ||
        klimentInfo.fallbackProjectBannerImage;
      slide.style.backgroundImage = `url('${imageUrl}')`;
      slide.dataset.index = index;

      slide.innerHTML = `
                <div class="featured-slide-content">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    <a href="project-detail.html?id=${project.id}" class="cta-button">View Details</a>
                </div>
            `;
      featuredCuratedSlidesContainer.appendChild(slide);
      featuredSlides.push(slide);

      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.dataset.index = index;
      dot.addEventListener("click", () => {
        showFeaturedSlide(index);
        resetFeaturedRotatorInterval();
      });
      featuredCuratedDotsContainer.appendChild(dot);
      featuredDots.push(dot);
    });

    if (featuredSlides.length > 0) {
      showFeaturedSlide(0);
      startFeaturedRotatorInterval();
    }
  }

  function showFeaturedSlide(index) {
    featuredSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    featuredDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentFeaturedSlideIndex = index;
  }

  function nextFeaturedSlide() {
    const newIndex = (currentFeaturedSlideIndex + 1) % featuredSlides.length;
    showFeaturedSlide(newIndex);
  }

  function startFeaturedRotatorInterval() {
    if (featuredSlides.length > 1) {
      clearInterval(featuredRotatorInterval);
      featuredRotatorInterval = setInterval(nextFeaturedSlide, 3000);
    }
  }
  function resetFeaturedRotatorInterval() {
    startFeaturedRotatorInterval();
  }

  if (document.getElementById("featured-curated-projects")) {
    setupFeaturedCuratedRotator();
  }

  // --- GITHUB REPOSITORY FETCHING AND DISPLAY (FROM MULTIPLE ACCOUNTS) ---
  const githubProjectsGrid = document.getElementById("github-projects-grid");
  const rotatorContentArea = document.getElementById("rotator-content-area"); // Sidebar rotator
  let allGitHubRepos = [];
  let currentGitHubRotatorIndex = 0;
  let githubRotatorInterval;

  async function fetchGitHubProjects() {
    if (
      !klimentInfo.githubUsernames ||
      klimentInfo.githubUsernames.length === 0
    ) {
      if (githubProjectsGrid)
        githubProjectsGrid.innerHTML =
          "<p>GitHub usernames not configured.</p>";
      if (rotatorContentArea)
        rotatorContentArea.innerHTML =
          "<p>GitHub usernames not configured.</p>";
      return;
    }

    const fetchPromises = klimentInfo.githubUsernames.map((username) =>
      fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`
      )
        .then((response) => {
          if (!response.ok) {
            console.warn(
              `GitHub API error for ${username}: ${response.status}`
            );
            return []; // Return empty array on error for this user
          }
          return response.json();
        })
        .catch((error) => {
          console.warn(
            `Failed to fetch GitHub projects for ${username}:`,
            error
          );
          return []; // Return empty array on network error for this user
        })
    );

    try {
      const results = await Promise.all(fetchPromises);
      let combinedRepos = [];
      results.forEach(
        (repoList) => (combinedRepos = combinedRepos.concat(repoList))
      );

      // De-duplicate repositories by ID (in case of forks or other overlaps)
      const uniqueRepos = [];
      const map = new Map();
      for (const item of combinedRepos) {
        if (!map.has(item.id)) {
          // Assuming 'id' is the unique identifier for a repo
          map.set(item.id, true);
          uniqueRepos.push(item);
        }
      }
      allGitHubRepos = uniqueRepos;

      // Sort all fetched & de-duplicated repos by pushed_at date
      allGitHubRepos.sort(
        (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
      );

      displayGitHubProjects();
      setupGitHubSidebarRotator();
    } catch (error) {
      // This catch is more for Promise.all itself, though individual errors are handled above.
      console.error("Overall error fetching GitHub projects:", error);
      if (githubProjectsGrid)
        githubProjectsGrid.innerHTML = `<p class="error-message">Could not load GitHub projects. ${
          error.message || "Network error"
        }</p>`;
      if (rotatorContentArea)
        rotatorContentArea.innerHTML = `<p class="error-message">Could not load recent projects. ${
          error.message || "Network error"
        }</p>`;
    }
  }

  function displayGitHubProjects() {
    if (!githubProjectsGrid) return; // Guard if element doesn't exist
    if (allGitHubRepos.length === 0) {
      githubProjectsGrid.innerHTML =
        "<p>No public repositories found or failed to load.</p>";
      return;
    }
    githubProjectsGrid.innerHTML = "";

    allGitHubRepos.forEach((repo) => {
      const repoCardHTML = `
                <a href="${
                  repo.html_url
                }" target="_blank" class="project-card-link">
                    <div class="project-card">
                        <div class="project-thumbnail placeholder">
                            <span>${repo.name
                              .substring(0, 1)
                              .toUpperCase()}</span> 
                        </div>
                        <div class="project-info">
                            <h3>${repo.name}</h3>
                            <p>${
                              repo.description || "No description available."
                            }</p>
                            <div class="project-tags">
                                ${
                                  repo.language
                                    ? `<span>${repo.language}</span>`
                                    : ""
                                }
                                ${repo.topics
                                  .slice(0, 2)
                                  .map(
                                    (topic) =>
                                      `<span>${
                                        topic.charAt(0).toUpperCase() +
                                        topic.slice(1)
                                      }</span>`
                                  )
                                  .join("")}
                            </div>
                            <div class="repo-stats">
                                <span><i class="fas fa-star"></i> ${
                                  repo.stargazers_count
                                }</span>
                                <span><i class="fas fa-code-branch"></i> ${
                                  repo.forks_count
                                }</span>
                                ${
                                  repo.watchers_count > 0
                                    ? `<span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>`
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                </a>
            `;
      githubProjectsGrid.innerHTML += repoCardHTML;
    });
  }

  function setupGitHubSidebarRotator() {
    if (!rotatorContentArea) return; // Guard if element doesn't exist
    if (allGitHubRepos.length === 0) {
      rotatorContentArea.innerHTML = "<p>No recent projects to display.</p>";
      const prevButton = document.getElementById("rotator-prev");
      const nextButton = document.getElementById("rotator-next");
      if (prevButton) prevButton.style.display = "none";
      if (nextButton) nextButton.style.display = "none";
      return;
    }
    // Already sorted, so just take the top ones for the rotator
    const recentRepos = allGitHubRepos.slice(0, 5);

    if (recentRepos.length === 0) {
      rotatorContentArea.innerHTML = "<p>No recent projects to display.</p>";
      return;
    }

    rotatorContentArea.innerHTML = "";
    let sidebarRotatorItems = [];

    recentRepos.forEach((repo, index) => {
      const rotatorItemHTML = `
                <div class="rotator-item ${
                  index === 0 ? "active" : ""
                }" data-index="${index}">
                    ${
                      repo.owner && repo.owner.avatar_url
                        ? `<img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" class="repo-owner-avatar">`
                        : ""
                    }
                    <h3>${repo.name}</h3>
                    <p>${(repo.description || "No description.").substring(
                      0,
                      80
                    )}${
        repo.description && repo.description.length > 80 ? "..." : ""
      }</p>
                    <a href="${
                      repo.html_url
                    }" target="_blank" class="rotator-item-link">View on GitHub &rarr;</a>
                </div>
            `;
      rotatorContentArea.innerHTML += rotatorItemHTML;
    });

    sidebarRotatorItems = rotatorContentArea.querySelectorAll(".rotator-item");
    const prevButton = document.getElementById("rotator-prev");
    const nextButton = document.getElementById("rotator-next");
    if (prevButton)
      prevButton.style.display =
        sidebarRotatorItems.length > 1 ? "inline-block" : "none";
    if (nextButton)
      nextButton.style.display =
        sidebarRotatorItems.length > 1 ? "inline-block" : "none";

    function showGitHubSidebarItem(index) {
      sidebarRotatorItems.forEach((item) => item.classList.remove("active"));
      sidebarRotatorItems[index].classList.add("active");
      currentGitHubRotatorIndex = index;
    }

    function nextGitHubSidebarItem() {
      let newIndex =
        (currentGitHubRotatorIndex + 1) % sidebarRotatorItems.length;
      showGitHubSidebarItem(newIndex);
    }
    function prevGitHubSidebarItem() {
      let newIndex =
        (currentGitHubRotatorIndex - 1 + sidebarRotatorItems.length) %
        sidebarRotatorItems.length;
      showGitHubSidebarItem(newIndex);
    }

    if (prevButton && nextButton) {
      prevButton.addEventListener("click", () => {
        prevGitHubSidebarItem();
        resetGitHubRotatorInterval();
      });
      nextButton.addEventListener("click", () => {
        nextGitHubSidebarItem();
        resetGitHubRotatorInterval();
      });
    }

    function startGitHubRotatorInterval() {
      if (sidebarRotatorItems.length > 1) {
        clearInterval(githubRotatorInterval);
        githubRotatorInterval = setInterval(nextGitHubSidebarItem, 5000);
      }
    }
    function resetGitHubRotatorInterval() {
      startGitHubRotatorInterval();
    }

    if (sidebarRotatorItems.length > 0) {
      showGitHubSidebarItem(0);
      startGitHubRotatorInterval();
    } else {
      rotatorContentArea.innerHTML =
        "<p>No recent projects to display in rotator.</p>";
      if (prevButton) prevButton.style.display = "none";
      if (nextButton) nextButton.style.display = "none";
    }
  }

  if (document.getElementById("all-github-projects")) {
    fetchGitHubProjects();
  }

  // --- PROJECT DETAIL PAGE LOGIC ---
  const projectDetailSection = document.querySelector(
    ".project-detail-section"
  );
  if (projectDetailSection && typeof projectsData !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
    const project = projectsData.find((p) => p.id === projectId);

    if (project) {
      document.title = `${project.title} - ${klimentInfo.name}`;
      updateTextContent(".project-detail-header h1", project.title);
      updateTextContent(
        ".project-detail-header .tech-stack-display",
        `Technologies: ${project.techStack.join(", ")}`
      );

      const mainMediaContainer = projectDetailSection.querySelector(
        ".main-project-image"
      );
      if (mainMediaContainer) {
        mainMediaContainer.innerHTML = `<img src="${
          project.mainImageUrl ||
          project.thumbnailUrl ||
          klimentInfo.fallbackProjectBannerImage
        }" alt="${project.title} Main Image">`;
      }

      const galleryContainer = projectDetailSection.querySelector(
        ".project-image-gallery"
      );
      if (galleryContainer) {
        galleryContainer.innerHTML = "";
        if (project.galleryImages && project.galleryImages.length > 0) {
          project.galleryImages.forEach((imgUrl) => {
            galleryContainer.innerHTML += `<img src="${imgUrl}" alt="${project.title} gallery image" onclick="openImageModal('${imgUrl}')">`;
          });
        } else {
          galleryContainer.style.display = "none";
        }
      }

      const descriptionPanel = projectDetailSection.querySelector(
        ".project-description-panel .description-content"
      );
      if (descriptionPanel) {
        descriptionPanel.innerHTML = project.longDescription;
      }

      const linksBox = projectDetailSection.querySelector(".project-links-box");
      if (linksBox) {
        linksBox.innerHTML = "";
        if (project.githubUrl) {
          linksBox.innerHTML += `<a href="${project.githubUrl}" target="_blank" class="cta-button github"><i class="fab fa-github"></i> View on GitHub</a>`;
        }
        if (project.liveDemoUrl) {
          linksBox.innerHTML += `<a href="${project.liveDemoUrl}" target="_blank" class="cta-button"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
        }
        if (!project.githubUrl && !project.liveDemoUrl) {
          linksBox.innerHTML =
            "<p>No external links available for this project.</p>";
        }
      }
    } else {
      projectDetailSection.innerHTML = `<div class="container"><p class="error-message">Project not found. Please return to the <a href="/#featured-curated-projects">projects page</a>.</p></div>`;
    }
  }

  // --- IMAGE MODAL ---
  window.openImageModal = function (src) {
    let modal = document.getElementById("imageModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "imageModal";
      modal.classList.add("image-modal");
      modal.innerHTML =
        '<span class="close-modal" onclick="closeImageModal(event)">&times;</span><img class="modal-content" id="modalImage" alt="Expanded Image">';
      document.body.appendChild(modal);

      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeImageModal(event);
        }
      });
    }
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImg.src = src;
    document.body.style.overflow = "hidden";
  };
  window.closeImageModal = function (event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById("imageModal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  };

  // --- MEMORIES SECTION ---
  function initializeMemoriesSection() {
    const memoriesGrid = document.getElementById("memories-grid");
    if (!memoriesGrid) return;

    Promise.all([
      fetch("data/picture-manifest.json").then((res) => {
        if (!res.ok)
          throw new Error(
            "Could not find picture-manifest.json. Please run 'node utils/generate_picture_list.js'."
          );
        return res.json();
      }),
      fetch("data/memories.json").then((res) => (res.ok ? res.json() : {})),
    ])
      .then(([manifest, descriptions]) => {
        if (!manifest || manifest.length === 0) {
          memoriesGrid.innerHTML =
            "<p>No pictures found. Add images to `data/pictures` and run the helper script.</p>";
          return;
        }

        memoriesGrid.innerHTML = "";

        manifest.forEach((imageFile) => {
          const filename = imageFile.filename;
          const details = descriptions[filename] || {};
          const memoryData = {
            id: imageFile.id,
            imageSrc: `data/pictures/${filename}`,
            description:
              details.description || "A wonderful memory, captured in time.",
            date: details.date || "Date Unknown",
            location: details.location || "A Beautiful Place",
            width: imageFile.width,
            height: imageFile.height,
          };
          const cardContainer = createMemoryCard(memoryData);
          memoriesGrid.appendChild(cardContainer);
        });
      })
      .catch((error) => {
        console.error("Error loading memories section:", error);
        memoriesGrid.innerHTML = `<p class="error-message">Could not load memories. ${error.message}</p>`;
      });
  }

  function createMemoryCard(memory) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "memory-card-container";

    const card = document.createElement("div");
    card.className = "memory-card";
    card.innerHTML = `
      <div class="memory-card-face memory-card-front">
          <img src="${memory.imageSrc}" alt="${
      memory.description
    }" loading="lazy" draggable="false" width="${memory.width}" height="${
      memory.height
    }">
      </div>
      <div class="memory-card-face memory-card-back">
          <div class="memory-id">#${String(memory.id).padStart(3, "0")}</div>
          <div class="memory-description">
              <p>"${memory.description}"</p>
          </div>
          <div class="memory-info">
              <p><i class="fas fa-map-marker-alt"></i> ${memory.location}</p>
              <p><i class="fas fa-calendar-alt"></i> ${memory.date}</p>
          </div>
      </div>`;

    cardContainer.appendChild(card);
    initializeCardInteractions(cardContainer, card);
    return cardContainer;
  }

  function initializeCardInteractions(container, card) {
    let isDragging = false;
    let isFlipped = false;
    let animationFrameId = null;

    let rotationX = 0,
      rotationY = 0;
    let velocityX = 0,
      velocityY = 0;
    let currentX, currentY;
    let downTime, downX, downY;

    const friction = 0.95;
    const rotationFactor = 0.2; // Sensitivity of drag rotation

    const applyTransform = () => {
      card.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    };

    const momentumLoop = () => {
      if (isDragging) return;
      rotationX -= velocityY * rotationFactor;
      rotationY += velocityX * rotationFactor;
      velocityX *= friction;
      velocityY *= friction;

      applyTransform();

      if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
        animationFrameId = requestAnimationFrame(momentumLoop);
      } else {
        animationFrameId = null;
      }
    };

    container.addEventListener("pointerdown", (e) => {
      downTime = Date.now();
      downX = e.clientX;
      downY = e.clientY;
      isDragging = true;
      container.classList.add("is-dragging");
      card.style.transition = "none";

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      currentX = e.clientX;
      currentY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging || isFlipped) return;
      const deltaX = e.clientX - currentX;
      const deltaY = e.clientY - currentY;
      rotationY += deltaX * rotationFactor;
      rotationX -= deltaY * rotationFactor;
      applyTransform();
      velocityX = deltaX;
      velocityY = deltaY;
      currentX = e.clientX;
      currentY = e.clientY;
    });

    window.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");

      const distance = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (Date.now() - downTime < 250 && distance < 10) {
        isFlipped = !isFlipped;
        card.classList.toggle("is-flipped", isFlipped);
        card.style.transition =
          "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        if (isFlipped) {
          card.style.transform = "rotateY(180deg)";
        } else {
          applyTransform();
        }
      } else if (!isFlipped) {
        requestAnimationFrame(momentumLoop);
      }
    });

    container.addEventListener("mousemove", (e) => {
      if (isDragging || animationFrameId || isFlipped) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const hoverRotateX = (y - centerY) / 25;
      const hoverRotateY = -(x - centerX) / 25;
      card.style.transition = "transform 0.1s ease-out";
      card.style.transform = `rotateX(${hoverRotateX}deg) rotateY(${hoverRotateY}deg) scale(1.02)`;
    });

    container.addEventListener("mouseleave", () => {
      if (isDragging || animationFrameId || isFlipped) return;
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
      rotationX = 0;
      rotationY = 0;
      applyTransform();
    });
  }

  // Initialize the new section
  if (document.getElementById("memories-grid")) {
    initializeMemoriesSection();
  }
});