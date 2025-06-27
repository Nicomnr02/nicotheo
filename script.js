/* BEHAVIORS */

const imageCache = {};

// Initially block scroll

const lenis = new Lenis({
  duration: 0.5,
  smooth: true,
  direction: "vertical",
  gestureDirection: "vertical",
  smoothTouch: true,
  lerp: 0.05,
  normalizeScroll: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

function enableScrollSnap() {}

// collect assets
let carouselImagePage0 = [];
let carouselImagePage1 = [];
let bgImagePage2 = [];
let bgImagePage3 = [];
let bgImagePage4 = [];
let bgImagePage5 = [];
let bgImagePage6 = [];
let bgImagePage7 = [];
let bgImagePage8 = [];
let bgImagePage9 = [];
let bgImagePage10 = [];
let bgImagePage11 = [];
let bgImagePage12 = [];
let bgImagePage14 = [];
let bgMusic = "";
let introVideo = "";
let page1Video = "";

/* HELPER */
async function preloadImages(urls) {
  return Promise.allSettled(
    urls.map((url) => {
      if (imageCache[url]) return Promise.resolve(imageCache[url]);

      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        imageCache[url] = img;

        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });
    })
  );
}
// Faster: preload only first image of page first
async function preloadFirst(urls) {
  if (!urls.length) return;
  const first = urls[0];
  if (imageCache[first]) return;

  const img = new Image();
  img.src = first;
  imageCache[first] = img;

  return new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;
  });
}
async function preloadImagesWithProgress(urls, onProgress) {
  let loaded = 0;
  const total = urls.length;

  const promises = urls.map((url) => {
    if (imageCache[url]) {
      loaded++;
      onProgress(Math.round((loaded / total) * 100));
      return Promise.resolve(imageCache[url]);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      imageCache[url] = img;
      img.onload = () => {
        loaded++;
        onProgress(Math.round((loaded / total) * 100));
        resolve(img);
      };
      img.onerror = () => {
        loaded++;
        onProgress(Math.round((loaded / total) * 100));
        resolve(null);
      };
    });
  });

  return Promise.all(promises);
}
async function FetchAsset() {
  const URL = "https://nicotheoweddingassetapi.vercel.app/api/";
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch assets data:", error);
    return null;
  }
}
async function GetAssets() {
  const expiredKey = "nico-fani-wedding-assets-expired-time";
  const assetsKey = "nico-fani-wedding-assets-last-retrieving";
  const now = new Date();
  const newExpiredTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const refreshAsset = async () => {
    const data = await FetchAsset();
    if (data) {
      localStorage.setItem(assetsKey, JSON.stringify(data));
    }
    return data;
  };
  const refreshExpired = () => {
    localStorage.setItem(expiredKey, newExpiredTime);
  };
  let expiredTime = localStorage.getItem(expiredKey);
  if (!expiredTime) {
    expiredTime = newExpiredTime;
    refreshExpired();
  }
  let assets = localStorage.getItem(assetsKey);
  const hasExpired = new Date(expiredTime) <= now;
  if (!assets || hasExpired) {
    refreshExpired();
    return await refreshAsset();
  }
  try {
    return JSON.parse(assets);
  } catch (err) {
    console.error("Failed to parse local asset data:", err);
    return await refreshAsset();
  }
}
function Fade(id) {
  const container = document.getElementById(id);
  if (!container) {
    console.warn(`Fade: element with id "${id}" not found.`);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.remove("fade-in");
          container.classList.add("fade-out");

          setTimeout(() => {
            container.classList.remove("fade-out");
            container.classList.add("fade-in");
          }, 500);

          // 👇 Stop observing after the first trigger
          obs.unobserve(container);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  observer.observe(container);
}

function downloadICS() {
  console.log("lcliclciclcicliclil");
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:20250708T000000Z",
    "DTEND:20250708T130000Z",
    "SUMMARY:Nicolas & Theofani Wedding Celebration",
    "DESCRIPTION:Join us for our special day!",
    "LOCATION:Tanjungbalai Asahan, Sumatera Utara",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const bom = new Uint8Array([0xef, 0xbb, 0xbf]); // optional UTF-8 BOM
  const blob = new Blob([bom, icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "nicotheoweddingcelebrationday.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
function copyCardNumber(cardElement) {
  const numberElement = cardElement.querySelector(".number");
  const number = numberElement.innerText;
  console.log(numberElement != null ? "card not null" : "card null");
  navigator.clipboard
    .writeText(number)
    .then(() => {
      showToast("Card number copied!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

document.body.classList.add("stop-scroll");
lenis.stop();

// main
document.addEventListener("DOMContentLoaded", () => {
  const _assets = (async () => {
    const assets = await GetAssets();
    if (!assets) return;
    if (assets.carousel_image_page_0) carouselImagePage0.push(...assets.carousel_image_page_0);
    if (assets.carousel_image_page_1) carouselImagePage1.push(...assets.carousel_image_page_1);
    if (assets.bg_image_page_3) bgImagePage2.push(...assets.bg_image_page_3);
    if (assets.bg_image_page_4) bgImagePage3.push(...assets.bg_image_page_4);
    if (assets.bg_image_page_5) bgImagePage4.push(...assets.bg_image_page_5);
    if (assets.bg_image_page_6) bgImagePage5.push(...assets.bg_image_page_6);
    if (assets.bg_image_page_7) bgImagePage6.push(...assets.bg_image_page_7);
    if (assets.bg_image_page_8) bgImagePage7.push(...assets.bg_image_page_8);
    if (assets.bg_image_page_9) bgImagePage8.push(...assets.bg_image_page_9);
    if (assets.bg_image_page_10) bgImagePage9.push(...assets.bg_image_page_10);
    if (assets.bg_image_page_11) bgImagePage10.push(...assets.bg_image_page_11);
    if (assets.bg_image_page_12) bgImagePage12.push(...assets.bg_image_page_12);
    if (assets.bg_image_page_14) bgImagePage14.push(...assets.bg_image_page_14);
    if (assets.bg_music) bgMusic = assets.bg_music;
    if (assets.intro_video) introVideo = assets.intro_video;
    if (assets.page_1_video) page1Video = assets.page_1_video;
  })();

  _assets.then(() => {
    /* PAGE 0 */

    const page0 = document.getElementById("intro");
    const loadingText = document.getElementById("page0-loading-text");
    let percent = 0;
    const percentInterval = setInterval(() => {
      percent++;
      if (loadingText) {
        loadingText.textContent = `${percent}%`;
      }
      if (percent >= 100) clearInterval(percentInterval);
    }, 30);

    setTimeout(() => {
      page0.classList.add("page0-hidden");
      setTimeout(() => {
        page0.style.display = "none";
        enableScrollSnap();
        console.log("🚀 Page0 hidden");
      }, 1000);
    }, 4500);

    // PAGE 1
    const urlParams = new URLSearchParams(window.location.search);
    const paramGuestName = urlParams.get("guest_name");
    const myDiv = document.getElementById("page1-footer-guest-name");
    myDiv.textContent = "Dear, " + paramGuestName;

    const button = document.getElementById("page1-footer-heartbeat-button");
    button.addEventListener("click", () => {
      button.disabled = true;
      button.textContent = "Scroll Down ⬇";

      lenis.start();
      document.body.classList.remove("stop-scroll");

      const audioPlayer = document.getElementById("page1-footer-audio-player");
      audioPlayer.src = bgMusic;
      console.log("bgmusic: ", bgMusic);
      audioPlayer.play();
    });

    // PAGE 2
    preloadImages(bgImagePage2).then(() => {
      Fade("page2-bible-quotation-chapter-fade-target");
    });

    preloadImages(bgImagePage3).then(() => {
      Fade("page3-groom-fade-target1");
      Fade("page3-groom-fade-target2");
      Fade("page3-groom-fade-target3");
      Fade("page3-groom-fade-target4");
      Fade("page3-groom-fade-target5");
    });

    preloadImages(bgImagePage4).then(() => {
      Fade("page4-groom-fade-target1");
      Fade("page4-groom-fade-target2");
      Fade("page4-groom-fade-target3");
      Fade("page4-groom-fade-target4");
      Fade("page4-groom-fade-target5");
    });

    preloadImages(bgImagePage5).then(() => {
      Fade("page5-content-fade-target1");
      Fade("page5-content-fade-target2");
      Fade("page5-content-fade-target3");
    });

    preloadImages(bgImagePage6).then(() => {});
    preloadImages(bgImagePage7).then(() => {
      const targetDate = new Date("2025-07-08T09:00:00");

      function updateCountdown() {
        const now = new Date();
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) {
          document.getElementById("countdown").textContent = "The event has started!";
          clearInterval(timer);
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        document.getElementById("page7-celebration-countdown-days").textContent = `${days}`;
        document.getElementById("page7-celebration-countdown-hours").textContent = `${hours}`;
        document.getElementById("page7-celebration-countdown-minutes").textContent = `${minutes}`;
        document.getElementById("page7-celebration-countdown-seconds").textContent = `${seconds}`;
      }

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
    });

    preloadImages(bgImagePage8).then(() => {
      document.getElementById("wishForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const wish = document.getElementById("wish").value.trim();
        const created_at = Math.floor(Date.now() / 1000);
        const submitButton = this.querySelector("button");

        const jsonData = {
          name,
          wish,
          created_at,
        };

        const response = await fetch("https://68370b61664e72d28e4343a2.mockapi.io/api/v1/wish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });

        if (!response.ok) throw new Error("Failed to submit");

        const _ = await response.json();

        submitButton.disabled = true;
        submitButton.textContent = "SUBMITTED";

        document.getElementById("wishForm").reset();
      });
    });

    preloadImages(bgImagePage9).then(() => {
      let wishes = [];
      let currentPage = 0;
      const pageSize = 2;

      const wishesContainer = document.getElementById("wishesContainer");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");

      async function fetchWishes() {
        console.log("Fetching wishes...");
        try {
          const res = await fetch("https://68370b61664e72d28e4343a2.mockapi.io/api/v1/wish");
          wishes = (await res.json()).reverse(); // Most recent first
          console.log("Fetched wishes:", wishes);
          renderPage();
        } catch (err) {
          wishesContainer.innerHTML = "<p style='color: red;'>Failed to load wishes.</p>";
          console.error("Error fetching wishes:", err);
        }
      }

      function renderPage() {
        wishesContainer.innerHTML = "";
        const start = currentPage * pageSize;
        const end = start + pageSize;
        const currentItems = wishes.slice(start, end);

        currentItems.forEach((item, index) => {
          const card = document.createElement("div");
          card.className = `wish-card ${index % 2 === 0 ? "left" : "right"}`;
          card.innerHTML = `
      <h3 class="single-line-ellipsis">${item.name}</h3>
      <p class="wish-text">${item.wish}</p>
      <p class="wish-date">${new Date(item.created_at * 1000).toLocaleString()}</p>
    `;
          wishesContainer.appendChild(card);
        });

        if (currentPage == 0) {
          prevBtn.innerHTML = ``;
        } else {
          prevBtn.innerHTML = `<button class="page9-pagination-control-button" id="prevBtn">← Previous</button>`;
        }
        nextBtn.disabled = end >= wishes.length;
      }

      prevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
          currentPage--;
          renderPage();
        }
      });

      nextBtn.addEventListener("click", () => {
        if ((currentPage + 1) * pageSize < wishes.length) {
          currentPage++;
          renderPage();
        }
      });

      window.addEventListener("DOMContentLoaded", fetchWishes);

      {
        const wishesPage = document.querySelector(".page9");

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                fetchWishes();
              }
            });
          },
          { threshold: 0.5 }
        );

        observer.observe(wishesPage);
      }
    });

    preloadImages(bgImagePage10).then(() => {
      const page10 = document.getElementById("page10");

      function copyToClipboard1() {
        const text = document.getElementById("account-number1").innerText;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            alert("Copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
          });
      }
      function copyToClipboard2() {
        const text = document.getElementById("account-number2").innerText;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            alert("Copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
          });
      }
    });

    preloadImages(bgImagePage11).then(() => {
      const images = document.querySelectorAll(".carousel img");
      const prevBtn = document.querySelector(".prev");
      const nextBtn = document.querySelector(".next");
      const modal = document.getElementById("previewModal");
      const previewImage = document.getElementById("previewImage");
      const downloadBtn = document.getElementById("downloadBtn");
      const counter = document.getElementById("counter");

      let current = 0;

      function updateCounter() {
        counter.innerHTML = `${current + 1} / ${images.length}<br><br>Hold to download`;
      }

      function showImage(index) {
        images.forEach((img) => img.classList.remove("active"));
        images[index].classList.add("active");
        updateCounter();
      }

      prevBtn.addEventListener("click", () => {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
      });

      nextBtn.addEventListener("click", () => {
        current = (current + 1) % images.length;
        showImage(current);
      });

      images.forEach((img) => {
        img.addEventListener("click", () => {
          previewImage.src = img.src;
          downloadBtn.href = img.src;
          modal.style.display = "flex";
        });
      });

      window.closeModal = function () {
        modal.style.display = "none";
        previewImage.src = "";
      };

      showImage(current);
    });
  });
  preloadImages(bgImagePage12).then(() => {});
  preloadImages(bgImagePage14).then(() => {});
});
