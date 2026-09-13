const tracks = [
  {
    title: "Дом в движении",
    act: "I · Дом и первая утрата",
    scene: "На Сия поправляет рубаху восьмилетнего Влада; рядом остаются тихие следы его механизма.",
    duration: "2:59",
  },
  {
    title: "Она ушла первой",
    act: "I · Дом и первая утрата",
    scene: "На Сия крепко обнимает Влада перед отъездом; дорога уже ждёт за её спиной.",
    duration: "2:39",
  },
  {
    title: "Три ноты",
    act: "I · Дом и первая утрата",
    scene: "Влад один у озера с кривой детской флейтой; по воде расходятся три круга.",
    duration: "2:19",
  },
  {
    title: "Красная черта",
    act: "II · Черта, нарушение и цена",
    scene: "Влад ещё на безопасной стороне границы и смотрит туда, куда идти запрещено.",
    duration: "2:38",
  },
  {
    title: "За чертой",
    act: "II · Черта, нарушение и цена",
    scene: "Одна нога уже переступила натянутую границу; решение стало поступком.",
    duration: "2:59",
  },
  {
    title: "Неси",
    act: "II · Черта, нарушение и цена",
    scene: "Влад тянет Хэ Жуна на самодельной волокуше, а раненый Ло освобождает дорогу.",
    duration: "2:59",
  },
  {
    title: "Незамкнутый круг",
    act: "III · Новая жизнь и дружба",
    scene: "Влад впервые видит рабочие террасы Дома незамкнутого круга.",
    duration: "3:00",
  },
  {
    title: "Письмо домой",
    act: "III · Новая жизнь и дружба",
    scene: "Кисть замерла над листом; между правдой и попыткой успокоить семью остаётся пустое место.",
    duration: "3:13",
  },
  {
    title: "Густая грива",
    act: "III · Новая жизнь и дружба",
    scene: "Чэнь изучает неожиданно отросшие волосы, пока друзья виновато замирают с ложками.",
    duration: "2:57",
  },
  {
    title: "На крыше",
    act: "III · Новая жизнь и дружба",
    scene: "Четверо друзей сидят на черепице; между ними — письмо отца и закрытая коробка лотоса.",
    duration: "3:02",
  },
  {
    title: "Третий водосброс",
    act: "IV · Водосброс и взросление",
    scene: "На двадцатом вдохе Чэнь разбивает рабочую якорную метку и обрывает опасную связь.",
    duration: "4:09",
  },
  {
    title: "Я тоже",
    act: "IV · Водосброс и взросление",
    scene: "Влад поворачивает онемевшую ладонь вверх; Чэнь признаётся, что тоже сомневался в счёте.",
    duration: "3:08",
  },
  {
    title: "Сначала позвать мастера",
    act: "IV · Водосброс и взросление",
    scene: "Пальцы Влада останавливаются над отвёрткой до прикосновения к ней.",
    duration: "2:54",
  },
  {
    title: "Когда молчит Небо",
    act: "IV · Водосброс и взросление",
    scene: "Влад с пустыми руками переступает порог мастерской и идёт искать мастера.",
    duration: "2:50",
  },
].map((track, index) => ({
  ...track,
  number: String(index + 1).padStart(2, "0"),
  cover: `./assets/covers/${String(index + 1).padStart(2, "0")}.webp`,
  audio: `./assets/audio/${String(index + 1).padStart(2, "0")}.mp3`,
}));

const audio = document.querySelector("#audio");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const progress = document.querySelector("#progress");
const volume = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const activeCover = document.querySelector("#activeCover");
const activeNumber = document.querySelector("#activeNumber");
const activeAct = document.querySelector("#activeAct");
const activeTitle = document.querySelector("#activeTitle");
const activeScene = document.querySelector("#activeScene");
const trackPosition = document.querySelector("#trackPosition");
const trackGrid = document.querySelector("#trackGrid");

let activeIndex = 0;

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function renderTracks() {
  trackGrid.innerHTML = tracks
    .map(
      (track, index) => `
        <li>
          <button class="track-card${index === activeIndex ? " is-active" : ""}" type="button" data-index="${index}" aria-label="Воспроизвести: ${track.title}">
            <img src="${track.cover}" alt="" width="180" height="180" loading="lazy" />
            <span class="track-copy">
              <span class="track-meta">${track.number} · ${track.act.split(" · ")[0]}</span>
              <span class="track-title">${track.title}</span>
              <span class="track-duration" data-duration-index="${index}">${track.duration}</span>
            </span>
            <span class="card-action" aria-hidden="true">
              <svg class="play-card" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z" /></svg>
              <svg class="pause-card" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM14 5h4v14h-4z" /></svg>
            </span>
          </button>
        </li>
      `,
    )
    .join("");
}

function updateCards() {
  document.querySelectorAll(".track-card").forEach((card, index) => {
    const selected = index === activeIndex;
    card.classList.toggle("is-active", selected);
    card.classList.toggle("is-playing", selected && !audio.paused);
    card.setAttribute("aria-label", `${selected && !audio.paused ? "Пауза" : "Воспроизвести"}: ${tracks[index].title}`);
  });
}

function loadTrack(index, shouldPlay = false) {
  activeIndex = (index + tracks.length) % tracks.length;
  const track = tracks[activeIndex];

  audio.src = track.audio;
  activeCover.src = track.cover;
  activeCover.alt = `Снимок вечности к композиции «${track.title}»`;
  activeNumber.textContent = track.number;
  activeAct.textContent = track.act;
  activeTitle.textContent = track.title;
  activeScene.textContent = track.scene;
  trackPosition.textContent = String(activeIndex + 1);
  currentTime.textContent = "0:00";
  duration.textContent = track.duration === "—" ? "0:00" : track.duration;
  progress.value = "0";
  progress.style.setProperty("--range-fill", "0%");
  updateCards();

  if (shouldPlay) {
    audio.play().catch(() => setPlayingState(false));
  }
}

function setPlayingState(isPlaying) {
  document.body.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Пауза" : "Воспроизвести");
  updateCards();
}

function togglePlay() {
  if (!audio.src) loadTrack(activeIndex);
  if (audio.paused) {
    audio.play().catch(() => setPlayingState(false));
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", togglePlay);
prevButton.addEventListener("click", () => loadTrack(activeIndex - 1, true));
nextButton.addEventListener("click", () => loadTrack(activeIndex + 1, true));

trackGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".track-card");
  if (!card) return;
  const index = Number(card.dataset.index);
  if (index === activeIndex) {
    togglePlay();
  } else {
    loadTrack(index, true);
    document.querySelector("#player").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

audio.addEventListener("play", () => setPlayingState(true));
audio.addEventListener("pause", () => setPlayingState(false));
audio.addEventListener("ended", () => loadTrack(activeIndex + 1, true));

audio.addEventListener("loadedmetadata", () => {
  const value = formatTime(audio.duration);
  duration.textContent = value;
  tracks[activeIndex].duration = value;
  const durationNode = document.querySelector(`[data-duration-index="${activeIndex}"]`);
  if (durationNode) durationNode.textContent = value;
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
  progress.value = String(Math.round(ratio * 1000));
  progress.style.setProperty("--range-fill", `${ratio * 100}%`);
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  volume.style.setProperty("--range-fill", `${Number(volume.value) * 100}%`);
});

renderTracks();
audio.volume = Number(volume.value);
volume.style.setProperty("--range-fill", `${Number(volume.value) * 100}%`);
loadTrack(0);
