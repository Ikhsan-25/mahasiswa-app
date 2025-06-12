const express = require("express");
const cors = require("cors");

const app = express();
const port = 4004;
const bodyParser = require("body-parser");
const db = require("./dbase");
const response = require("./response");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return response(200, "API ready to go", "SUCCESS", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, fields) => {
    if (err) return response(500, [], "Gagal ambil data", res);
    return response(200, fields, "mahasiswa get list", res);
  });
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = "SELECT * FROM mahasiswa WHERE NIM = ?";
  db.query(sql, [nim], (err, fields) => {
    if (err) return response(500, [], "Gagal ambil detail", res);
    return response(200, fields, "get detail", res);
  });
});

app.post("/mahasiswa", (req, res) => {
  const { nama, umur, alamat, nim } = req.body;
  if (!nama || !umur || !alamat || !nim) {
    return response(400, [], "Semua field wajib diisi", res);
  }

  const sql = "INSERT INTO mahasiswa (Nama, Umur, Alamat, NIM) VALUES (?, ?, ?, ?)";
  db.query(sql, [nama, umur, alamat, nim], (err, fields) => {
    if (err) {
      console.error("SQL INSERT ERROR:", err);
      return response(500, [], "Gagal menambahkan data", res);
    }

    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      return response(200, data, "Data Added Success", res);
    }

    return response(400, [], "Data gagal ditambahkan", res);
  });
});

app.put("/mahasiswa", (req, res) => {
  const { nim, nama, umur, alamat } = req.body;
  if (!nim || !nama || !umur || !alamat) {
    return response(400, [], "Semua field wajib diisi", res);
  }

  const sql = "UPDATE mahasiswa SET Nama = ?, Umur = ?, Alamat = ? WHERE NIM = ?";
  db.query(sql, [nama, umur, alamat, nim], (err, fields) => {
    if (err) {
      console.error("SQL UPDATE ERROR:", err);
      return response(500, [], "Gagal update", res);
    }

    if (fields?.affectedRows) {
      return response(200, { isSuccess: fields.affectedRows }, "Update Data Success", res);
    }

    return response(404, [], "Data tidak ditemukan", res);
  });
});

app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  if (!nim) return response(400, [], "NIM wajib diisi", res);

  const sql = "DELETE FROM mahasiswa WHERE NIM = ?";
  db.query(sql, [nim], (err, fields) => {
    if (err) {
      console.error("SQL DELETE ERROR:", err);
      return response(500, [], "Gagal menghapus data", res);
    }

    if (fields?.affectedRows) {
      return response(200, { isDeleted: fields.affectedRows }, "Deleted Data Success", res);
    }

    return response(404, [], "Data tidak ditemukan", res);
  });
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
