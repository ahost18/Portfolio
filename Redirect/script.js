(() => {
  "use strict";
  const config = window.LW_CONFIG || {};
  const destination = config.destination || "https://portfolio.lopegaworks.com";
  const delay = Math.max(1, Number(config.redirectDelaySeconds) || 5);
  const autoRedirect = config.autoRedirect !== false;

  const $ = (id) => document.getElementById(id);
  const scene = $("scene");
  const countdown = $("countdown");
  const footnoteCount = $("footnote-count");
  const progress = $("progress-fill");
  const phase = $("phase-label");
  const dialogue = $("dialogue");
  const characterStatus = $("character-status");
  const destinationLabel = $("destination-label");
  const footnote = $("footnote");
  const goNow = $("go-now");
  const stayHere = $("stay-here");

  let remaining = delay;
  let stopped = false;
  let timer = null;

  try {
    const parsed = new URL(destination);
    destinationLabel.textContent = config.destinationLabel || parsed.host;
  } catch {
    destinationLabel.textContent = config.destinationLabel || destination;
  }

  // Small CSS-only particle effects: no canvas, external libraries, or sound.
  const stars = $("stars");
  for (let i = 0; i < 42; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${12 + Math.random() * 84}%`;
    star.style.setProperty("--dur", `${5 + Math.random() * 7}s`);
    star.style.setProperty("--delay", `${-Math.random() * 12}s`);
    stars.appendChild(star);
  }
  const sparks = $("portal-sparks");
  for (let i = 0; i < 18; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.transform = `rotate(${i * 20}deg) translateY(${Math.round(10 + Math.random() * 12)}px)`;
    spark.style.opacity = `${0.35 + Math.random() * 0.65}`;
    sparks.appendChild(spark);
  }

  const phases = [
    { at: 0, title: "Gathering a little energy", status: "Preparing a route for you", line: "It's okay. Stay close — I'll open a path to the right place." },
    { at: 0.25, title: "Waking up the portal", status: "Charging the navigation portal", line: "Just a moment… I’m gathering enough energy to open the way." },
    { at: 0.55, title: "Stabilizing the route", status: "Stabilizing the destination", line: "Almost there! Keeping the path steady so you arrive safely." },
    { at: 0.82, title: "Opening the way", status: "Portal ready · route confirmed", line: "There! The path is open. Let’s get you where you meant to go." }
  ];

  function setPhase(fraction) {
    let selected = phases[0];
    for (const item of phases) if (fraction >= item.at) selected = item;
    phase.textContent = selected.title;
    characterStatus.textContent = selected.status;
    dialogue.textContent = selected.line;
  }

  function redirect() {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    scene.classList.add("is-redirecting");
    phase.textContent = "Sending you on your way";
    characterStatus.textContent = "Opening the path…";
    dialogue.textContent = "Safe travels! I'll be right here if you need me again.";
    footnote.textContent = "Opening your destination…";
    progress.style.width = "100%";
    if (autoRedirect) {
      window.setTimeout(() => {
        window.location.replace(destination);
      }, 650);
    } else {
      footnote.textContent = "Preview mode: automatic redirect is disabled in config.js.";
    }
  }

  function tick() {
    remaining -= 1;
    const elapsed = delay - remaining;
    const fraction = Math.min(1, elapsed / delay);
    countdown.textContent = Math.max(0, remaining);
    footnoteCount.textContent = Math.max(0, remaining);
    progress.style.width = `${fraction * 100}%`;
    setPhase(fraction);

    if (remaining <= 0) {
      redirect();
    }
  }

  goNow.addEventListener("click", redirect);
  stayHere.addEventListener("click", () => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    scene.classList.add("is-staying");
    phase.textContent = "Paused just for you";
    characterStatus.textContent = "Waiting patiently";
    dialogue.textContent = "No rush. You can stay here for a little while — I'll keep the path ready.";
    countdown.textContent = "—";
    footnote.textContent = "Automatic redirect paused. Choose “Take me there” whenever you're ready.";
    progress.style.width = `${Math.min(100, ((delay - remaining) / delay) * 100)}%`;
    stayHere.textContent = "Redirect paused";
    stayHere.disabled = true;
    stayHere.style.opacity = ".55";
  });

  // Honor reduced-motion preference and still keep all navigation controls usable.
  progress.style.width = "0%";
  countdown.textContent = delay;
  footnoteCount.textContent = delay;
  timer = window.setInterval(tick, 1000);
})();
