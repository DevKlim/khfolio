document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURATION ---
  const VVIP_CONFIG = {
    totalSpinsKey: "vvipTotalSpins_lucas", // Unique key for localStorage
    initialSpins: 5,
    secondLastWinImage: "data/lottery/last2-match.png",
    lastWinImage: "data/lottery/last-match.png",
    secondLastWinSound: "data/lottery/2ndvl.mp3",
    lastWinSound: "data/lottery/lastvl.mp3",
    // IMPORTANT: Replace with the actual YouTube Video ID for the final prize
    youtubeVideoId: "dQw4w9WgXcQ", // Placeholder: Rick Astley
    spinDuration: 3000, // in milliseconds
    imageChangeInterval: 100, // ms, for spin animation
  };

  // --- DOM ELEMENTS ---
  const spinButton = document.getElementById("spin-button");
  const spinsLeftCount = document.getElementById("spins-left-count");
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  const bgMusic = document.getElementById("bg-music");
  const winSound1 = document.getElementById("win-sound-1");
  const winSound2 = document.getElementById("win-sound-2");

  // Win overlays
  const winOverlay1 = document.getElementById("win-overlay-1");
  const winModal1 = document.getElementById("win-modal-1");
  const winText1 = document.getElementById("win-text-1");
  const winImage1 = document.getElementById("win-image-1");
  const winSubtext1 = document.getElementById("win-subtext-1");

  const videoOverlay = document.getElementById("video-overlay");
  const videoContainer = document.getElementById("video-container");

  // --- STATE ---
  let totalSpins = localStorage.getItem(VVIP_CONFIG.totalSpinsKey)
    ? parseInt(localStorage.getItem(VVIP_CONFIG.totalSpinsKey))
    : VVIP_CONFIG.initialSpins;
  let isSpinning = false;
  let imageManifest = [];
  let youtubePlayer;

  // --- INITIALIZATION ---
  async function init() {
    // Load image manifest for random spinning
    try {
      const response = await fetch("data/picture-manifest.json");
      if (!response.ok) throw new Error("Picture manifest not found");
      imageManifest = await response.json();
    } catch (error) {
      console.error("Failed to load image manifest:", error);
      // Fallback with a few images if manifest fails
      imageManifest = [
        { filename: "data/lottery/last-match.png" },
        { filename: "data/lottery/last2-match.png" },
      ];
    }

    updateSpinsDisplay();
    spinButton.addEventListener("click", handleSpin);

    // Attempt to play background music (user interaction needed)
    document.body.addEventListener(
      "click",
      () => {
        if (bgMusic.paused) {
          bgMusic.play().catch((e) => console.error("Audio play failed:", e));
        }
      },
      { once: true }
    );
  }

  function updateSpinsDisplay() {
    spinsLeftCount.textContent = totalSpins;
    if (totalSpins <= 0) {
      spinButton.disabled = true;
      spinButton.textContent = "No Spins Left";
    }
  }

  // --- EVENT HANDLERS ---
  function handleSpin() {
    if (isSpinning || totalSpins <= 0) return;

    isSpinning = true;
    spinButton.disabled = true;
    totalSpins--;
    localStorage.setItem(VVIP_CONFIG.totalSpinsKey, totalSpins);
    updateSpinsDisplay();

    startSpinAnimation();

    setTimeout(() => {
      stopSpinning();
    }, VVIP_CONFIG.spinDuration);
  }

  // --- SPINNING LOGIC ---
  function startSpinAnimation() {
    reels.forEach((reel) => {
      const reelImg = reel.querySelector("img");
      reel.interval = setInterval(() => {
        const randomImage =
          imageManifest[Math.floor(Math.random() * imageManifest.length)];
        reelImg.src = `data/pictures/${randomImage.filename}`;
      }, VVIP_CONFIG.imageChangeInterval);
    });
  }

  function stopSpinning() {
    reels.forEach((reel) => clearInterval(reel.interval));

    // Determine outcome based on spins REMAINING
    if (totalSpins === 1) {
      // This was the 4th spin (5 -> 4 -> 3 -> 2 -> 1)
      handleSecondLastWin();
    } else if (totalSpins === 0) {
      // This was the 5th spin
      handleLastWin();
    } else {
      // Regular non-winning spin
      const finalImages = new Set();
      while (finalImages.size < 3) {
        const randomImage =
          imageManifest[Math.floor(Math.random() * imageManifest.length)];
        finalImages.add(`data/pictures/${randomImage.filename}`);
      }
      const imagesArray = Array.from(finalImages);
      reels.forEach((reel, index) => {
        reel.querySelector("img").src = imagesArray[index];
      });
      isSpinning = false;
      if (totalSpins > 0) spinButton.disabled = false;
    }
  }

  // --- WIN SCENARIOS ---
  function handleSecondLastWin() {
    setReelsTo(VVIP_CONFIG.secondLastWinImage);
    winSound1.src = VVIP_CONFIG.secondLastWinSound;
    winSound1.play();
    startConfetti(200); // 2D effect

    winImage1.src = VVIP_CONFIG.secondLastWinImage;
    winText1.textContent = "YOU WON...";
    winSubtext1.textContent = "(click to see your prize)";
    winOverlay1.style.display = "flex";

    let clickCount = 0;
    winModal1.onclick = () => {
      clickCount++;
      if (clickCount === 1) {
        winText1.textContent = "YOU WON... nothing!";
        winSubtext1.innerHTML = "<em>(what did you expect?)</em>";
      } else if (clickCount === 2) {
        winText1.textContent = "It was rigged from the start...";
        winSubtext1.innerHTML =
          "Might as well pull the last one.<br>(click to close)";
      } else {
        winOverlay1.style.display = "none";
        winModal1.onclick = null; // remove listener
        isSpinning = false;
        if (totalSpins > 0) spinButton.disabled = false;
      }
    };
  }

  function handleLastWin() {
    setReelsTo(VVIP_CONFIG.lastWinImage);
    winSound2.src = VVIP_CONFIG.lastWinSound;
    winSound2.play();
    startConfetti(500, true); // 3D effect

    videoOverlay.style.display = "flex";

    // Load YouTube Player
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      // Fallback if YouTube API fails to load
      console.error("YouTube API not loaded. Cannot play video.");
      setTimeout(() => {
        window.location.href = "winner.html";
      }, 5000); // Redirect after 5s
    } else if (youtubePlayer) {
      youtubePlayer.loadVideoById(VVIP_CONFIG.youtubeVideoId);
      youtubePlayer.playVideo();
    } else {
      youtubePlayer = new YT.Player(videoContainer, {
        height: "100%",
        width: "100%",
        videoId: VVIP_CONFIG.youtubeVideoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }

  function onPlayerStateChange(event) {
    // YT.PlayerState.ENDED is 0
    if (event.data === YT.PlayerState.ENDED) {
      window.location.href = "winner.html";
    }
  }

  function setReelsTo(imageSrc) {
    reels.forEach((reel) => {
      reel.querySelector("img").src = imageSrc;
    });
  }

  // --- VISUAL EFFECTS ---
  function startConfetti(count, is3D = false) {
    for (let i = 0; i < count; i++) {
      createConfetti(is3D);
    }
  }

  function createConfetti(is3D) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    const colors = ["#ffd700", "#f9c80e", "#f8b700", "#fff", "#f37121"];
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;

    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;

    if (is3D) {
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      confetti.style.transform = `rotate3d(${Math.random()}, ${Math.random()}, ${Math.random()}, 180deg)`;
    }

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }

  // --- START ---
  init();
});
