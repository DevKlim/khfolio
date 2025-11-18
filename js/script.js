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
    // Fallback image if project has no image
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

  // --- FOOTER YEAR ---
  const footerYear = document.getElementById("current-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // --- VVIP ROOM SECRET ENTRANCE (LOGO CLICK) ---
  const logoLink = document.querySelector("header .logo");
  if (logoLink) {
    let clickCount = 0;
    let clickTimer;
    const requiredClicks = 7; // 7 clicks for VVIP
    const timeLimit = 500; 

    logoLink.addEventListener("click", (event) => {
      event.preventDefault(); 
      clickCount++;
      clearTimeout(clickTimer);

      if (clickCount === requiredClicks) {
        window.location.href = "vvip-login.html";
        clickCount = 0; 
      } else {
        clickTimer = setTimeout(() => {
          if (clickCount < requiredClicks) {
            window.location.href = "index.html"; // Default behavior
          }
        }, timeLimit);
      }
    });
  }

  // --- SMOOTH NAV SCROLLING ---
  const navLinks = document.querySelectorAll(
    '.main-nav a[href^="#"], .cta-button[href^="#"]'
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href"); 
      let targetElement = document.querySelector(targetId);
      if (targetElement) {
        let headerOffset = 90; // Matches CSS variable
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- FLOATING POLAROID SCROLL ANIMATION ---
  const floatingCard = document.getElementById("floating-polaroid");

  function handleFloatingCardScroll() {
    if (!floatingCard) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Linear interpolation function
    const lerp = (a, b, t) => a + (b - a) * t;

    // Path: Start top-right, drift to middle-left, end bottom-right
    // Y Position (vh)
    const top = lerp(15, 80, scrollFraction); 
    
    // X Position (vw) - subtle sine wave motion could be added here, but linear for now
    // Let's move it from Right (85vw) to Left (5vw)
    const left = lerp(85, 5, scrollFraction);
    
    const rotation = lerp(10, -20, scrollFraction); 

    floatingCard.style.top = `${top}vh`;
    floatingCard.style.left = `${left}vw`;
    floatingCard.style.transform = `rotateZ(${rotation}deg)`;
  }

  if (floatingCard) {
    handleFloatingCardScroll();
    window.addEventListener("scroll", handleFloatingCardScroll);
  }

  // --- FEATURED CURATED PROJECTS (FULL SCREEN SLIDER) ---
  const featuredCuratedSlidesContainer = document.getElementById(
    "featured-curated-slides-container"
  );
  
  let currentFeaturedSlideIndex = 0;
  let featuredRotatorInterval;
  let featuredSlides = [];

  function setupFeaturedCuratedRotator() {
    if (
      !featuredCuratedSlidesContainer ||
      typeof projectsData === "undefined" ||
      projectsData.length === 0
    ) {
      const bannerSection = document.getElementById("featured-curated-projects");
      if (bannerSection) bannerSection.style.display = "none";
      return;
    }

    featuredCuratedSlidesContainer.innerHTML = "";

    projectsData.forEach((project, index) => {
      const slide = document.createElement("div");
      slide.classList.add("featured-slide");
      const imageUrl =
        project.mainImageUrl ||
        project.thumbnailUrl ||
        klimentInfo.fallbackProjectBannerImage;
      
      slide.style.backgroundImage = `url('${imageUrl}')`;
      slide.dataset.index = index;

      // Added overlay div in CSS, here is content
      slide.innerHTML = `
                <div class="slide-overlay"></div>
                <div class="featured-slide-content">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    <a href="project-detail.html?id=${project.id}" class="cta-button">View Piece</a>
                </div>
            `;
      featuredCuratedSlidesContainer.appendChild(slide);
      featuredSlides.push(slide);
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
    currentFeaturedSlideIndex = index;
  }

  function nextFeaturedSlide() {
    const newIndex = (currentFeaturedSlideIndex + 1) % featuredSlides.length;
    showFeaturedSlide(newIndex);
  }

  function startFeaturedRotatorInterval() {
    if (featuredSlides.length > 1) {
      clearInterval(featuredRotatorInterval);
      featuredRotatorInterval = setInterval(nextFeaturedSlide, 5000); // 5 seconds
    }
  }

  if (document.getElementById("featured-curated-projects")) {
    setupFeaturedCuratedRotator();
  }

  // --- GITHUB PROJECTS FETCH ---
  const githubProjectsGrid = document.getElementById("github-projects-grid");
  const rotatorContentArea = document.getElementById("rotator-content-area");
  let allGitHubRepos = [];
  let currentGitHubRotatorIndex = 0;
  let githubRotatorInterval;

  async function fetchGitHubProjects() {
    if (!klimentInfo.githubUsernames || klimentInfo.githubUsernames.length === 0) {
      return;
    }

    const fetchPromises = klimentInfo.githubUsernames.map((username) =>
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`)
        .then((res) => (res.ok ? res.json() : []))
        .catch((err) => [])
    );

    try {
      const results = await Promise.all(fetchPromises);
      let combinedRepos = [];
      results.forEach((repoList) => (combinedRepos = combinedRepos.concat(repoList)));

      // Deduplicate by ID
      const uniqueRepos = [];
      const map = new Map();
      for (const item of combinedRepos) {
        if (!map.has(item.id)) {
          map.set(item.id, true);
          uniqueRepos.push(item);
        }
      }
      allGitHubRepos = uniqueRepos;
      // Sort by push date desc
      allGitHubRepos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

      displayGitHubProjects();
      setupGitHubSidebarRotator();
    } catch (error) {
      console.error("Error fetching GitHub:", error);
      if(githubProjectsGrid) githubProjectsGrid.innerHTML = "<p>Unable to access the archive.</p>";
    }
  }

  function displayGitHubProjects() {
    if (!githubProjectsGrid) return;
    if (allGitHubRepos.length === 0) {
      githubProjectsGrid.innerHTML = "<p>No items in the archive.</p>";
      return;
    }
    githubProjectsGrid.innerHTML = "";

    allGitHubRepos.forEach((repo) => {
        // Shorten description
        let desc = repo.description || "No description provided.";
        if(desc.length > 80) desc = desc.substring(0, 80) + "...";

      const repoCardHTML = `
                <a href="${repo.html_url}" target="_blank" class="project-card-link">
                    <div class="project-card">
                        <div class="project-info">
                            <div class="project-tags">
                                ${repo.language ? `<span>${repo.language}</span>` : ""}
                            </div>
                            <h3>${repo.name}</h3>
                            <p>${desc}</p>
                            <div style="margin-top:15px; font-size:0.8rem; color:#aaa;">
                                <span>★ ${repo.stargazers_count}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
      githubProjectsGrid.innerHTML += repoCardHTML;
    });
  }

  // --- SIDEBAR ROTATOR (RECENT ACTIVITY) ---
  function setupGitHubSidebarRotator() {
    if (!rotatorContentArea) return;
    const recentRepos = allGitHubRepos.slice(0, 5); // Top 5
    if (recentRepos.length === 0) {
        rotatorContentArea.innerHTML = "<p>No activity.</p>";
        return;
    }

    rotatorContentArea.innerHTML = "";
    
    // Create items
    recentRepos.forEach((repo, index) => {
        // Hidden by default via CSS unless active
        const item = document.createElement('div');
        item.className = `rotator-item ${index === 0 ? 'active' : ''}`;
        item.style.display = index === 0 ? 'block' : 'none'; // Explicit JS toggle
        item.innerHTML = `
            <h4>${repo.name}</h4>
            <p style="font-size:0.9rem">${repo.description || "Updated recently."}</p>
            <a href="${repo.html_url}" target="_blank" style="text-decoration:underline; font-size:0.8rem;">View Code</a>
        `;
        rotatorContentArea.appendChild(item);
    });

    const items = rotatorContentArea.querySelectorAll('.rotator-item');
    
    function showSidebarItem(index) {
        items.forEach(item => item.style.display = 'none');
        items[index].style.display = 'block';
        currentGitHubRotatorIndex = index;
    }

    document.getElementById('rotator-next')?.addEventListener('click', () => {
        let next = (currentGitHubRotatorIndex + 1) % items.length;
        showSidebarItem(next);
    });
    
    document.getElementById('rotator-prev')?.addEventListener('click', () => {
        let prev = (currentGitHubRotatorIndex - 1 + items.length) % items.length;
        showSidebarItem(prev);
    });
  }

  if (document.getElementById("all-github-projects") || document.getElementById("github-projects-grid")) {
    fetchGitHubProjects();
  }

  // --- PROJECT DETAIL PAGE LOGIC ---
  // (Kept from previous iteration, ensures functionality remains on detail page)
  if(window.location.pathname.includes("project-detail.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get("id");
      // Logic handled in inline script or check previous implementation
      // But strictly speaking, we need to populate the detail page if we are there.
      if(typeof projectsData !== "undefined" && projectId) {
          const project = projectsData.find(p => p.id === projectId);
          if(project) {
              document.title = `${project.title} | Atelier`;
              updateTextContent(".project-detail-header h1", project.title);
              updateTextContent(".tech-stack-display", project.techStack.join("  /  "));
              
              const mainImg = document.querySelector(".main-project-image img");
              if(mainImg) mainImg.src = project.mainImageUrl || project.thumbnailUrl;
              
              const descContainer = document.querySelector(".description-content");
              if(descContainer) descContainer.innerHTML = project.longDescription;

              const linkBox = document.querySelector(".project-links-box");
              if(linkBox && project.githubUrl) {
                  linkBox.innerHTML = `<a href="${project.githubUrl}" target="_blank" class="cta-button">View Source</a>`;
              }
          }
      }
  }

  // --- MEMORIES SECTION ---
  function initializeMemoriesSection() {
    const memoriesGrid = document.getElementById("memories-grid");
    if (!memoriesGrid) return;

    Promise.all([
      fetch("data/picture-manifest.json").then((res) => res.ok ? res.json() : []),
      fetch("data/memories.json").then((res) => (res.ok ? res.json() : {})),
    ])
      .then(([manifest, descriptions]) => {
        if (!manifest || manifest.length === 0) {
            memoriesGrid.innerHTML = "<p>No moments captured yet.</p>";
            return;
        }
        memoriesGrid.innerHTML = "";
        manifest.forEach((imageFile) => {
          const filename = imageFile.filename;
          const details = descriptions[filename] || {};
          const card = createMemoryCard(imageFile, details);
          memoriesGrid.appendChild(card);
        });
      })
      .catch(err => console.log(err));
  }

  function createMemoryCard(imageFile, details) {
    const container = document.createElement('div');
    container.className = 'memory-card-container';
    
    // Simpler logic for "Designer" theme - simple hover lift, less complex physics
    // to maintain the clean aesthetic, but keeping the rotation for style
    container.innerHTML = `
        <div class="memory-card">
            <img src="data/pictures/${imageFile.filename}" alt="Memory" loading="lazy">
            <div style="margin-top:15px; font-family:'Courier New'; font-size:0.7rem; text-align:right; color:#999;">
                ${details.date || ""}
            </div>
        </div>
    `;
    return container;
  }

  if (document.getElementById("memories-grid")) {
    initializeMemoriesSection();
  }
});
