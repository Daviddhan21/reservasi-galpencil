const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static folder
app.use(express.static('public'));

// Data booking
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');

// API untuk ambil booking
app.get('/api/bookings', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error membaca data');
    res.json(JSON.parse(data || '[]'));
  });
});

// API untuk tambah booking
app.post('/api/bookings', (req, res) => {
  const { nama, tanggal, keterangan } = req.body;
  if (!nama || !tanggal) return res.status(400).send('Nama & tanggal wajib');

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let bookings = [];
    if (!err) bookings = JSON.parse(data || '[]');

    bookings.push({ nama, tanggal, keterangan, id: Date.now() });

    fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), (err) => {
      if (err) return res.status(500).send('Error menyimpan data');
      res.send('Booking berhasil!');
    });
  });
});

// Admin lihat semua booking
app.get('/admin', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error membaca data');
    let bookings = JSON.parse(data || '[]');
    let html = '<h1>Data Booking</h1><ul>';
    bookings.forEach(b => {
      html += `<li>${b.nama} - ${b.tanggal} - ${b.keterangan || '-'}</li>`;
    });
    html += '</ul>';
    res.send(html);
  });
});

// Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
