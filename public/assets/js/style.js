function submitData() {
  // mendeklarasikan id di tabel form
  let name = document.getElementById("input_nama").value;
  let email = document.getElementById("input_email").value;
  let number = document.getElementById("input_number").value;
  let subject = document.getElementById("input_subject").value;
  let area = document.getElementById("input_area").value;
  let checkHtml = document.getElementById("html").checked;
  let checkCss = document.getElementById("css").checked;
  let checkJs = document.getElementById("javaScript").checked;

  // pengkondisian validasi di tabel form
  if (name == "") {
    alert("Nama harus diisi");
  } else if (email == "") {
    alert("Email harus diisi");
  } else if (number == "") {
    alert("Nomor harus diisi");
  } else if (area == "") {
    alert("Pesan harus diisi");
  } else if (checkHtml == "" && checkCss == "" && checkJs == "") {
    alert("Pilih satu atau lebih keahlian anda");
    return;
  }

  // deklarasi id untuk tipe checked pada form
  let skillHtml = document.getElementById("html").checked;
  let skillCss = document.getElementById("css").checked;
  let skillJs = document.getElementById("javaScript").checked;

  // pengkondisian tipe checked pada form
  if (skillHtml) {
    skillHtml = document.getElementById("html").value;
  } else {
    skillHtml = "";
  }

  if (skillCss) {
    skillCss = document.getElementById("css").value;
  } else {
    skillCss = "";
  }

  if (skillJs) {
    skillJs = document.getElementById("javaScript").value;
  } else {
    skillJs = "";
  }

  let kirimEmail = "danualbadr18@gmail.com";
  let a = document.createElement("a");

  a.href = `mailto: ${kirimEmail}
            ?subject=${subject}
            &body=Hello my name is : ${name} 
            ${area}
            Contact me : ${number}
            send CV ${email}
            My Skill : ${skillHtml} ${skillCss} ${skillJs}`;

  if (
    name == "" ||
    email == "" ||
    number == "" ||
    subject == "" ||
    area == ""
  ) {
    alert("Semuanya wajib diisi");
    return;
  }

  a.click();

  // output keseluruhan pada form
  console.log(name);
  console.log(email);
  console.log(number);
  console.log(subject);
  console.log(area);
  console.log(skillHtml, skillCss, skillJs);

  let objectData = {
    name: name,
    email: email,
    number: number,
    subject: subject,
    area: area,
    skillHtml: skillHtml,
    skillCss: skillCss,
    skillJs: skillJs,
  };

  console.log(objectData);
}
