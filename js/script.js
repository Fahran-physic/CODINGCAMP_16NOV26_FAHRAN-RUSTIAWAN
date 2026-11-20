/* ============================================================
   TO-DO LIST LIFE DASHBOARD — script.js
   Tahap 3: Jam real-time & greeting
   ============================================================ */

/* ============================================================
   1. AMBIL ELEMEN DARI HTML
   document.getElementById mencari elemen berdasarkan ID.
   Kita simpan di variabel agar bisa dipakai berulang tanpa
   mencari lagi setiap detik.
   ============================================================ */
const greetingEl = document.getElementById('greeting');
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');

/* ============================================================
   2. NAMA PENGGUNA
   Untuk sementara pakai nama default "Fahran".
   Fitur mengubah dan menyimpan nama akan dibuat di tahap lain.
   ============================================================ */
let userName = 'Fahran';

/* ============================================================
   3. DAFTAR NAMA HARI & BULAN (Bahasa Indonesia)
   getDay() mengembalikan 0–6 (0 = Minggu).
   getMonth() mengembalikan 0–11 (0 = Januari).
   Karena itu urutan array dimulai dari Minggu/Januari.
   ============================================================ */
const days = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/* ============================================================
   4. FUNGSI getGreeting()
   Menentukan sapaan berdasarkan jam saat ini.
     05.00–10.59  → Selamat pagi
     11.00–14.59  → Selamat siang
     15.00–17.59  → Selamat sore
     18.00–04.59  → Selamat malam
   ============================================================ */
function getGreeting() {
  const hour = new Date().getHours(); // ambil jam (0–23)

  if (hour >= 5 && hour <= 10) {
    return 'Selamat pagi';
  } else if (hour >= 11 && hour <= 14) {
    return 'Selamat siang';
  } else if (hour >= 15 && hour <= 17) {
    return 'Selamat sore';
  } else {
    // jam >= 18 atau jam <= 4
    return 'Selamat malam';
  }
}

/* ============================================================
   5. FUNGSI updateClock()
   Memperbarui jam, tanggal, dan greeting di layar.
   Dipanggil setiap detik oleh setInterval.
   ============================================================ */
function updateClock() {
  const now = new Date(); // ambil waktu saat ini

  /* --- Bagian Jam (format HH:MM:SS) --- */
  // padStart(2, '0') menambah angka 0 di depan jika hanya 1 digit.
  // Contoh: 9 → "09", 12 → "12"
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = h + ':' + m + ':' + s;

  /* --- Bagian Tanggal (format: Senin, 1 Januari 2024) --- */
  const dayName = days[now.getDay()];       // contoh: "Senin"
  const dateNum = now.getDate();            // contoh: 17
  const monthName = months[now.getMonth()]; // contoh: "Januari"
  const year = now.getFullYear();           // contoh: 2024
  dateEl.textContent = dayName + ', ' + dateNum + ' ' + monthName + ' ' + year;

  /* --- Bagian Greeting --- */
  // Gabungkan sapaan + nama, contoh: "Selamat pagi, Fahran!"
  greetingEl.textContent = getGreeting() + ', ' + userName + '!';
}

/* ============================================================
   6. JALANKAN JAM
   - Panggil updateClock() sekali langsung supaya jam muncul
     seketika, tanpa menunggu 1 detik pertama.
   - setInterval menjalankan updateClock setiap 1000 ms (1 detik).
   - Cukup SATU interval untuk semua (jam, tanggal, greeting).
   ============================================================ */
updateClock();
setInterval(updateClock, 1000);

/* ============================================================
   7. FOCUS TIMER (Pomodoro 25 menit)
   Tahap 4: Hitung mundur dengan Start, Stop, dan Reset.
   ============================================================ */

/* --- Ambil elemen tombol dan tampilan timer dari HTML --- */
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

/* --- Konstanta & state timer ---
   - DURATION: total detik untuk 25 menit (25 × 60 = 1500).
   - timeLeft: sisa waktu dalam detik (berubah saat berjalan).
   - timerId: ID interval dari setInterval. null = tidak berjalan.
   ============================================================ */
const DURATION = 25 * 60; // 1500 detik
let timeLeft = DURATION;  // mulai dari 1500
let timerId = null;       // awalnya tidak ada interval aktif

/* --- Fungsi formatTime(detik) → "MM:SS" ---
   Mengubah jumlah detik jadi format 2 digit menit dan detik.
   Contoh: 1500 → "25:00",  65 → "01:05",  5 → "00:05".
   Math.floor(1500 / 60) = 25  → menit
   1500 % 60 = 0              → detik sisa
   ============================================================ */
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return m + ':' + s;
}

/* --- Fungsi updateTimerDisplay() ---
   Hanya meng-update teks di layar sesuai timeLeft saat ini.
   Dipanggil saat start, stop, reset, dan tiap detik berjalan.
   ============================================================ */
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

/* --- Fungsi startTimer() ---
   Memulai / melanjutkan hitung mundur.
   Guard: jika timerId tidak null, berarti sudah berjalan,
   maka langsung return (keluar) supaya tidak jadi interval ganda.
   ============================================================ */
function startTimer() {
  // Cegah interval ganda: jika sudah berjalan, jangan mulai lagi
  if (timerId !== null) {
    return;
  }

  // setInterval mengurangi timeLeft tiap 1000 ms (1 detik)
  timerId = setInterval(function () {
    timeLeft = timeLeft - 1;

    // Jika waktu habis (mencapai 00:00)
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimerDisplay();
      stopTimer();          // hentikan interval otomatis
      alert('Waktu fokus selesai! Saatnya istirahat. 🎉');
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

/* --- Fungsi stopTimer() ---
   Menghentikan hitung mundur sementara (pause).
   clearInterval menghapus interval, lalu timerId di-reset ke null
   supaya Start bisa dipakai lagi untuk melanjutkan.
   Waktu yang tersisa (timeLeft) tidak diubah, jadi lanjut dari sini.
   ============================================================ */
function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

/* --- Fungsi resetTimer() ---
   Mengembalikan timer ke 25:00 dan menghentikan hitung mundur.
   ============================================================ */
function resetTimer() {
  stopTimer();              // hentikan interval jika sedang berjalan
  timeLeft = DURATION;     // kembalikan ke 1500 detik (25 menit)
  updateTimerDisplay();    // tampilkan "25:00" di layar
}

/* --- Hubungkan tombol dengan fungsi ---
   addEventListener memanggil fungsi saat tombol diklik.
   ============================================================ */
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

/* --- Tampilkan waktu awal saat halaman pertama dibuka --- */
updateTimerDisplay();

/* ============================================================
   8. TO-DO LIST + LOCAL STORAGE
   Tahap 5: Tambah, tampilkan, tandai selesai, hapus, dan simpan.
   ============================================================ */

/* --- Ambil elemen to-do dari HTML --- */
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoListEl = document.getElementById('todo-list');
const todoEmptyEl = document.getElementById('todo-empty');

/* --- Key localStorage & array tugas ---
   - TASKS_KEY: nama "laci" tempat data disimpan di localStorage.
   - tasks: array berisi object tugas { id, text, completed }.
   ============================================================ */
const TASKS_KEY = 'dashboard_tasks';
let tasks = [];

/* --- Fungsi saveTasks() ---
   Menyimpan array tasks ke localStorage.
   JSON.stringify mengubah array object menjadi teks string
   karena localStorage hanya bisa menyimpan teks.
   ============================================================ */
function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/* --- Fungsi loadTasks() ---
   Membaca data tugas dari localStorage saat halaman dibuka.
   JSON.parse mengubah teks string kembali menjadi array object.
   Jika belum ada data tersimpan, tasks tetap array kosong [].
   ============================================================ */
function loadTasks() {
  const saved = localStorage.getItem(TASKS_KEY);
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

/* --- Fungsi updateEmptyMessage() ---
   Menampilkan pesan "Belum ada tugas" hanya jika daftar kosong.
   Jika ada tugas, pesan disembunyikan.
   ============================================================ */
function updateEmptyMessage() {
  if (tasks.length === 0) {
    todoEmptyEl.style.display = 'block';
  } else {
    todoEmptyEl.style.display = 'none';
  }
}

/* --- Fungsi renderTasks() ---
   Menggambar ulang seluruh daftar tugas di layar.
   Dipanggil setiap kali ada perubahan (tambah, selesai, hapus).
   ============================================================ */
function renderTasks() {
  // Kosongkan daftar dulu agar tidak dobel saat digambar ulang
  todoListEl.innerHTML = '';

  // Loop setiap tugas, buat elemen <li> untuk masing-masing
  tasks.forEach(function (task) {
    // 1. Buat elemen <li> dan beri class "completed" jika sudah selesai
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    // 2. Buat teks tugas dengan class "task-text" (sudah di-style di CSS)
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    li.appendChild(span);

    // 3. Buat tombol "Selesai" / "Belum"
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-toggle';
    toggleBtn.textContent = task.completed ? 'Belum' : 'Selesai';
    // Saat diklik, panggil toggleTask dengan ID tugas ini
    toggleBtn.addEventListener('click', function () {
      toggleTask(task.id);
    });
    li.appendChild(toggleBtn);

    // 4. Buat tombol "Hapus"
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Hapus';
    // Saat diklik, panggil deleteTask dengan ID tugas ini
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });
    li.appendChild(deleteBtn);

    // 5. Masukkan <li> yang sudah jadi ke dalam daftar
    todoListEl.appendChild(li);
  });

  // Perbarui tampilan pesan kosong
  updateEmptyMessage();
}

/* --- Fungsi addTask(text) ---
   Menambahkan tugas baru ke array, lalu simpan dan render.
   ============================================================ */
function addTask(text) {
  const newTask = {
    id: Date.now(),      // ID unik dari timestamp (ms sejak 1970)
    text: text,         // isi tugas
    completed: false    // baru dibuat, belum selesai
  };
  tasks.push(newTask);  // tambahkan ke akhir array
  saveTasks();          // simpan ke localStorage
  renderTasks();        // gambar ulang daftar
}

/* --- Fungsi toggleTask(id) ---
   Membalik status selesai: belum → selesai, selesai → belum.
   ============================================================ */
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      // !task.completed = kebalikan dari nilai saat ini
      // true jadi false, false jadi true
      task.completed = !task.completed;
    }
  });
  saveTasks();
  renderTasks();
}

/* --- Fungsi deleteTask(id) ---
   Menghapus tugas berdasarkan ID.
   filter() membuat array baru yang berisi semua tugas
   KECUALI tugas dengan ID yang cocok.
   ============================================================ */
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id; // true = dipertahankan, false = dibuang
  });
  saveTasks();
  renderTasks();
}

/* --- Event: saat form dikirim (tombol "Tambah" atau tekan Enter) --- */
todoForm.addEventListener('submit', function (e) {
  e.preventDefault(); // cegah halaman reload (perilaku default form)

  // .trim() menghapus spasi di awal dan akhir teks
  const text = todoInput.value.trim();

  // Validasi: jangan tambah jika kosong atau hanya berisi spasi
  if (text === '') {
    alert('Tugas tidak boleh kosong!');
    return; // hentikan, jangan lanjut ke addTask
  }

  addTask(text);

  // Kosongkan input & kembalikan fokus untuk tugas berikutnya
  todoInput.value = '';
  todoInput.focus();
});

/* --- Muat data & tampilkan tugas saat halaman pertama dibuka --- */
loadTasks();
renderTasks();

/* ============================================================
   9. QUICK LINKS + LOCAL STORAGE
   Tahap 6: Tambah, tampilkan, buka, hapus, dan simpan tautan.
   ============================================================ */

/* --- Ambil elemen quick links dari HTML --- */
const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linkListEl = document.getElementById('link-list');
const linksEmptyEl = document.getElementById('links-empty');

/* --- Key localStorage & array links ---
   LINKS_KEY berbeda dari TASKS_KEY agar tidak bertabrakan.
   Setiap link = { id, name, url }.
   ============================================================ */
const LINKS_KEY = 'dashboard_links';
let links = [];

/* --- Fungsi saveLinks() ---
   Menyimpan array links ke localStorage sebagai teks JSON.
   ============================================================ */
function saveLinks() {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

/* --- Fungsi loadLinks() ---
   Membaca data links dari localStorage saat halaman dibuka.
   ============================================================ */
function loadLinks() {
  const saved = localStorage.getItem(LINKS_KEY);
  if (saved) {
    links = JSON.parse(saved);
  }
}

/* --- Fungsi isValidUrl(url) ---
   Memeriksa apakah URL valid DAN menggunakan protokol aman.
   - new URL() akan error jika format URL salah.
   - Kita hanya menerima http: atau https:, menolak javascript:,
     data:, dan protokol lain yang bisa berbahaya.
   ============================================================ */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false; // URL tidak valid
  }
}

/* --- Fungsi updateLinksEmptyMessage() ---
   Tampilkan pesan "Belum ada link" hanya jika daftar kosong.
   ============================================================ */
function updateLinksEmptyMessage() {
  if (links.length === 0) {
    linksEmptyEl.style.display = 'block';
  } else {
    linksEmptyEl.style.display = 'none';
  }
}

/* --- Fungsi renderLinks() ---
   Menggambar ulang seluruh daftar link di layar.
   Dipanggil setiap kali ada perubahan (tambah, hapus).
   ============================================================ */
function renderLinks() {
  // Kosongkan daftar dulu
  linkListEl.innerHTML = '';

  links.forEach(function (link) {
    // 1. Buat elemen <li>
    const li = document.createElement('li');

    // 2. Buat elemen <a> untuk tautan
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.name;
    // target="_blank" membuka link di tab baru
    a.target = '_blank';
    // rel="noopener noreferrer" mencegah tab baru mengakses
    // halaman dashboard kita (pengaman dari serangan tab-nabbing)
    a.rel = 'noopener noreferrer';
    li.appendChild(a);

    // 3. Buat tombol "Hapus"
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Hapus';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
    });
    li.appendChild(deleteBtn);

    // 4. Masukkan <li> ke daftar
    linkListEl.appendChild(li);
  });

  updateLinksEmptyMessage();
}

/* --- Fungsi addLink(name, url) ---
   Menambahkan link baru ke array, lalu simpan dan render.
   ============================================================ */
function addLink(name, url) {
  const newLink = {
    id: Date.now(),  // ID unik
    name: name,
    url: url
  };
  links.push(newLink);
  saveLinks();
  renderLinks();
}

/* --- Fungsi deleteLink(id) ---
   Menghapus link berdasarkan ID.
   ============================================================ */
function deleteLink(id) {
  links = links.filter(function (link) {
    return link.id !== id;
  });
  saveLinks();
  renderLinks();
}

/* --- Event: saat form link dikirim --- */
linkForm.addEventListener('submit', function (e) {
  e.preventDefault(); // cegah halaman reload

  const name = linkNameInput.value.trim();
  const url = linkUrlInput.value.trim();

  // Validasi: nama tidak boleh kosong
  if (name === '') {
    alert('Nama link tidak boleh kosong!');
    return;
  }

  // Validasi: URL tidak boleh kosong
  if (url === '') {
    alert('URL tidak boleh kosong!');
    return;
  }

  // Validasi: URL harus valid dan pakai protokol http/https
  if (!isValidUrl(url)) {
    alert('URL tidak valid! Gunakan format http:// atau https://');
    return;
  }

  addLink(name, url);

  // Kosongkan input & kembalikan fokus
  linkNameInput.value = '';
  linkUrlInput.value = '';
  linkNameInput.focus();
});

/* --- Muat data & tampilkan links saat halaman pertama dibuka --- */
loadLinks();
renderLinks();


/* ============================================================
   10. PENGATURAN NAMA PENGGUNA
   Tahap 6: Simpan, muat, dan perbarui nama di greeting.
   ============================================================ */

/* Penjelasan masalah:
   Di Tahap 3, variabel userName di-hardcode jadi 'Fahran'.
   Tidak ada kode yang membaca elemen name-input atau
   save-name-btn, sehingga tombol "Simpan Nama" tidak melakukan
   apa-apa. Pada bagian ini kita hubungkan kedua elemen tersebut,
   simpan nama ke localStorage, dan muat kembali saat halaman
   dibuka. Variabel userName yang sudah ada di Tahap 3 tetap
   dipakai — kita hanya mengubah nilainya, bukan mendeklarasi
   ulang.
   ============================================================ */

/* --- Ambil elemen pengaturan nama dari HTML --- */
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');

/* --- Key localStorage untuk nama ---
   Pakai key berbeda dari dashboard_tasks dan dashboard_links
   agar tidak bertabrakan.
   ============================================================ */
const USERNAME_KEY = 'dashboard_username';

/* --- Fungsi loadUserName() ---
   Membaca nama tersimpan dari localStorage.
   Jika ada, perbarui variabel userName (dari Tahap 3) dan
   isi kolom input dengan nama tersebut.
   ============================================================ */
function loadUserName() {
  const saved = localStorage.getItem(USERNAME_KEY);
  if (saved) {
    userName = saved;      // ganti default 'Fahran' dengan nama tersimpan
    nameInput.value = saved; // tampilkan nama di kolom input
  }
}

/* --- Fungsi saveUserName() ---
   Membaca nama dari input, menyimpan ke localStorage, dan
   langsung memperbarui greeting tanpa perlu refresh.
   ============================================================ */
function saveUserName() {
  const name = nameInput.value.trim();

  // Validasi: nama tidak boleh kosong
  if (name === '') {
    alert('Nama tidak boleh kosong!');
    return;
  }

  userName = name;                        // perbarui variabel global
  localStorage.setItem(USERNAME_KEY, name); // simpan ke localStorage
  updateClock();                          // perbarui greeting seketika
  alert('Nama berhasil disimpan! Halo, ' + name + '!');
}

/* --- Event: saat tombol "Simpan Nama" diklik --- */
saveNameBtn.addEventListener('click', saveUserName);

/* --- Muat nama tersimpan saat halaman pertama dibuka ---
   Dipanggil setelah semua kode lain selesai dimuat.
   Lalu updateClock() dipanggil agar greeting langsung
   menampilkan nama yang tersimpan, bukan default 'Fahran'.
   ============================================================ */
loadUserName();
updateClock();

/* ============================================================
   11. LIGHT/DARK MODE
   Tahap 7: Ganti tema, simpan pilihan ke localStorage.
   ============================================================ */

/* --- Ambil tombol toggle tema dari HTML --- */
const themeToggleBtn = document.getElementById('theme-toggle');

/* --- Key localStorage untuk tema ---
   Terpisah dari dashboard_tasks, dashboard_links, dashboard_username.
   ============================================================ */
const THEME_KEY = 'dashboard_theme';

/* --- Fungsi applyTheme(theme) ---
   Menerapkan tema ke halaman:
   - 'dark'  → tambah class "dark" ke body, label tombol jadi "Light Mode"
   - 'light' → hapus class "dark" dari body, label tombol jadi "Dark Mode"
   CSS variables di style.css akan otomatis menyesuaikan semua warna.
   ============================================================ */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = 'Light Mode';
  } else {
    document.body.classList.remove('dark');
    themeToggleBtn.textContent = 'Dark Mode';
  }
}

/* --- Fungsi toggleTheme() ---
   Membalik tema saat ini: dark → light, light → dark.
   Lalu simpan pilihan baru ke localStorage.
   ============================================================ */
function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

/* --- Event: saat tombol tema diklik --- */
themeToggleBtn.addEventListener('click', toggleTheme);

/* --- Muat tema tersimpan saat halaman pertama dibuka ---
   Jika belum ada tema tersimpan, gunakan 'light' sebagai default.
   ============================================================ */
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
applyTheme(savedTheme);
