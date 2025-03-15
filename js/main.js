const playbtn = document.getElementById("playbtn");
const heart = document.getElementById("heart");
const audio = document.getElementById("audio");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTimeEl");
const durationEl = document.getElementById("durationEl");
const repeatBTN = document.getElementById("repeatBTN");
const downloedBTN = document.getElementById("downloedBTN");
const playList = document.getElementById("playList");
const musicCover = document.getElementById("musicCover");
const songName = document.getElementById("songName");
const singerName = document.getElementById("singerName");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const _favoriteSec = document.getElementsByClassName("favoriteSec");
const playListBtn = document.getElementsByClassName("playListBtn");
const inp = document.getElementById("inp");

let songs = [];
let history = [];
let currentSongId = null;
let favoriteSongs = [];
let clonedata;

fetch("https://67bef116b2320ee05012068c.mockapi.io/musicPlayer")
  .then((res) => res.json())
  .then((data) => {
    songs = data;
    clonedata = data;
    data.map((val) => {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.innerHTML = `
              <div class="w-full h-16 cursor-pointer overflow-hidden border-b-[1px] border-b-subtitle-color flex items-center justify-between px-2">
                    <div class="w-[300px] flex items-center lg:gap-4 gap-2 h-[50px]">
                        <figure class="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-blue-400 object-cover"><img class="w-full h-full object-cover" src="${val.avatar}" alt=""></figure>
                        <div class="h-full w-fit flex flex-col *:text-text-color">
                            <h2 class="font-bold text-[14px] lg:text-[16px]">${val.name}</h2>
                            <h4 class="text-[14px] lg:text-[16px]">${val.author}</h4>
                        </div>
                    </div>
                    <span class="text-text-color text-[13px] lg:text-[15px] ">${val.time}</span>
                </div>
                        

            `;
      playList.appendChild(div);

      div.addEventListener("click", () => {
        audio.src = val.url;
        musicCover.src = val.avatar;
        songName.textContent = val.name;
        singerName.textContent = val.author;
        history.push(val.id);
        currentSongId = val.id;

        const currentSongIdNumber = Number(currentSongId);

        if (favoriteSongs.includes(currentSongIdNumber)) {
          heart.classList.add("heartbg");
        } else {
          // اگر آهنگ در لیست نیست و ID تکراری نیست، به لیست اضافه کن
          if (!favoriteSongs.includes(currentSongIdNumber)) {
            heart.classList.remove("heartbg");
          }
        }

        // audio.play();
        if (audio.paused) {
          audio.play();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>  `;
        } else {
          audio.pause();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"></path></svg> `;
        }
      });
    });
  });

// let isPlaying = false;
let repeatMode = 0;

// get duration of song
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// play pause btn
playbtn.addEventListener("click", () => {
  // isPlaying = !isPlaying;
  if (audio.paused) {
    audio.play();
    playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>  `;
  } else {
    audio.pause();
    playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"></path></svg> `;
  }
});

// update progress bar
audio.addEventListener("timeupdate", () => {
  progressBar.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
// set progress bar
audio.addEventListener("loadedmetadata", () => {
  progressBar.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});
// change progress bar by click
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});
// repeat btn
repeatBTN.addEventListener("click", () => {
  const repIcon = document.getElementById("repIcon");
  repeatMode = (repeatMode + 1) % 2;
  if (repeatMode == 1) {
    repIcon.classList.add("active");
  } else {
    repIcon.classList.remove("active");
  }
});
// repeat song if repeat mode is on
audio.addEventListener("ended", () => {
  if (repeatMode == 1) {
    audio.currentTime = 0;
    audio.play();
  }
});

// download btn
downloedBTN.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = audio.src;
  a.download = audio.src;
  a.click();
});
function playSong(songId, fromHistory = false) {
  if (songs.length === 0) return; // اگر لیست خالی است، کاری نکن

  let song = songs.find((s) => s.id == songId);
  if (!song) return;

  // اگر آهنگ از تاریخچه پخش نمی‌شود، در تاریخچه ذخیره کن
  if (!fromHistory && currentSongId !== null) {
    history.push(currentSongId);
  }

  currentSongId = songId; // ذخیره آهنگ فعلی

  audio.src = song.url;
  musicCover.src = song.avatar;
  songName.textContent = song.name;
  singerName.textContent = song.author;

  if (favoriteSongs.includes(currentSongId)) {
    heart.classList.add("heartbg"); // اگر هست، دکمه قلب را روشن کن
  } else {
    heart.classList.remove("heartbg"); // اگر نیست، خاموش کن
  }

  audio.addEventListener("canplay", () => {
    audio.play();
  });
  playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>`;
}

// تابع برای انتخاب آهنگ تصادفی
function playRandomSong() {
  if (songs.length === 0) return;

  let randomId;
  do {
    randomId = Math.floor(Math.random() * 15) + 1; // عدد تصادفی بین ۱ تا ۱۵
  } while (randomId === currentSongId);

  playSong(randomId);
}

// دکمه بعدی (Next) → آهنگ تصادفی جدید
nextBtn.addEventListener("click", playRandomSong);

// دکمه قبلی (Prev) → آهنگ قبلی که پخش شده بود
prevBtn.addEventListener("click", () => {
  if (history.length > 0) {
    let lastSongId = history.pop();
    playSong(lastSongId, true);
  }
});
////        /////////////////////////////////////////////////            sections         //////////////////////////////////////////////////////// //////
//favorite section///
// heart btn
heart.addEventListener("click", () => {
  if (!currentSongId) return;

  const currentSongIdNumber = Number(currentSongId);

  if (favoriteSongs.includes(currentSongIdNumber)) {
    // اگر آهنگ در لیست علاقه‌مندی‌ها است، از لیست حذف کن
    favoriteSongs = favoriteSongs.filter((id) => id !== currentSongIdNumber);
    heart.classList.remove("heartbg");
  } else {
    // اگر آهنگ در لیست نیست و ID تکراری نیست، به لیست اضافه کن
    if (!favoriteSongs.includes(currentSongIdNumber)) {
      favoriteSongs.push(currentSongIdNumber);
      heart.classList.add("heartbg");
    }
  }
  console.log(favoriteSongs);
  updateFavoriteList();
  saveFavorites();
  // localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
});

// /////////////////////////////////
function updateFavoriteList() {
  showFavorites.classList.add("dd");
  playListBtn[0].classList.remove("dd");

  playList.innerHTML = "";
  favoriteSongs.forEach((songId) => {
    let song = songs.find((s) => s.id == songId);
    if (song) {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.innerHTML = `
              <div class="w-full h-16 cursor-pointer overflow-hidden border-b-[1px] border-b-subtitle-color flex items-center justify-between px-2">
                    <div class="w-[300px] flex items-center lg:gap-4 gap-2 h-[50px]">
                        <figure class="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-blue-400 object-cover"><img class="w-full h-full object-cover" src="${song.avatar}" alt=""></figure>
                        <div class="h-full w-fit flex flex-col *:text-text-color">
                            <h2 class="font-bold text-[14px] lg:text-[16px]">${song.name}</h2>
                            <h4 class="text-[14px] lg:text-[16px]">${song.author}</h4>
                        </div>
                    </div>
                    <span class="text-text-color text-[13px] lg:text-[15px] ">${song.time}</span>
                </div>

            `;
      playList.appendChild(div);

      div.addEventListener("click", () => {
        audio.src = song.url;
        musicCover.src = song.avatar;
        songName.textContent = song.name;
        singerName.textContent = song.author;
        history.push(song.id);
        currentSongId = song.id;
        console.log(currentSongId);
        heart.classList.add("heartbg"); // اگر هست، قلب قرمز شود
        updateFavoriteList();
        // audio.play();
        if (audio.paused) {
          audio.play();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>  `;
        } else {
          audio.pause();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"></path></svg> `;
        }
      });
      playList.appendChild(div);
    }
  });
}
// ///////////////////////////////
let showFavorites = document.getElementById("showFavorites");
showFavorites.addEventListener("click", () => {
  showFavorites.classList.add("dd");
  updateFavoriteList();
});
////////////////////////////////////////////////////////////////////PLAYLIST/////////////////////////
playListBtn[0].addEventListener("click", () => {
  showFavorites.classList.remove("dd");
  playListBtn[0].classList.add("dd");

  playList.innerHTML = "";
  clonedata.map((val) => {
    const div = document.createElement("div");
    div.style.width = "100%";
    div.innerHTML = `
                  <div class="w-full h-16 cursor-pointer overflow-hidden border-b-[1px] border-b-subtitle-color flex items-center justify-between px-2">
                    <div class="w-[300px] flex items-center lg:gap-4 gap-2 h-[50px]">
                        <figure class="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-blue-400 object-cover"><img class="w-full h-full object-cover" src="${val.avatar}" alt=""></figure>
                        <div class="h-full w-fit flex flex-col *:text-text-color">
                            <h2 class="font-bold text-[14px] lg:text-[16px]">${val.name}</h2>
                            <h4 class="text-[14px] lg:text-[16px]">${val.author}</h4>
                        </div>
                    </div>
                    <span class="text-text-color text-[13px] lg:text-[15px] ">${val.time}</span>
                </div>

                `;
    playList.appendChild(div);

    div.addEventListener("click", () => {
      audio.src = val.url;
      musicCover.src = val.avatar;
      songName.textContent = val.name;
      singerName.textContent = val.author;
      history.push(val.id);
      currentSongId = val.id;
      const currentSongIdNumber = Number(currentSongId);

      if (favoriteSongs.includes(currentSongIdNumber)) {
        heart.classList.add("heartbg");
      } else {
        // اگر آهنگ در لیست نیست و ID تکراری نیست، به لیست اضافه کن
        if (!favoriteSongs.includes(currentSongIdNumber)) {
          heart.classList.remove("heartbg");
        }
      }

      // audio.play();
      if (audio.paused) {
        audio.play();
        playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>  `;
      } else {
        audio.pause();
        playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"></path></svg> `;
      }
    });
  });
});

////////    search bar     ///////
inp.addEventListener("keyup", () => {
  let query = inp.value.toLowerCase().trim();

  playList.innerHTML = "";

  clonedata.forEach((val) => {
    let name = val.name.toLowerCase();
    let singer = val.author.toLowerCase();

    if (name.includes(query) || singer.includes(query)) {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.innerHTML = `
                 <div class="w-full h-16 cursor-pointer overflow-hidden border-b-[1px] border-b-subtitle-color flex items-center justify-between px-2">
                    <div class="w-[300px] flex items-center lg:gap-4 gap-2 h-[50px]">
                        <figure class="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-blue-400 object-cover"><img class="w-full h-full object-cover" src="${val.avatar}" alt=""></figure>
                        <div class="h-full w-fit flex flex-col *:text-text-color">
                            <h2 class="font-bold text-[14px] lg:text-[16px]">${val.name}</h2>
                            <h4 class="text-[14px] lg:text-[16px]">${val.author}</h4>
                        </div>
                    </div>
                    <span class="text-text-color text-[13px] lg:text-[15px] ">${val.time}</span>
                </div>
            `;

      playList.appendChild(div);

      // کلیک روی آهنگ برای پخش
      div.addEventListener("click", () => {
        audio.src = val.url;
        musicCover.src = val.avatar;
        songName.textContent = val.name;
        singerName.textContent = val.author;
        history.push(val.id);

        if (audio.paused) {
          audio.play();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>`;
        } else {
          audio.pause();
          playbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"></path></svg>`;
        }
      });
    }
  });
});

//////   local storage   ////////
function saveFavorites() {
  localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
}

function loadFavorites() {
  const savedFavorites = localStorage.getItem("favoriteSongs");
  if (savedFavorites) {
    favoriteSongs = JSON.parse(savedFavorites);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
});
