//array untuk menampung nilai object
let blogs = [];

function addBlog(e) {
  e.preventDefault();

  //membuat variable yang memanggil id input
  let title = document.getElementById("input-blog-title").value;
  let content = document.getElementById("input-blog-content").value;
  let author = document.getElementById("input-blog-author").value;
  let image = document.getElementById("input-blog-image").files;

  // mengkonversi gambar
  image = URL.createObjectURL(image[0]);

  // mencetak ke dalam object
  let blogData = {
    title: title,
    content: content,
    image: image,
    author: author,
    createdDate: new Date(),
  };

  // mengirim object ke dalam console / penampungan array object
  blogs.push(blogData);
  console.log(blogs);

  // perulangan saat nilai dikirimkan ke console / array object
  for (i = 0; i < blogs.length; i++) {
    console.log(blogs[i]);
  }

  // memanggil fungsi renderBlog
  renderBlog();
}

// Function renderBlog untuk mengirim data ke addBlog
function renderBlog() {
  let contentContainer = document.getElementById("contents"); //Mengambil id contents
  contentContainer.innerHTML = firstBlog(); //mengosongkan content default saat proses cetak
  //looping untuk mencetak isi dari form inputnya
  for (let i = 0; i < blogs.length; i++) {
    contentContainer.innerHTML += ` <div class="blog-list-item">
          <div class="blog-image">
            <img src="${blogs[i].image}" alt="" />
          </div>
          <div class="blog-content">
            <div class="btn-group">
              <button class="btn-edit">Edit Post</button>
              <button class="btn-post">Post Blog</button>
            </div>
            <h1>
              <a href="blog-detail.html" target="_blank"
                >${blogs[i].title}</a
              >
            </h1>
            <div class="detail-blog-content">
              ${getFullTime(blogs[i].createdDate)} | ${blogs[i].author}
            </div>
            <p>
              ${blogs[i].content}
            </p>
             <div
              style="
                text-align: right;
                margin-top: 30px;
                color: #777777;
                font-size: 14px;
                font-weight: 500;
              "
            >
              <span>${getDistanceTime(blogs[i].createdDate)}</span>
            </div>
          </div>
        </div>
        
        `;
  }
}

function firstBlog() {
  return `<div class="blog-list-item">
  <div class="blog-image">
    <img src="../public/assets/images/blog-img.png" alt="" />
  </div>
  <div class="blog-content">
    <div class="btn-group">
      <button class="btn-edit">Edit Post</button>
      <button class="btn-post">Post Blog</button>
    </div>
    <h1>
      <a href="blog-detail.html" target="_blank"
        >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a
      >
    </h1>
    <div class="detail-blog-content">
      12 Jul 2021 22:30 WIB | Ichsan Emrald Alamsyah
    </div>
    <p>
      Ketimpangan sumber daya manusia (SDM) di sektor digital masih
      menjadi isu yang belum terpecahkan. Berdasarkan penelitian
      ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
      meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Quam, molestiae
      numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
      eligendi debitis?
    </p>

    <div style="text-align: right;">
        <span style="font-size: 13px; color: grey">
          1 day ago
        </span>
    </div>

  </div>
</div>`;
}

// menampung nilai untuk index pada bulan
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// fungsi untuk mengubah format pada tanggal, bulan, dan tahun
function getFullTime(time) {
  let date = time.getDate();
  let nameMonth = time.getMonth();
  let year = time.getFullYear();
  let hours = time.getHours();
  let minutes = time.getMinutes();

  // mencetak dan mengambil nilai dari variable
  let fullTime = `${date} ${months[nameMonth]} ${year} - 
  ${hours}:${minutes} `;

  return fullTime;
}

//fungsi untuk mengatur jarak waktu
function getDistanceTime(time) {
  // Waktu saat diposting
  let timePost = time;

  // Waktu sekarang saat melihat tampilan
  let timeNow = new Date();

  //selisih waktu saat melihat tampilan & waktu awal posting
  let distance = timeNow - timePost;

  // konversi menjadi hari dalam 1 hari

  let seconds = 60; //60 detik = 1 menit
  let miliSecond = 1000; // 1000 milidetik = 1 detik
  let secondInHours = 3600; // 3600 detik = 1 jam
  let hoursInDay = 23; // 23 jam = 1 hari

  // deklarasi perhitungan hari
  let distanceDay = Math.floor(
    distance / (miliSecond * secondInHours * hoursInDay) // selisih waktu / 1000 * 3600 * 23
  );

  // deklarasi perhitungan jam
  let distanceHours = Math.floor(
    distance / (miliSecond * secondInHours) // selisih waktu / 1000 * 3600 * 23
  );

  // deklarasi perhitungan menit
  let distanceMinutes = Math.floor(distance / (miliSecond * seconds)); // selisih waktu / 1000 * 60

  // deklarasi perhitungan detik
  let distanceSeconds = Math.floor(distance / miliSecond); // selisih waktu / 1000

  if (distanceDay >= 1) {
    return `${distanceDay} day ago`;
  } else {
    if (distanceHours >= 1) {
      return `${distanceHours} Hours ago`;
    } else {
      if (distanceMinutes >= 1) {
        return `${distanceMinutes} Minutes ago`;
      } else {
        return `${distanceSeconds} Seconds ago`;
      }
    }
  }
}

setInterval(() => {
  renderBlog();
}, 1000);

// getDistanceTime();

function resetInput() {
  document.getElementById("form-input").reset();
}
