// export Express
const express = require("express");
const app = express();
app.listen(5000, function () {
  console.log("Server starting on port 5000");
});
// ==================== || ==================== \\

// Untuk enkripsi password, session dan flash alert
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
// ==================== || ==================== \\

// import database dari folder connected
const db = require("./connected/db");
// ==================== || ==================== \\
const upload = require("./middlewares/fileUpload");
// Set HBS
app.set("view engine", "hbs");
// ==================== || ==================== \\

// Set Path Public Folder
app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));
// ============================================================= || ==========================================================

app.use(
  session({
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);
app.use(flash());

// Routing Contact Page
app.get("/contact", function (req, res) {
  res.render("contact");
});
// ==================== || ==================== \\

//Routing Blog Detail
app.get("/blog-detail/:id", function (req, res) {
  let id = req.params.id;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM tb_blog WHERE id= ${id}`, (err, result) => {
      if (err) throw err;
      let data = result.rows[0];
      console.log(data);
      res.render("blog-detail", { id: id, blog: data, user: req.session.user });
    });
  });
});
// =============================================== || ================================================================

// Menghapus isi blog dengan /delete-blog yang diambil dari index dan di kembalikan ke halaman blog
app.get("/delete-blog/:id", (req, res) => {
  if (!req.session.isLogin) {
    req.flash("danger", "You must login to access !");
    return res.redirect("/login");
  }
  let id = req.params.id;
  let query = `DELETE FROM tb_blog WHERE id = ${id}`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/blog");
    });
  });
});
// ======================================================== || =====================================================

let blogs = [];

// Routing Blog Page
let isLogin = true;
app.get("/blog", function (req, res) {
  db.connect(function (err, client, done) {
    if (err) throw err;
    client.query(
      `SELECT tb_blog.id, author_id, title, content, "createAt", image, tb_user.name FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id`,
      function (err, result) {
        if (err) throw err;
        console.log(result.rows);
        let dataBlogs = result.rows.map((data) => {
          return {
            ...data,
            createAt: getFullTime(data.createAt),
            newDistance: getDistanceTime(data.createAt),
            isLogin: req.session.isLogin,
          };
        });
        console.log(dataBlogs);
        res.render("blog", {
          blogs: dataBlogs,
          user: req.session.user,
          isLogin: req.session.isLogin,
        }); // Autentikasi untuk admin dan user
      }
    );
  });
});

app.post("/blog", upload.single("inputImage"), function (req, res) {
  let data = req.body;
  let authorId = req.session.user.id;
  let image = req.file.filename;

  let query = `INSERT INTO tb_blog (title, content, image, author_id) VALUES ('${data.inputTitle}', '${data.inputContent}', '${image}', '${authorId}')`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/blog");
    });
  });
});

// End Of BLog

// ==================================================== || ======================================================

// Routing Add Blog Page
app.get("/add-blog", function (req, res) {
  if (!req.session.isLogin) {
    req.flash("danger", "You must login to access !");
    return res.redirect("/login");
  }

  res.render("add-blog", {
    user: req.session.user,
    isLogin: req.session.isLogin,
  });
});
// ==================== || ==================== \\

// Memanggil Routing Home Page
app.get("/", function (req, res) {
  db.connect(function (err, client, done) {
    if (err) throw err;
    client.query("SELECT * FROM tb_exper", function (err, result) {
      if (err) throw err;
      console.log(result.rows);
      let dataHome = result.rows.map((data) => {
        return {
          ...data,
        };
      });
      console.log(dataHome);
      res.render("index", { exper: dataHome }); // Autentikasi untuk admin dan user
    });
  });
});
// ==================== || ==================== \\

app.get("/update-blog/:id", function (req, res) {
  let id = req.params.id;
  let query = `SELECT * FROM tb_blog WHERE id=${id}`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;
      let data = result.rows[0];
      console.log(data);
      res.render("update-blog", { id: id, updateBlog: data });
    });
  });
});

app.post("/update-blog/:id", upload.single("updateImage"), (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let image = req.file.filename;
  let query = `UPDATE tb_blog SET title = '${data.updateTitle}', content = '${data.updateContent}', image = '${image}' WHERE id = ${id}`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;
      console.log(data);
      res.redirect("/blog");
    });
  });
});

// ===================== || ==================== \\

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { inputName, inputEmail, inputPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(inputPassword, 10);
  let query = `INSERT INTO tb_user(name, email, password) VALUES ('${inputName}','${inputEmail}', '${hashedPassword}')`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;
      req.flash("success", "Congratulation, email has registered !");
      res.redirect("/login");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  let query = `SELECT * FROM tb_user WHERE email ='${loginEmail}'`;
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      if (err) throw err;

      if (result.rows.length == 0) {
        req.flash("danger", "Email Not Registered!");
        return res.redirect("/login");
      }

      // isMatch Password //
      const isMatch = bcrypt.compareSync(
        loginPassword,
        result.rows[0].password
      );
      if (isMatch) {
        req.session.isLogin = true;
        req.session.user = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
        };
        req.flash("success", "Login Success!");
        res.redirect("/blog");
      } else {
        req.flash("danger", "Password Not Match !");
        res.redirect("/login");
      }
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/blog");
});

function getFullTime(time) {
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "November",
    "December",
  ];
  let date = time.getDate();
  let nameMonth = time.getMonth();
  let year = time.getFullYear();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let fullTime = `${date} ${month[nameMonth]} 
  ${year} - ${hours} : ${minutes} WIB`;
  return fullTime;
}

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
