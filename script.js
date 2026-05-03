"use strict";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const weddingConfig = {
  groomName: "zayn",
  brideName: "gigi",
  weddingDate: {
    year: 2026,
    monthIndex: 4,
    day: 5,
    hour: 18,
    minute: 0,
    second: 0,
    displayShort: "5/5/2026",
    displayLong: "Tuesday · May 5, 2026",
    displayWithTime: "Tuesday · 5/5/2026 · 06:00 PM"
  },
  location: "Rexoplaza",
  ticketCode: "INV-2026-LOVE",
  images: {
    groomAdult: "https://res.cloudinary.com/durlokstj/image/upload/v1777757363/WhatsApp_Image_2026-05-03_at_12.17.57_AMv_ic1ljr.jpg",
    groomChild: "https://res.cloudinary.com/durlokstj/image/upload/v1777757363/WhatsApp_Image_2026-05-03_at_12.17.57_AM_obaobf.jpg",
    brideAdult: "https://res.cloudinary.com/durlokstj/image/upload/v1777759733/WhatsApp_Image_2026-05-03_at_1.08.24_AM_syurhk.jpg",
    brideChild: "https://res.cloudinary.com/durlokstj/image/upload/v1777757363/WhatsApp_Image_2026-05-03_at_12.17.57_AMs_tlksrh.jpg"
  }
};

let selectedTheme = null;
let guestSource = "Unknown";
let slideshowInterval = null;

function toDisplayName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getWeddingDateTarget() {
  return new Date(
    weddingConfig.weddingDate.year,
    weddingConfig.weddingDate.monthIndex,
    weddingConfig.weddingDate.day,
    weddingConfig.weddingDate.hour,
    weddingConfig.weddingDate.minute,
    weddingConfig.weddingDate.second
  ).getTime();
}

function applyWeddingConfig() {
  const groomDisplay = toDisplayName(weddingConfig.groomName);
  const brideDisplay = toDisplayName(weddingConfig.brideName);
  const coupleDisplay = `${groomDisplay} & ${brideDisplay}`;

  document.title = `${coupleDisplay} — ${weddingConfig.weddingDate.displayShort}`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", `${coupleDisplay} — A Royal Wedding Invitation. Join us at ${weddingConfig.location} on ${weddingConfig.weddingDate.displayShort}.`);
  }

  const heroDate = $("#heroWeddingDate");
  if (heroDate) heroDate.textContent = weddingConfig.weddingDate.displayWithTime;

  const zaynName = $(".name-zayn");
  const gigiName = $(".name-gigi");
  if (zaynName) zaynName.textContent = groomDisplay;
  if (gigiName) gigiName.textContent = brideDisplay;

  const footerNames = $(".footer-names");
  const footerDate = $("#footerWeddingDate");
  if (footerNames) footerNames.textContent = coupleDisplay;
  if (footerDate) footerDate.textContent = "May 5, 2026";

  const ticketCouple = $("#ticketCoupleNames");
  const ticketEventDate = $("#ticketEventDate");
  const ticketLocation = $("#ticketLocationText");
  if (ticketCouple) ticketCouple.textContent = coupleDisplay;
  if (ticketEventDate) ticketEventDate.textContent = weddingConfig.weddingDate.displayWithTime;
  if (ticketLocation) ticketLocation.textContent = weddingConfig.location;

  const venueAddress = $(".venue-address");
  if (venueAddress) venueAddress.textContent = weddingConfig.location;

  const zaynAdultImg = $("#zaynAdultImg");
  const zaynChildImg = $("#zaynChildImg");
  const gigiAdultImg = $("#gigiAdultImg");
  const gigiChildImg = $("#gigiChildImg");

  if (zaynAdultImg) zaynAdultImg.src = weddingConfig.images.groomAdult;
  if (zaynChildImg) zaynChildImg.src = weddingConfig.images.groomChild;
  if (gigiAdultImg) gigiAdultImg.src = weddingConfig.images.brideAdult;
  if (gigiChildImg) gigiChildImg.src = weddingConfig.images.brideChild;
}

/* ═══ VINTAGE GRAMOPHONE MUSIC CONTROL ═══ */
function ensureMusicControl(audio) {
  let btn = $("#musicControl");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "musicControl";
    btn.className = "music-control";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle music");
    // Vintage Gramophone SVG — matte gold, minimalist
    btn.innerHTML = `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="38" r="14" stroke="currentColor" stroke-width="1.8" fill="none"/>
        <circle cx="32" cy="38" r="5" fill="currentColor" opacity="0.5"/>
        <circle cx="32" cy="38" r="2" fill="currentColor"/>
        <circle cx="32" cy="38" r="9" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.4"/>
        <line x1="32" y1="24" x2="32" y2="14" stroke="currentColor" stroke-width="2"/>
        <path d="M32 14 Q42 10 46 16 Q44 20 38 18 Q34 17 32 20" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="30.5" y="50" width="3" height="6" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="26" y="55" width="12" height="2" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const syncVisual = () => {
    const playing = !audio.paused;
    btn.classList.toggle("spinning", playing);
    btn.style.opacity = playing ? "1" : "0.7";
  };

  btn.onclick = () => {
    if (audio.paused) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
    syncVisual();
  };

  audio.addEventListener("play", syncVisual);
  audio.addEventListener("pause", syncVisual);
  syncVisual();
}

/* ═══ THEME SELECTION — FIXED DYNAMIC LOGIC ═══ */
function initThemeSelection() {
  const overlay = $("#theme-overlay");
  const groomBtn = $("#groomBtn");
  const brideBtn = $("#brideBtn");
  const mainContent = $("#mainContent");
  const audio = $("#weddingMusic");

  if (audio) ensureMusicControl(audio);

  const onSelect = (theme) => {
    selectedTheme = theme;
    guestSource = theme === "groom" ? "Side: Groom" : "Side: Bride";

    // Remove both theme classes first
    document.body.classList.remove("groom-theme", "bride-theme");

    // Apply the correct theme class based on selection
    if (theme === "groom") {
      document.body.classList.add("groom-theme");
    } else if (theme === "bride") {
      document.body.classList.add("bride-theme");
    }

    // Hide the overlay
    if (overlay) overlay.classList.add("hidden");

    // Reveal main content
    if (mainContent) mainContent.classList.remove("hidden-before-theme");

    // Update ticket side display
    updateTicketSide();

    // Auto-play music
    if (audio) {
      audio.play().catch(() => { });
    }
  };

  if (groomBtn) {
    groomBtn.addEventListener("click", () => onSelect("groom"));
  }
  if (brideBtn) {
    brideBtn.addEventListener("click", () => onSelect("bride"));
  }
}

/* ═══ PHOTO SLIDESHOW ═══ */
function initPhotoSlideshow() {
  const circles = $$(".root-circle");
  if (!circles.length) return;

  let showAdult = true;
  circles.forEach((circle) => circle.classList.add("revealed-adult"));

  if (slideshowInterval) clearInterval(slideshowInterval);

  slideshowInterval = setInterval(() => {
    showAdult = !showAdult;
    circles.forEach((circle) => {
      circle.classList.toggle("revealed-adult", showAdult);
    });
  }, 3000);
}

/* ═══ COUNTDOWN ═══ */
function initCountdown() {
  const target = getWeddingDateTarget();
  const countdown = $("#countdown");
  let intervalId = null;

  const tick = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      if (intervalId) clearInterval(intervalId);
      if (countdown) {
        countdown.innerHTML = '<p class="countdown-finished">The Wedding is Today!</p>';
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, "0");

    const cdDays = $("#cd-days");
    const cdHours = $("#cd-hours");
    const cdMins = $("#cd-mins");
    const cdSecs = $("#cd-secs");

    if (cdDays) cdDays.textContent = pad(d);
    if (cdHours) cdHours.textContent = pad(h);
    if (cdMins) cdMins.textContent = pad(m);
    if (cdSecs) cdSecs.textContent = pad(s);
  };

  tick();
  intervalId = setInterval(tick, 1000);
}

/* ═══ RSVP ═══ */
function initRSVP() {
  const form = $("#rsvpForm");
  if (!form) return;

  const success = $("#rsvpSuccess");
  const nameInput = $("#rsvpName");
  const guestsInput = $("#rsvpGuests");
  const noteInput = $("#rsvpNote");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const guests = Math.max(1, Math.min(6, parseInt(guestsInput.value || "1", 10)));
    const status = form.querySelector('input[name="attendance"]:checked')?.value || "joyfully_attending";
    const note = noteInput.value.trim();

    if (!name) {
      nameInput.focus();
      success.textContent = "Please add your name before sending.";
      success.style.color = "#8B2D2D";
      return;
    }

    const submitBtn = $("#rsvpSubmitBtn");
    const originalContent = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const messageText = `New RSVP\nGuest: ${name}\nStatus: ${status === "joyfully_attending" ? "Attending" : "Declining"}\nGuests: ${guests}\nSource: ${guestSource}\nMessage: ${note || "No message left"}`;

    const token = "8789687204:AAGUWQwHK1n08z4GPG30odQ8cTR16vK6WUw";
    const chatId = "5577896692";
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;

    fetch(tgUrl, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          form.reset();
          guestsInput.value = "1";
          success.textContent = status === "joyfully_attending"
            ? "RSVP received. Thank you for your response."
            : "Your RSVP is received with love. You will be missed dearly.";
          success.style.color = "";
        } else {
          success.textContent = "Oops! There was a problem submitting your RSVP.";
          success.style.color = "#8B2D2D";
        }
      })
      .catch(() => {
        success.textContent = "Oops! A network error occurred. Please try again.";
        success.style.color = "#8B2D2D";
      })
      .finally(() => {
        submitBtn.textContent = originalContent;
        submitBtn.disabled = false;
      });
  });
}

/* ═══ TICKET UTILITIES ═══ */
function sanitizeFileNamePart(value) {
  return (value || "Guest")
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 40) || "Guest";
}

function updateTicketSide() {
  const sideEl = $("#ticketGuestSide");
  if (!sideEl) return;
  sideEl.textContent = selectedTheme === "groom"
    ? "Groom Side"
    : selectedTheme === "bride"
      ? "Bride Side"
      : "Select Groom or Bride";
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/* ═══ CANVAS TICKET GENERATOR — Royal Fonts ═══ */
function drawTicketToCanvas(guestName) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 840;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable.");

  const isBride = selectedTheme === "bride";
  const isGroom = selectedTheme === "groom";
  const accent = isBride ? "#c4a08a" : isGroom ? "#8d7b67" : "#b08d57";
  const bgColor = isBride ? "#fdf5f4" : isGroom ? "#f5f7fc" : "#fffdf5";
  const textDark = "#2e2e2e";

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  roundRect(ctx, 60, 60, canvas.width - 120, canvas.height - 120, 4, false, true);

  // Inner border
  ctx.strokeStyle = "#d9c9a8";
  ctx.lineWidth = 0.8;
  roundRect(ctx, 85, 85, canvas.width - 170, canvas.height - 170, 3, false, true);

  // "THE ROYAL INVITATION" heading
  ctx.fillStyle = "#8b1e2d";
  ctx.font = '500 26px "Cormorant Garamond", Garamond, serif';
  ctx.fillText("THE ROYAL INVITATION", 130, 158);

  // Divider line
  ctx.strokeStyle = "#d9c9a8";
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(130, 178);
  ctx.lineTo(canvas.width - 130, 178);
  ctx.stroke();

  // Couple names
  ctx.fillStyle = textDark;
  ctx.font = 'italic 64px "Cormorant Garamond", Garamond, serif';
  ctx.fillText(`${toDisplayName(weddingConfig.groomName)} & ${toDisplayName(weddingConfig.brideName)}`, 130, 270);

  const sideText = selectedTheme === "groom"
    ? "Groom Side"
    : selectedTheme === "bride"
      ? "Bride Side"
      : "Guest Side";

  const rows = [
    { label: "Guest Name", value: guestName },
    { label: "Side", value: sideText },
    { label: "Date & Time", value: weddingConfig.weddingDate.displayWithTime },
    { label: "Venue", value: weddingConfig.location }
  ];

  let y = 360;
  rows.forEach((row) => {
    ctx.fillStyle = "#7a6e5d";
    ctx.font = '400 22px "Lora", Georgia, serif';
    ctx.fillText(row.label.toUpperCase(), 140, y);

    ctx.fillStyle = textDark;
    ctx.font = '500 38px "Cormorant Garamond", Garamond, serif';
    ctx.fillText(row.value, 440, y + 2);

    ctx.strokeStyle = "#d9c9a8";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(130, y + 22);
    ctx.lineTo(canvas.width - 130, y + 22);
    ctx.stroke();

    y += 100;
  });

  // Ticket code
  ctx.fillStyle = "#8b1e2d";
  ctx.font = '600 18px "Lora", Georgia, serif';
  ctx.fillText(weddingConfig.ticketCode, canvas.width - 320, canvas.height - 100);

  // Corner ornaments
  ctx.fillStyle = accent;
  ctx.font = "18px serif";
  ctx.fillText("✦", 100, 115);
  ctx.fillText("✦", canvas.width - 116, canvas.height - 88);

  return canvas;
}

/* ═══ DIGITAL TICKET INIT ═══ */
function initDigitalTicket() {
  const nameInput = $("#ticketNameInput");
  const nameOutput = $("#ticketGuestName");
  const saveBtn = $("#saveTicketBtn");
  const status = $("#ticketStatus");

  if (!nameInput || !nameOutput || !saveBtn || !status) return;

  updateTicketSide();

  const syncName = () => {
    const value = nameInput.value.trim();
    nameOutput.textContent = value || "Your Name Here";
  };

  nameInput.addEventListener("input", syncName);
  syncName();

  saveBtn.addEventListener("click", () => {
    const guestName = nameInput.value.trim();
    if (!guestName) {
      status.textContent = "Please enter your name first to claim your invitation.";
      status.style.color = "#8B2D2D";
      nameInput.focus();
      return;
    }

    const originalBtnText = saveBtn.textContent;
    saveBtn.textContent = "Generating Ticket...";
    saveBtn.disabled = true;
    status.textContent = "Preparing your royal invitation...";
    status.style.color = "";

    setTimeout(() => {
      try {
        const canvas = drawTicketToCanvas(guestName);
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.style.display = "none";
        link.download = `Royal_Invitation_${sanitizeFileNamePart(guestName)}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        link.remove();

        status.textContent = "Your royal invitation has been saved successfully.";
      } catch (err) {
        console.error("Ticket generation error:", err);
        status.textContent = "Could not generate ticket image. Check console for details.";
        status.style.color = "#8B2D2D";
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalBtnText;
      }
    }, 120);
  });
}

/* ═══ INIT ═══ */
document.addEventListener("DOMContentLoaded", () => {
  applyWeddingConfig();
  initThemeSelection();
  initPhotoSlideshow();
  initCountdown();
  initRSVP();
  initDigitalTicket();
});
