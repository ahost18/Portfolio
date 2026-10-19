(() => {
  "use strict";
  const config = window.REDIRECT_CONFIG || {};
  const destination = config.destinationUrl || "https://portfolio.lopegaworks.com/";
  const seconds = Math.max(0, Number.isFinite(Number(config.countdownSeconds)) ? Number(config.countdownSeconds) : 5);
  const autoRedirect = config.autoRedirect !== false;
  const $ = (id) => document.getElementById(id);

  const destinationName = $("destinationName");
  const destinationUrl = $("destinationUrl");
  const goNow = $("goNow");
  const countdownEl = $("countdown");
  const pauseButton = $("pauseRedirect");
  const note = $("redirectNote");
  const progress = $("progressBar");
  const percent = $("progressPercent");
  const stageTitle = $("stageTitle");
  const bubble = $("speechBubble");
  const stages = [...document.querySelectorAll(".stage")];

  let remaining = seconds;
  let paused = !autoRedirect;
  let redirected = false;
  let timer = null;
  let stage = 0;

  try {
    const parsed = new URL(destination, window.location.href);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Unsupported destination protocol");
    goNow.href = parsed.href;
    destinationUrl.textContent = parsed.host + parsed.pathname.replace(/\/$/, "");
  } catch (_) {
    goNow.href = "https://portfolio.lopegaworks.com/";
    destinationUrl.textContent = "portfolio.lopegaworks.com";
  }

  destinationName.textContent = config.destinationName || "LopegaWorks Portfolio";
  $("year").textContent = new Date().getFullYear();
  countdownEl.textContent = remaining;

  const titles = ["Checking your route", "Verifying destination", "Opening the portal", "Almost there"];
  const messages = Array.isArray(config.messages) && config.messages.length
    ? config.messages
    : ["Let me check where you need to go...", "Just a moment! I'm tracing the safest route.", "Almost ready! Opening your portal...", "All set! I'll take you there in a moment..."];

  function setStage(next) {
    stage = Math.max(0, Math.min(3, next));
    stages.forEach((el, i) => {
      el.classList.toggle("active", i === stage);
      el.classList.toggle("done", i < stage);
      el.querySelector(".stage-state").textContent = i < stage ? "DONE" : i === stage ? "NOW" : "";
    });
    stageTitle.textContent = titles[stage];
    bubble.textContent = messages[Math.min(stage, messages.length - 1)];
    const value = [12, 39, 68, 91][stage];
    progress.style.width = value + "%";
    percent.textContent = value + "%";
  }

  function stopTimer(message) {
    paused = true;
    if (timer) clearInterval(timer);
    timer = null;
    pauseButton.textContent = "Resume automatic redirect";
    note.innerHTML = message || "Automatic redirect is paused. You can continue whenever you're ready.";
    bubble.textContent = "No rush! Tap the button whenever you're ready to continue.";
  }

  function beginTimer() {
    if (redirected) return;
    paused = false;
    pauseButton.textContent = "Cancel automatic redirect";
    note.innerHTML = `You'll be redirected automatically in <strong><span id="countdown">${remaining}</span> seconds</strong> ` + '.';
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (paused || redirected) return;
      remaining = Math.max(0, remaining - 1);
      const currentCountdown = $("countdown");
      if (currentCountdown) currentCountdown.textContent = remaining;
      const elapsed = seconds ? 1 - remaining / seconds : 1;
      setStage(elapsed < .3 ? 0 : elapsed < .58 ? 1 : elapsed < .84 ? 2 : 3);
      if (remaining <= 0) {
        clearInterval(timer);
        timer = null;
        redirected = true;
        stageTitle.textContent = "Opening your destination";
        progress.style.width = "100%";
        percent.textContent = "100%";
        bubble.textContent = messages[messages.length - 1] || "Portal open! See you there!";
        note.textContent = "Portal open — sending you on your way…";
        window.location.assign(goNow.href);
      }
    }, 1000);
  }

  pauseButton.addEventListener("click", () => {
    if (paused) {
      if (remaining <= 0) remaining = seconds;
      beginTimer();
    } else {
      stopTimer();
    }
  });

  goNow.addEventListener("click", () => {
    redirected = true;
    if (timer) clearInterval(timer);
  });

  setStage(0);
  if (autoRedirect && seconds === 0) {
    window.location.replace(goNow.href);
  } else if (autoRedirect) {
    beginTimer();
  } else {
    stopTimer("Automatic redirect is disabled. Use the destination button when you're ready.");
    setStage(0);
  }
})();
