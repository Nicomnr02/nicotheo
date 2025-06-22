/* BEHAVIORS */
const imageCache = {};

function preventScroll(e) {
  e.preventDefault();
}
window.addEventListener("wheel", preventScroll, { passive: false });
window.addEventListener("touchmove", preventScroll, { passive: false });

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

// Preload images function
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
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.remove("fade-in");
          container.classList.add("fade-out");
          setTimeout(() => {
            container.classList.remove("fade-out");
            container.classList.add("fade-in");
          }, 500);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );
  observer.observe(container);
}

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
})();

_assets.then(() => {
  /* PAGE 0 */
  preloadImages(carouselImagePage0).then(() => {
    const page0 = document.getElementById("intro");
    let cp2starting = 0;
    const carouselPage0 = document.getElementById("carousel-page-0");

    function playCarouselImagePage0() {
      cp2starting = (cp2starting + 1) % carouselImagePage0.length;

      var cached0 = imageCache[carouselImagePage0[cp2starting]];
      if (cached0) {
        carouselPage0.style.backgroundImage = `url("${cached0.src}")`;
      } else {
        carouselPage0.style.backgroundImage = `url("${carouselImagePage0[cp2starting]}")`;
      }
    }
    setInterval(playCarouselImagePage0, 500);

    let percent = 0;
    const loadingText = document.getElementById("page0-loading-text");

    const interval = setInterval(() => {
      percent++;
      loadingText.textContent = `${percent}%`;
      if (percent === 100) clearInterval(interval);
    }, 50);

    window.addEventListener("load", () => {
      setTimeout(() => {
        page0.classList.add("page0-hidden");
        setTimeout(() => {
          page0.style.display = "none";
        }, 5000);
      }, 6000);
    });
  });

  preloadImages(carouselImagePage1).then(() => {
    let cp1starting = 0;
    const carouselPage1 = document.getElementById("carousel-page-1");
    function playCarouselImagePage1() {
      carouselPage1.style.opacity = 0;
      setTimeout(() => {
        cp1starting = (cp1starting + 1) % carouselImagePage1.length;

        var cached1 = imageCache[carouselImagePage1[cp1starting]];
        if (cached1) {
          carouselPage1.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached1.src}")`;
        } else {
          carouselPage1.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${carouselImagePage1[cp1starting]}")`;
        }
        carouselPage1.style.opacity = 1;
      }, 1000);
    }
    setInterval(playCarouselImagePage1, 5000);

    const urlParams = new URLSearchParams(window.location.search);
    const paramGuestName = urlParams.get("guest_name");
    const _paramGuestName = paramGuestName.split("_");
    if (_paramGuestName.length == 1) {
      guestName = _paramGuestName[0] + " & " + "Partner";
    } else {
      guestName = _paramGuestName.join(" & ");
    }
    const myDiv = document.getElementById("page1-footer-guest-name");
    myDiv.textContent = "Dear, " + guestName;

    const button = document.getElementById("page1-footer-heartbeat-button");
    function enableScrollOnce() {
      button.disabled = true;
      button.textContent = "Scroll Down ⬇";
      window.removeEventListener("wheel", preventScroll, { passive: false });
      window.removeEventListener("touchmove", preventScroll, { passive: false });

      const audioPlayer = document.getElementById("page1-footer-audio-player");
      audioPlayer.src = "https://github.com/Nicomnr02/nicotheo/raw/refs/heads/master/Household%20of%20Faith%20-%20Winner%20and%20Shen%20THE%20ASIDORS%202022%20COVERS%20Christian%20Wedding%20Song%20(1).mp3";
      audioPlayer.play();
    }
    button.addEventListener("click", enableScrollOnce);
  });

  preloadImages(bgImagePage2).then(() => {
    const page2 = document.getElementById("page2");
    var cached2 = imageCache[bgImagePage2[0]];
    if (cached2) {
      page2.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached2.src}")`;
    } else {
      page2.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage2[0]}")`;
    }

    Fade("page2-bible-quotation-chapter-fade-target");
  });

  preloadImages(bgImagePage3).then(() => {
    const page3 = document.getElementById("page3");
    var cached3 = imageCache[bgImagePage3[0]];
    if (cached3) {
      page3.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached3.src}")`;
    } else {
      page3.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage3[0]}")`;
    }

    Fade("page3-groom-fade-target1");
    Fade("page3-groom-fade-target2");
    Fade("page3-groom-fade-target3");
    Fade("page3-groom-fade-target4");
    Fade("page3-groom-fade-target5");
  });

  preloadImages(bgImagePage4).then(() => {
    const page4 = document.getElementById("page4");
    var cached4 = imageCache[bgImagePage4[0]];
    if (cached4) {
      page4.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached4.src}")`;
    } else {
      page4.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage4[0]}")`;
    }

    Fade("page4-groom-fade-target1");
    Fade("page4-groom-fade-target2");
    Fade("page4-groom-fade-target3");
    Fade("page4-groom-fade-target4");
    Fade("page4-groom-fade-target5");
  });

  preloadImages(bgImagePage5).then(() => {
    const page5 = document.getElementById("page5");
    var cached5 = imageCache[bgImagePage5[0]];
    if (cached5) {
      page5.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached5.src}")`;
    } else {
      page5.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage5[0]}")`;
    }

    Fade("page5-content-fade-target1");
    Fade("page5-content-fade-target2");
    Fade("page5-content-fade-target3");
  });

  preloadImages(bgImagePage6).then(() => {
    const page6 = document.getElementById("page6");
    var cached6 = imageCache[bgImagePage6[0]];
    if (cached6) {
      page6.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached6.src}")`;
    } else {
      page6.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage6[0]}")`;
    }
  });
  preloadImages(bgImagePage7).then(() => {
    const page7 = document.getElementById("page7");
    var cached7 = imageCache[bgImagePage7[0]];
    if (cached7) {
      page7.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached7.src}")`;
    } else {
      page7.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage7[0]}")`;
    }

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

    //ics file
    function downloadICS() {
      const title = "Nicolas & Theofani Wedding Celebration";
      const description = "Join us for our special day!";
      const location = "Tanjungbalai Asahan, Sumatera Utara";
      const startDate = "20250708T000000Z";
      const endDate = "20250708T130000Z";

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//YourOrganization//EN",
        "BEGIN:VEVENT",
        "UID:" + new Date().getTime() + "@nicotheoweddinginvitation.netlify.app",
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        "DTSTART:" + startDate,
        "DTEND:" + endDate,
        "SUMMARY:" + title,
        "DESCRIPTION:" + description,
        "LOCATION:" + location,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "nicotheoweddingcelebrationday.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  preloadImages(bgImagePage8).then(() => {
    const page8 = document.getElementById("page8");
    var cached8 = imageCache[bgImagePage8[0]];
    if (cached8) {
      page8.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached8.src}")`;
    } else {
      page8.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage8[0]}")`;
    }

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
    const page9 = document.getElementById("page9");
    var cached9 = imageCache[bgImagePage9[0]];
    if (cached9) {
      page9.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached9.src}")`;
    } else {
      page9.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage9[0]}")`;
    }

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
    var cached10 = imageCache[bgImagePage10[0]];
    if (cached10) {
      page10.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${cached10.src}")`;
    } else {
      page10.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${bgImagePage10[0]}")`;
    }

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

  preloadImages(bgImagePage11).then(() => {});
  preloadImages(bgImagePage12).then(() => {});
  preloadImages(bgImagePage14).then(() => {});
});
