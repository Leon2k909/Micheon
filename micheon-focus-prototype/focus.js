(() => {
  const sentence = "Korrigier mich bitte, wenn ich Fehler mache.";
  const stages = [
    "Hear it",
    "Read it",
    "Shadow it",
    "Recall the meaning",
    "Build from memory",
    "Translate it",
    "Say it",
    "Master it",
  ];

  const normalize = (value) => value
    .toLocaleLowerCase("de-DE")
    .replace(/[.,!?;:'“”„\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const stageButtons = [...document.querySelectorAll(".stage-button")];
  const stageCount = document.getElementById("stageCount");
  const stageLabel = document.getElementById("stageLabel");
  const stageFill = document.getElementById("stageFill");
  const sentenceViewport = document.getElementById("sentenceViewport");
  const sentenceLine = document.getElementById("sentenceLine");
  const sentenceBoard = document.getElementById("sentenceBoard");
  const wordButtons = [...document.querySelectorAll(".word")];
  const listenButton = document.getElementById("listenButton");
  const form = document.getElementById("answerForm");
  const input = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const feedbackText = document.getElementById("feedbackText");
  const coachButton = document.getElementById("coachButton");
  const coachCard = document.getElementById("coachCard");
  const coachClose = document.getElementById("coachClose");

  let activeStage = 5;

  const updateStage = (nextStage) => {
    activeStage = Math.max(1, Math.min(8, nextStage));
    stageButtons.forEach((button) => {
      const value = Number(button.dataset.stage);
      button.classList.toggle("is-active", value === activeStage);
      button.classList.toggle("is-done", value < activeStage);
      if (value === activeStage) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    stageCount.textContent = `Stage ${activeStage} of 8`;
    stageLabel.textContent = stages[activeStage - 1];
    stageFill.style.width = `${((activeStage - 1) / 7) * 100}%`;
  };

  const fitSentence = () => {
    if (!sentenceViewport || !sentenceLine || window.innerWidth <= 760) return;
    const available = sentenceViewport.clientWidth - 64;
    let size = Math.min(58, Math.max(34, available / 19));
    sentenceLine.style.fontSize = `${size}px`;

    let guard = 0;
    while (sentenceLine.scrollWidth > available && size > 30 && guard < 60) {
      size -= 1;
      sentenceLine.style.fontSize = `${size}px`;
      guard += 1;
    }

    while (sentenceLine.scrollWidth < available * 0.84 && size < 58 && guard < 90) {
      size += 1;
      sentenceLine.style.fontSize = `${size}px`;
      if (sentenceLine.scrollWidth > available) {
        size -= 1;
        sentenceLine.style.fontSize = `${size}px`;
        break;
      }
      guard += 1;
    }
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.84;
    listenButton.classList.add("is-speaking");
    utterance.onend = () => listenButton.classList.remove("is-speaking");
    utterance.onerror = () => listenButton.classList.remove("is-speaking");
    window.speechSynthesis.speak(utterance);
  };

  const updateWordMatch = () => {
    const typedWords = normalize(input.value).split(" ").filter(Boolean);
    const expectedWords = normalize(sentence).split(" ");
    wordButtons.forEach((button, index) => {
      const touched = typedWords.length > index;
      const matched = touched && typedWords[index] === expectedWords[index];
      button.classList.toggle("is-matched", Boolean(matched));
      button.classList.toggle("is-dimmed", Boolean(touched && !matched));
      button.classList.remove("is-correct", "is-error");
    });
    form.classList.remove("is-correct", "is-error");
    feedback.classList.remove("is-correct", "is-error");
    feedback.querySelector(".feedback__icon").textContent = "↵";
    feedbackText.textContent = "Press Enter when you are ready.";
  };

  stageButtons.forEach((button) => button.addEventListener("click", () => updateStage(Number(button.dataset.stage))));
  listenButton.addEventListener("click", () => speak(sentence));
  wordButtons.forEach((button) => button.addEventListener("click", () => speak(button.dataset.word)));
  input.addEventListener("input", updateWordMatch);

  document.querySelectorAll("[data-char]").forEach((button) => {
    button.addEventListener("click", () => {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      input.value = `${input.value.slice(0, start)}${button.dataset.char}${input.value.slice(end)}`;
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
      updateWordMatch();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const correct = normalize(input.value) === normalize(sentence);
    form.classList.remove("is-correct", "is-error");
    feedback.classList.remove("is-correct", "is-error");
    wordButtons.forEach((button) => button.classList.remove("is-correct", "is-error"));
    void form.offsetWidth;

    if (correct) {
      form.classList.add("is-correct");
      feedback.classList.add("is-correct");
      feedback.querySelector(".feedback__icon").textContent = "✓";
      feedbackText.textContent = "Perfect — that sentence is locked in.";
      wordButtons.forEach((button, index) => setTimeout(() => button.classList.add("is-correct"), index * 55));
      if (activeStage < 8) setTimeout(() => updateStage(activeStage + 1), 720);
    } else {
      form.classList.add("is-error");
      feedback.classList.add("is-error");
      feedback.querySelector(".feedback__icon").textContent = "!";
      feedbackText.textContent = "Almost — compare the word order and try again.";
      wordButtons.forEach((button) => button.classList.add("is-error"));
    }
  });

  const setCoach = (open) => {
    coachCard.classList.toggle("is-open", open);
    coachCard.setAttribute("aria-hidden", String(!open));
  };

  coachButton.addEventListener("click", () => setCoach(true));
  coachClose.addEventListener("click", () => setCoach(false));

  sentenceBoard.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = sentenceBoard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    sentenceBoard.style.transform = `perspective(1200px) rotateX(${y * -1.1}deg) rotateY(${x * 1.5}deg)`;
  });

  sentenceBoard.addEventListener("pointerleave", () => {
    sentenceBoard.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && document.activeElement !== input) {
      event.preventDefault();
      speak(sentence);
    }
    if (event.key === "Escape") setCoach(false);
  });

  if ("ResizeObserver" in window) new ResizeObserver(fitSentence).observe(sentenceViewport);
  window.addEventListener("resize", fitSentence);

  updateStage(activeStage);
  requestAnimationFrame(() => {
    fitSentence();
    input.focus({ preventScroll: true });
  });
})();
