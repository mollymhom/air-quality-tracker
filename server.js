require('dotenv').config();
const express = require('express');
const cors = require('cors'); // เพิ่มการใช้งาน CORS

const app = express();

// เปิดใช้งาน CORS สำหรับทุก Origin (หรือตั้งค่าเฉพาะ Origin ได้)
app.use(cors());

// Route สำหรับส่ง API Key
app.get('/get-api-key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server running on port 3000');
});