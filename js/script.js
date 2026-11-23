/**
 * ============================================================================
 * JAVASCRIPT UTAMA - UNDANGAN DIGITAL BERBASIS BOOTSTRAP 5 & SUPABASE
 * Fitur:
 * 1. Supabase Client & Real-time Synchronization (dengan fallback localStorage)
 * 2. Dynamic Guest Name via Database Query (?code=...) atau URL Parameter (?to=...)
 * 3. Pemutar Musik Kustom (Playlist, Ganti Lagu, Input URL / Upload Audio)
 * 4. Transisi Buka Sampul Undangan & Autoplay Musik
 * 5. Countdown Timer Real-time (Hari, Jam, Menit, Detik)
 * 6. Integrasi Google Calendar
 * 7. Copy to Clipboard dengan Bootstrap 5 Toast
 * 8. Galeri Foto Modal Lightbox
 * 9. Form RSVP & Buku Tamu Real-time
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  // --------------------------------------------------------------------------
  // 1. INISIALISASI ANIMASI AOS (ANIMATE ON SCROLL)
  // --------------------------------------------------------------------------
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }

  // --------------------------------------------------------------------------
  // 2. INISIALISASI SUPABASE DATABASE
  // --------------------------------------------------------------------------
  let supabaseClient = null;
  let isSupabaseActive = false;
  const dbStatusBadge = document.getElementById("dbStatusBadge");

  function initSupabase() {
    const config = APP_CONFIG.supabase;
    // Cek apakah library supabase dan konfigurasi telah diatur dengan benar
    if (
      config.enabled &&
      window.supabase &&
      config.url &&
      !config.url.includes("xyzcompany.supabase.co") &&
      config.anonKey &&
      !config.anonKey.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    ) {
      try {
        supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        isSupabaseActive = true;
        if (dbStatusBadge) {
          dbStatusBadge.innerHTML = `<i class="bi bi-cloud-check-fill text-success"></i> Supabase Connected`;
          dbStatusBadge.className = "db-status-pill bg-white shadow-sm border border-success text-success";
        }
        console.log("Supabase Client berhasil terhubung!");
      } catch (err) {
        console.warn("Gagal inisialisasi Supabase, beralih ke mode offline (localStorage):", err);
        fallbackToLocalStorage();
      }
    } else {
      fallbackToLocalStorage();
    }
  }

  function fallbackToLocalStorage() {
    isSupabaseActive = false;
    if (dbStatusBadge) {
      dbStatusBadge.innerHTML = `<i class="bi bi-hdd-fill text-secondary"></i> Storage: LocalStorage`;
      dbStatusBadge.className = "db-status-pill bg-white shadow-sm border text-secondary";
    }
    console.log("Mode Database: LocalStorage aktif (Isi js/config.js untuk mengaktifkan cloud Supabase).");
  }

  initSupabase();

  // --------------------------------------------------------------------------
  // 3. FITUR 1: NAMA TAMU DINAMIS (SUPABASE & PARAMETER URL)
  // --------------------------------------------------------------------------
  const guestNameElement = document.getElementById("guestName");
  const rsvpNameInput = document.getElementById("rsvpName");

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  async function resolveGuestName() {
    const codeParam = getQueryParam("code") || getQueryParam("id");
    const toParam = getQueryParam("to");

    // Opsi A: Jika ada parameter kode unik (?code=TAMU01) dan Supabase aktif
    if (codeParam && isSupabaseActive) {
      try {
        const { data, error } = await supabaseClient
          .from(APP_CONFIG.supabase.tables.guests)
          .select("name, quota")
          .eq("code", codeParam)
          .single();

        if (data && data.name) {
          setGuestName(data.name);
          return;
        }
      } catch (err) {
        console.warn("Gagal mengambil tamu dari Supabase:", err);
      }
    }

    // Opsi B: Membaca parameter langsung (?to=Nama+Tamu)
    if (toParam) {
      const cleanName = decodeURIComponent(toParam.replace(/\+/g, " "));
      setGuestName(cleanName);
      return;
    }

    // Opsi C: Default
    setGuestName("Tamu Undangan");
  }

  function setGuestName(name) {
    if (guestNameElement) guestNameElement.textContent = name;
    if (rsvpNameInput) rsvpNameInput.value = name;
  }

  await resolveGuestName();

  // --------------------------------------------------------------------------
  // 4. FITUR 6 & KUSTOMISASI: PEMUTAR MUSIK & PLAYLIST MANAGER
  // --------------------------------------------------------------------------
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicTitleEl = document.getElementById("musicCurrentTitle");
  const musicModalEl = document.getElementById("musicCustomModal");
  const playlistContainer = document.getElementById("playlistContainer");
  const customAudioUrlInput = document.getElementById("customAudioUrl");
  const btnApplyCustomUrl = document.getElementById("btnApplyCustomUrl");
  const audioFileInput = document.getElementById("audioFileInput");

  let isPlaying = false;
  let currentSongIndex = APP_CONFIG.music.defaultIndex || 0;
  let musicModal = null;

  if (musicModalEl && typeof bootstrap !== "undefined") {
    musicModal = new bootstrap.Modal(musicModalEl);
  }

  // Load lagu berdasarkan index playlist
  function loadSong(index) {
    const playlist = APP_CONFIG.music.playlist;
    if (!playlist || playlist.length === 0) return;

    if (index >= playlist.length) index = 0;
    currentSongIndex = index;
    const song = playlist[currentSongIndex];

    if (bgMusic) {
      bgMusic.src = song.src;
      bgMusic.load();
    }
    if (musicTitleEl) {
      musicTitleEl.textContent = `${song.title} - ${song.artist}`;
    }
    renderPlaylistUI();
  }

  // Putar Audio
  function playAudio() {
    if (!bgMusic) return;
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        if (musicIcon) {
          musicIcon.classList.remove("bi-music-note-slash");
          musicIcon.classList.add("bi-disc", "spinning");
        }
      })
      .catch((err) => {
        console.warn("Autoplay diblokir oleh browser sebelum ada interaksi:", err);
      });
  }

  // Jeda Audio
  function pauseAudio() {
    if (!bgMusic) return;
    bgMusic.pause();
    isPlaying = false;
    if (musicIcon) {
      musicIcon.classList.remove("bi-disc", "spinning");
      musicIcon.classList.add("bi-music-note-slash");
    }
  }

  // Toggle Play / Pause
  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // Render Daftar Playlist di dalam Modal Kustomisasi
  function renderPlaylistUI() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = "";
    APP_CONFIG.music.playlist.forEach((song, idx) => {
      const isActive = idx === currentSongIndex;
      const item = document.createElement("div");
      item.className = `list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-3 ${
        isActive ? "active bg-gold border-0" : ""
      }`;
      item.style.cursor = "pointer";
      item.innerHTML = `
        <div>
          <div class="fw-bold small">${escapeHtml(song.title)}</div>
          <small class="${isActive ? "text-white-50" : "text-muted"}">${escapeHtml(song.artist)}</small>
        </div>
        <div>
          ${isActive ? '<i class="bi bi-volume-up-fill fs-5"></i>' : '<i class="bi bi-play-circle fs-5"></i>'}
        </div>
      `;
      item.addEventListener("click", () => {
        loadSong(idx);
        playAudio();
      });
      playlistContainer.appendChild(item);
    });
  }

  // Handle Input Custom Audio URL
  if (btnApplyCustomUrl && customAudioUrlInput) {
    btnApplyCustomUrl.addEventListener("click", () => {
      const url = customAudioUrlInput.value.trim();
      if (!url) {
        alert("Silakan masukkan URL file audio MP3 yang valid.");
        return;
      }
      // Tambahkan ke playlist sementara
      const customSong = {
        id: `custom-${Date.now()}`,
        title: "Lagu Kustom Pilihan Anda",
        artist: "Custom Audio URL",
        src: url,
      };
      APP_CONFIG.music.playlist.push(customSong);
      loadSong(APP_CONFIG.music.playlist.length - 1);
      playAudio();
      customAudioUrlInput.value = "";
      if (musicModal) musicModal.hide();
    });
  }

  // Handle Upload File Audio Lokal dari Browser
  if (audioFileInput) {
    audioFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        const uploadedSong = {
          id: `local-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "File Lokal dari Perangkat",
          src: objectUrl,
        };
        APP_CONFIG.music.playlist.push(uploadedSong);
        loadSong(APP_CONFIG.music.playlist.length - 1);
        playAudio();
        if (musicModal) musicModal.hide();
      }
    });
  }

  // Muat lagu default awal
  loadSong(currentSongIndex);

  // --------------------------------------------------------------------------
  // 5. FITUR 1: BUKA SAMPUL UNDANGAN (HERO COVER UNLOCK)
  // --------------------------------------------------------------------------
  const heroCover = document.getElementById("heroCover");
  const btnOpen = document.getElementById("btnOpen");

  if (btnOpen && heroCover) {
    btnOpen.addEventListener("click", () => {
      heroCover.classList.add("unlocked");
      document.body.classList.remove("locked");
      if (APP_CONFIG.music.autoplay) {
        playAudio();
      }
      setTimeout(() => {
        if (typeof AOS !== "undefined") AOS.refresh();
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // 6. FITUR 2: COUNTDOWN TIMER REAL-TIME
  // --------------------------------------------------------------------------
  const targetDate = new Date(APP_CONFIG.event.targetDate).getTime();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? `0${days}` : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
    if (minutesEl) minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
    if (secondsEl) secondsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 7. FITUR 2: SIMPAN KE GOOGLE CALENDAR
  // --------------------------------------------------------------------------
  const btnSaveCalendar = document.getElementById("btnSaveCalendar");
  if (btnSaveCalendar) {
    btnSaveCalendar.addEventListener("click", () => {
      const title = encodeURIComponent(
        `The Wedding of ${APP_CONFIG.event.groom.nickname} & ${APP_CONFIG.event.bride.nickname}`
      );
      const details = encodeURIComponent(
        "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir pada acara pernikahan kami."
      );
      const location = encodeURIComponent(APP_CONFIG.event.schedule[0].venue);
      const startDate = "20261231T020000Z";
      const endDate = "20261231T070000Z";

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(gcalUrl, "_blank");
    });
  }

  // --------------------------------------------------------------------------
  // 8. FITUR 3: SALIN NOMOR REKENING / ALAMAT KADO (COPY TO CLIPBOARD)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll(".btn-copy");
  const copyToastEl = document.getElementById("copyToast");
  const toastMessageEl = document.getElementById("toastMessage");
  let copyToast = null;

  if (copyToastEl && typeof bootstrap !== "undefined") {
    copyToast = new bootstrap.Toast(copyToastEl, { delay: 2500 });
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            if (toastMessageEl) {
              toastMessageEl.textContent = `"${textToCopy}" berhasil disalin ke clipboard!`;
            }
            if (copyToast) copyToast.show();
          })
          .catch((err) => {
            console.error("Gagal menyalin ke clipboard:", err);
          });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. FITUR 4: GALERI LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll(".gallery-img-wrapper");
  const modalGalleryImg = document.getElementById("modalGalleryImg");
  const galleryModalEl = document.getElementById("galleryModal");
  let galleryModal = null;

  if (galleryModalEl && typeof bootstrap !== "undefined") {
    galleryModal = new bootstrap.Modal(galleryModalEl);
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && modalGalleryImg && galleryModal) {
        modalGalleryImg.src = img.src;
        galleryModal.show();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. FITUR 5: RSVP & BUKU TAMU (SUPABASE DENGAN FALLBACK LOCALSTORAGE)
  // --------------------------------------------------------------------------
  const rsvpForm = document.getElementById("rsvpForm");
  const wishesList = document.getElementById("wishesList");
  const STORAGE_KEY = "wedding_rsvp_wishes_backup";

  // Data Ucapan Awal Default
  const defaultWishes = [
    {
      guest_name: "Budi Santoso",
      status: "Hadir",
      guest_count: "2 Orang",
      message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah.",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      guest_name: "Siti Rahmawati",
      status: "Hadir",
      guest_count: "1 Orang",
      message: "Happy wedding! Lancar sampai hari H ya, doa terbaik untuk kalian berdua.",
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      guest_name: "Andi Wijaya",
      status: "Tidak Hadir",
      guest_count: "-",
      message: "Mohon maaf belum bisa hadir secara langsung karena tugas di luar kota. Selamat berbahagia!",
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ];

  // Mengambil daftar ucapan
  async function fetchWishes() {
    if (isSupabaseActive) {
      try {
        const { data, error } = await supabaseClient
          .from(APP_CONFIG.supabase.tables.rsvps)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("Gagal memuat dari Supabase, beralih ke local storage:", err);
      }
    }

    // Fallback LocalStorage
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    try {
      return JSON.parse(localData);
    } catch (e) {
      return defaultWishes;
    }
  }

  // Render Daftar Ucapan ke DOM
  async function loadAndRenderWishes() {
    if (!wishesList) return;
    const wishes = await fetchWishes();
    wishesList.innerHTML = "";

    if (wishes.length === 0) {
      wishesList.innerHTML = `<p class="text-muted text-center py-3">Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan!</p>`;
      return;
    }

    wishes.forEach((item) => {
      appendWishItemToDOM(item);
    });
  }

  function appendWishItemToDOM(item, prepend = false) {
    if (!wishesList) return;
    const initial = (item.guest_name || "T").charAt(0).toUpperCase();
    const isAttending = item.status === "Hadir";
    const badgeClass = isAttending
      ? "bg-success"
      : item.status === "Tidak Hadir"
      ? "bg-danger"
      : "bg-warning text-dark";

    let dateText = "Baru saja";
    if (item.created_at) {
      try {
        const d = new Date(item.created_at);
        dateText = d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {}
    }

    const itemHtml = `
      <div class="wish-item" data-aos="fade-up">
        <div class="d-flex align-items-center mb-2">
          <div class="wish-avatar me-2">${initial}</div>
          <div class="flex-grow-1">
            <h6 class="mb-0 fw-bold">${escapeHtml(item.guest_name || "Tamu")}</h6>
            <div class="d-flex align-items-center gap-2 mt-1">
              <span class="badge ${badgeClass}" style="font-size: 0.7rem;">${escapeHtml(item.status || "Hadir")}</span>
              ${
                item.guest_count && item.guest_count !== "-"
                  ? `<small class="text-muted" style="font-size: 0.75rem;"><i class="bi bi-people-fill me-1"></i>${escapeHtml(
                      item.guest_count
                    )}</small>`
                  : ""
              }
            </div>
          </div>
          <small class="text-muted" style="font-size: 0.72rem;">${escapeHtml(dateText)}</small>
        </div>
        <p class="mb-0 text-secondary" style="font-size: 0.88rem; line-height: 1.45;">${escapeHtml(
          item.message || ""
        )}</p>
      </div>
    `;

    if (prepend) {
      wishesList.insertAdjacentHTML("afterbegin", itemHtml);
    } else {
      wishesList.insertAdjacentHTML("beforeend", itemHtml);
    }
  }

  // Handle Form Submit (RSVP & Buku Tamu)
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("rsvpName").value.trim();
      const status = document.getElementById("rsvpStatus").value;
      const guests = document.getElementById("rsvpGuests")
        ? document.getElementById("rsvpGuests").value
        : "1 Orang";
      const message = document.getElementById("rsvpMessage").value.trim();
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');

      if (!name || !status || !message) {
        alert("Harap lengkapi semua kolom RSVP dan ucapan.");
        return;
      }

      const newWish = {
        guest_name: name,
        status: status,
        guest_count: status === "Hadir" ? guests : "-",
        message: message,
        created_at: new Date().toISOString(),
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Mengirim...`;
      }

      let saveSuccess = false;

      // 1. Kirim ke Supabase jika aktif
      if (isSupabaseActive) {
        try {
          const { error } = await supabaseClient
            .from(APP_CONFIG.supabase.tables.rsvps)
            .insert([
              {
                guest_name: newWish.guest_name,
                status: newWish.status,
                guest_count: newWish.guest_count,
                message: newWish.message,
              },
            ]);
          if (!error) {
            saveSuccess = true;
          } else {
            console.warn("Gagal simpan ke Supabase, fallback ke localStorage:", error);
          }
        } catch (err) {
          console.warn("Error jaringan Supabase:", err);
        }
      }

      // 2. Fallback / Cadangan ke localStorage
      if (!saveSuccess) {
        const localWishes = await fetchWishes();
        localWishes.unshift(newWish);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localWishes));
      }

      // 3. Tampilkan langsung di DOM
      appendWishItemToDOM(newWish, true);

      // Reset Form ucapan
      document.getElementById("rsvpMessage").value = "";

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="bi bi-send-fill me-1"></i> Kirim Konfirmasi`;
      }

      // Notifikasi Toast
      if (toastMessageEl && copyToast) {
        toastMessageEl.textContent = "Terima kasih! Konfirmasi dan doa restu Anda berhasil terkirim.";
        copyToast.show();
      }
    });
  }

  // Aktifkan Supabase Realtime Listener (Jika Supabase aktif)
  if (isSupabaseActive) {
    try {
      supabaseClient
        .channel("public:rsvps")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: APP_CONFIG.supabase.tables.rsvps },
          (payload) => {
            // Hindari duplikasi jika ucapan baru dari browser sendiri
            const existing = document.querySelector(".wishes-container");
            if (payload.new && existing) {
              appendWishItemToDOM(payload.new, true);
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Supabase Realtime subscription error:", err);
    }
  }

  // Muat ucapan pertama kali
  await loadAndRenderWishes();

  // Helper Escape HTML Sanitizer
  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
