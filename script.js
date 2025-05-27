/* BEHAVIORS */

window.addEventListener("load", () => {
  const element = document.getElementById("intro");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
});

function preventScroll(e) {
  e.preventDefault();
}
window.addEventListener("wheel", preventScroll, { passive: false });
window.addEventListener("touchmove", preventScroll, { passive: false });

function Fade(id) {
  const container = document.getElementById(id);
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

/* PAGE 0 */
{
  const page0 = document.getElementById("intro");

  const carouselImagePage0 = ["https://assets.apps-madhani.com/ess/user/yXhf80.jpeg", "https://assets.apps-madhani.com/ess/user/yXhf60.jpg", "https://assets.apps-madhani.com/ess/user/yXhf603.jpg"];

  // Preload images function
  function preloadImages(urls, callback) {
    let loadedCount = 0;
    const total = urls.length;
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
          callback();
        }
      };
      img.onerror = () => {
        // Even if image fails, count it to avoid blocking
        loadedCount++;
        if (loadedCount === total) {
          callback();
        }
      };
    });
  }

  preloadImages(carouselImagePage0, () => {
    let cp2starting = 0;
    const carouselPage0 = document.getElementById("carousel-page-0");

    function playCarouselImagePage0() {
      cp2starting = (cp2starting + 1) % carouselImagePage0.length;
      carouselPage0.style.backgroundImage = `url("${carouselImagePage0[cp2starting]}")`;
    }
    setInterval(playCarouselImagePage0, 100);

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
        }, 1000);
      }, 6000);
    });
  });
}

/* PAGE 1 */
{
  const carouselImagePage1 = ["https://assets.apps-madhani.com/ess/user/yXhf80.jpeg", "https://assets.apps-madhani.com/ess/user/yXhf60.jpg", "https://assets.apps-madhani.com/ess/user/yXhf603.jpg"];
  let cp1starting = 0;
  const carouselPage1 = document.getElementById("carousel-page-1");
  function playCarouselImagePage1() {
    carouselPage1.style.opacity = 0;
    setTimeout(() => {
      cp1starting = (cp1starting + 1) % carouselImagePage1.length;
      carouselPage1.style.backgroundImage = `radial-gradient(circle, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 90%), url("${carouselImagePage1[cp1starting]}")`;
      carouselPage1.style.opacity = 1;
    }, 500);
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
}

/* PAGE 2 */
{
  Fade("page2-bible-quotation-chapter-fade-target");
}

/* PAGE 3 */
{
  Fade("page3-groom-fade-target1");
  Fade("page3-groom-fade-target2");
  Fade("page3-groom-fade-target3");
  Fade("page3-groom-fade-target4");
  Fade("page3-groom-fade-target5");
}

/* PAGE 4 */
{
  Fade("page4-groom-fade-target1");
  Fade("page4-groom-fade-target2");
  Fade("page4-groom-fade-target3");
  Fade("page4-groom-fade-target4");
  Fade("page4-groom-fade-target5");
}

/* PAGE 5 */
{
  Fade("page5-content-fade-target1");
  Fade("page5-content-fade-target2");
  Fade("page5-content-fade-target3");
}

/* PAGE 7 */
{
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
}
