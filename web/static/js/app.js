/**
 * Kliment Ho Portfolio Logic
 * Handles API fetching + 3D Physics Engine for Card Inspector
 */

// --- STATE ---
const APP_STATE = {
    projects: [],
    memories: [],
    repos: [],
    inspector: {
        active: false,
        currentCard: null,
        rotationY: 0,
        isDragging: false,
        startX: 0,
        currentRotation: 0,
        // Track click vs drag
        dragStartTime: 0,
        dragStartX: 0
    }
};

// --- INIT ---
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Atelier initialized.");
    
    await fetchProjects();
    await fetchMemories();
    await fetchGitHub();
    
    // Setup Interactions
    setupGlobalEvents();
});

// --- API FETCHING ---

async function fetchProjects() {
    try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        renderProjects(data);
    } catch (e) { console.error("Project sync failed", e); }
}

async function fetchMemories() {
    try {
        const res = await fetch('/api/memories');
        const data = await res.json();
        renderMemories(data);
    } catch (e) { console.error("Memory sync failed", e); }
}

async function fetchGitHub() {
    const container = document.getElementById('archive-container');
    const users = ['DevKlim']; // Update if needed
    
    try {
        const requests = users.map(u => fetch(`https://api.github.com/users/${u}/repos?sort=pushed&per_page=5`));
        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(r => r.json()));
        const flatRepos = data.flat().sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        
        if(!container) return;

        container.innerHTML = flatRepos.slice(0, 5).map(repo => `
            <div class="archive-item">
                <div>
                    <a href="${repo.html_url}" target="_blank"><h4>${repo.name}</h4></a>
                    <span class="archive-meta">${repo.description || 'No description.'}</span>
                </div>
                <div class="archive-meta">
                    ${repo.language || 'Code'} / ★ ${repo.stargazers_count}
                </div>
            </div>
        `).join('');
    } catch (e) {
        if(container) container.innerHTML = "<p>Archive offline.</p>";
    }
}

// --- RENDERING ---

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if(!container) return;

    container.innerHTML = projects.map(p => `
        <div class="project-card">
            <div class="project-tags">
                ${p.techStack.map(t => `<span>${t}</span>`).join('')}
            </div>
            <h3>${p.title}</h3>
            <p>${p.shortDescription}</p>
            <div style="margin-top: 20px;">
                ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" style="border-bottom:1px solid #000; padding-bottom:2px;">View Artifact</a>` : ''}
            </div>
        </div>
    `).join('');
}

function renderMemories(memories) {
    const grid = document.getElementById('moments-grid');
    if(!grid) return;

    if (memories.length === 0) {
        grid.innerHTML = "<p>No images found in data/pictures/</p>";
        return;
    }

    // Store memories globally so we can find them by ID later
    APP_STATE.memories = memories;

    // Note: Added data-id attribute for Event Delegation
    grid.innerHTML = memories.map(m => `
        <div class="polaroid-wrapper" data-id="${m.id}">
            <div class="polaroid-card">
                <div class="card-face card-front">
                    <img src="/data/pictures/${m.filename}" alt="Memory">
                    <div class="caption">${m.date}</div>
                </div>
                <div class="card-face card-back">
                    <!-- Back content hidden in grid, shown in inspector -->
                </div>
            </div>
        </div>
    `).join('');
}

// --- INTERACTION LOGIC ---

function setupGlobalEvents() {
    // 1. Grid Clicks (Event Delegation)
    const grid = document.getElementById('moments-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            // Find the closest polaroid wrapper up the DOM tree
            const wrapper = e.target.closest('.polaroid-wrapper');
            if (wrapper) {
                const id = parseInt(wrapper.dataset.id);
                openInspector(id);
            }
        });
    }

    // 2. Inspector Controls
    const closeBtn = document.getElementById('inspector-close');
    const overlay = document.getElementById('inspector-overlay');
    const stage = document.getElementById('inspector-stage');

    if(closeBtn) closeBtn.addEventListener('click', closeInspector);
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeInspector(); });

    // Close on clicking background
    if(overlay) {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay || e.target === stage) closeInspector();
        });
    }

    // 3. Drag & Flip Physics
    if(stage) {
        stage.addEventListener('mousedown', startDrag);
        stage.addEventListener('touchstart', startDrag, {passive: false});

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, {passive: false});

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
}

// --- INSPECTOR LOGIC ---

function openInspector(id) {
    const memory = APP_STATE.memories.find(m => m.id === id);
    if (!memory) return;

    const overlay = document.getElementById('inspector-overlay');
    const stage = document.getElementById('inspector-stage');
    
    // Inject the full quality card
    stage.innerHTML = `
        <div class="polaroid-card inspected-card" id="active-card">
            <div class="card-face card-front">
                <img src="/data/pictures/${memory.filename}" draggable="false">
                <div class="caption">${memory.date}</div>
            </div>
            <div class="card-face card-back">
                <h4>Moment #${memory.id}</h4>
                <p style="margin: 20px 0; font-size: 1.1rem;">${memory.description}</p>
                <p style="font-family:'Courier New'; font-size:0.7rem; color:#999;">FILE: ${memory.filename}</p>
            </div>
        </div>
    `;

    // Reset Rotation State
    APP_STATE.inspector.rotationY = 0;
    
    // Show Overlay
    if(overlay) overlay.classList.add('active');
    APP_STATE.inspector.active = true;
    document.body.style.overflow = 'hidden'; // Prevent page scroll
}

function closeInspector() {
    const overlay = document.getElementById('inspector-overlay');
    if(overlay) overlay.classList.remove('active');
    APP_STATE.inspector.active = false;
    document.body.style.overflow = 'auto';
    
    // Clean up DOM after animation
    setTimeout(() => {
        const stage = document.getElementById('inspector-stage');
        if(stage) stage.innerHTML = '';
    }, 400);
}

// --- PHYSICS ENGINE ---

function getClientX(e) {
    if (e.touches && e.touches.length > 0) {
        return e.touches[0].clientX;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        return e.changedTouches[0].clientX; // Vital for touchend
    }
    return e.clientX;
}

function startDrag(e) {
    if (!APP_STATE.inspector.active) return;
    // Allow clicking the close button inside overlay without triggering drag
    if (e.target.closest('.close-btn')) return;

    APP_STATE.inspector.isDragging = true;
    
    const startX = getClientX(e);
    APP_STATE.inspector.startX = startX;
    APP_STATE.inspector.currentRotation = APP_STATE.inspector.rotationY;
    
    // Track for Click vs Drag detection
    APP_STATE.inspector.dragStartTime = Date.now();
    APP_STATE.inspector.dragStartX = startX;

    // Remove transition for instant follow
    const card = document.getElementById('active-card');
    if(card) card.style.transition = 'none';
}

function onDrag(e) {
    if (!APP_STATE.inspector.active || !APP_STATE.inspector.isDragging) return;
    e.preventDefault(); // Prevent scrolling/selecting on mobile

    const x = getClientX(e);
    const delta = x - APP_STATE.inspector.startX;

    // Sensitivity: 0.5 degrees per pixel moved
    APP_STATE.inspector.rotationY = APP_STATE.inspector.currentRotation + (delta * 0.5);

    updateCardTransform();
}

function endDrag(e) {
    if (!APP_STATE.inspector.active || !APP_STATE.inspector.isDragging) return;

    APP_STATE.inspector.isDragging = false;
    
    const card = document.getElementById('active-card');
    // Add inertia/smoothing back
    if(card) card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

    // --- CLICK VS DRAG DETECTION ---
    const duration = Date.now() - APP_STATE.inspector.dragStartTime;
    const moveDist = Math.abs(getClientX(e) - APP_STATE.inspector.dragStartX);

    // If held for less than 200ms and moved less than 5px, treat as CLICK
    if (duration < 200 && moveDist < 5) {
        doFlip();
    }
}

function doFlip() {
    // To flip naturally, we snap to the nearest 180 increment and add 180
    // OR simply add 180 to current state. 
    // Adding 180 creates a continuous flip feel.
    APP_STATE.inspector.rotationY += 180;
    updateCardTransform();
}

function updateCardTransform() {
    const card = document.getElementById('active-card');
    if (card) {
        card.style.transform = `rotateY(${APP_STATE.inspector.rotationY}deg)`;
    }
}