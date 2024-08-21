let canvas = document.getElementById("canvas"); // Mengambil elemen canvas dari DOM
let ctx = canvas.getContext("2d"); // Mendapatkan context 2D untuk menggambar di canvas
let img = new Image(); // Membuat objek Image untuk gambar yang akan diupload
let twibbon = new Image(); // Membuat objek Image untuk twibbon yang akan diupload
let scale = 1; // Menyimpan skala gambar, defaultnya 1 (asli)
let imgX = 0,
  imgY = 0; // Koordinat awal gambar pada canvas
let dragging = false; // Status apakah gambar sedang di-drag
let startX, startY; // Menyimpan posisi awal saat drag dimulai

// Menambahkan event listener untuk upload gambar
document.getElementById("uploadImage").addEventListener("change", handleImage, false);
// Menambahkan event listener untuk upload twibbon
document.getElementById("uploadTwibbon").addEventListener("change", handleTwibbon, false);
// Menambahkan event listener untuk slider zoom
document.getElementById("zoomSlider").addEventListener("input", handleZoom, false);
// Menambahkan event listener untuk tombol download
document.getElementById("downloadBtn").addEventListener("click", downloadImage);

function handleImage(e) {
  let reader = new FileReader(); // Membuat objek FileReader untuk membaca file
  reader.onload = function (event) {
    img.onload = function () {
      // Ketika gambar selesai di-load
      resetCanvas(); // Reset canvas ke ukuran yang sesuai
      drawCanvas(); // Gambar ulang canvas dengan gambar yang baru
    };
    img.src = event.target.result; // Mengatur sumber gambar dari hasil baca FileReader
  };
  reader.readAsDataURL(e.target.files[0]); // Membaca file gambar sebagai URL Data
}

function handleTwibbon(e) {
  let reader = new FileReader(); // Membuat objek FileReader untuk membaca file twibbon
  reader.onload = function (event) {
    twibbon.onload = function () {
      // Ketika twibbon selesai di-load
      resetCanvas(); // Reset canvas ke ukuran yang sesuai
      drawCanvas(); // Gambar ulang canvas dengan twibbon yang baru
    };
    twibbon.src = event.target.result; // Mengatur sumber twibbon dari hasil baca FileReader
  };
  reader.readAsDataURL(e.target.files[0]); // Membaca file twibbon sebagai URL Data
}

function resetCanvas() {
  if (twibbon.src) {
    // Jika twibbon telah diupload
    let maxWidth = 400; // Maksimal lebar canvas agar muat di layar
    let scaleFactor = Math.min(maxWidth / twibbon.width, 1); // Menghitung skala faktor untuk menyesuaikan lebar canvas
    canvas.width = twibbon.width * scaleFactor; // Mengatur lebar canvas sesuai dengan twibbon
    canvas.height = twibbon.height * scaleFactor; // Mengatur tinggi canvas sesuai dengan twibbon
  }
  scale = 1; // Reset skala gambar ke 1 (asli)
  imgX = 0; // Reset posisi X gambar
  imgY = 0; // Reset posisi Y gambar
  document.getElementById("zoomSlider").value = 1; // Reset slider zoom ke 1
}

function drawCanvas() {
  if (img.src && twibbon.src) {
    // Jika gambar dan twibbon telah diupload
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Membersihkan canvas sebelum menggambar ulang
    ctx.drawImage(img, imgX, imgY, img.width * scale, img.height * scale); // Menggambar gambar di canvas dengan posisi dan skala yang ditentukan
    ctx.drawImage(twibbon, 0, 0, canvas.width, canvas.height); // Menggambar twibbon di atas gambar
  }
}

// Event listener untuk mousedown pada canvas
canvas.addEventListener("mousedown", function (e) {
  startX = e.offsetX; // Menyimpan posisi X saat mousedown
  startY = e.offsetY; // Menyimpan posisi Y saat mousedown
  dragging = true; // Mengaktifkan status dragging
});

// Event listener untuk mousemove pada canvas
canvas.addEventListener("mousemove", function (e) {
  if (dragging) {
    // Jika sedang dragging
    let dx = e.offsetX - startX; // Menghitung pergeseran X
    let dy = e.offsetY - startY; // Menghitung pergeseran Y
    imgX += dx; // Menyesuaikan posisi X gambar
    imgY += dy; // Menyesuaikan posisi Y gambar
    startX = e.offsetX; // Update posisi X start
    startY = e.offsetY; // Update posisi Y start
    drawCanvas(); // Gambar ulang canvas dengan posisi gambar yang baru
  }
});

// Event listener untuk mouseup pada canvas
canvas.addEventListener("mouseup", function () {
  dragging = false; // Menonaktifkan status dragging saat mouse dilepas
});

function handleZoom(e) {
  scale = e.target.value; // Mengambil nilai skala dari slider zoom
  drawCanvas(); // Gambar ulang canvas dengan skala yang baru
}

function downloadImage() {
  let link = document.createElement("a"); // Membuat elemen anchor untuk download
  link.download = "twibboned-image.png"; // Mengatur nama file yang akan didownload
  link.href = canvas.toDataURL("image/png"); // Mengambil URL data dari canvas
  link.click(); // Menjalankan klik pada elemen anchor untuk memulai download
}
