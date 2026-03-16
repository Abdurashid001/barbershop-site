# 333 Barbershop - Veb-sayt

Bu loyiha **333 Barbershop** uchun tayyorlangan bo'lib, o'zida mijozlar hamda adminlar uchun mo'ljallangan turli foydali funksiyalarni jamlagan. Veb-sayt tez, xavfsiz va ko'p tillik formatida mukammal ishlaydi.

## 🌟 Asosiy imkoniyatlar (Xususiyatlar)
- **Ro'yxatdan O'tish va Avtorizatsiya:** Foydalanuvchilar o'z ma'lumotlari bilan shaxsiy akkaunt yaratishlari mumkin. Parollar `bcrypt` bilan ishonchli shifrlanadi. `JWT` (JSON Web Token) yordamida esa sessiyalar boshqariladi.
- **Navbatga Yozilish (Booking):** Mijozlar o'zlariga kerakli Barber (sartarosh) xizmatlarini kun va vaqtni tanlagan holda band qilishlari mumkin. Chiroyli dizayndagi Modal forma orqali ariza koldirish qulay.
- **Admin Panel:** Alohida sahifa (`admin.html`) bo'lib, u yerda administrator:
  - Saytga qo'shilgan/obuna bo'lgan mijozlarni;
  - Qoldirilgan savol, taklif va shikoyatlarni;
  - Navbatga qabul qilingan barcha yozuvlarni bir joydan nazorat qilib turishi mumkin.
- **Bir Nechta Til (Multilanguage):** Google Translate API integratsiyasi orqali butun sayt silliq va sifatli qilib Rus, Ingliz va O'zbek tillarida tarjima bo'lib xizmat ko'rsata oladi.

## 🛠 Texnologiyalar
- **Frontend (UI qismi):** HTML, CSS (Bootstrap 5), JavaScript.
- **Backend (Server):** Node.js va Express.js freymvorki.
- **Ma'lumotlar Bazasi:** MySQL (mysql2 plagini yordamida qo'shilgan).

## 🚀 Loyihani Kompyuterda Ishga Tushirish (O'rnatish)

Loyihani o'z kompyuteringizda yurgizish uchun dastlab sizga `Node.js` hamda `MySQL` (masalan, XAMPP, MAMP yoki alohida MySQL serveri) kerak bo'ladi.

1. **Repozitoriyni yuklab oling:**
   ```bash
   git clone https://github.com/Abdurashid001/barbershop-site.git
   cd barbershop-site
   ```
2. **Kutubxonalarni o'rnating:**
   ```bash
   npm install
   ```
3. **MySQL Sozlamalarini ulash:**  
   Loyihani ichidagi `server.js` faylini ochib, 21-qator atrofidagi joyni topasiz va o'zingizning kompyuteringizdagi **MySQL** ma'lumotlarini (username hamda password) to'g'irlab yozasiz.  
   Masalan:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',      // ← MySQL foydalanuvchi nomingiz
       password: '',      // ← MySQL parolingiz (bo'sh bo'lishi ham mumkin)
   });
   ```
   *Eslatma: Ma'lumotlar bazasi hamda jadvallarni (tables) loyihaning o'zi birinchi ishga tushganidanoq, avtomatik ravishda yasab beradi.*

4. **Serverni Yurgizish:**
   ```bash
   node server.js
   ```
5. **Saytni ko'rish:**  
   Har qanday veb brauzerga kirib `http://localhost:3000` deb yozing, va saytingiz tayyor!

## 📸 Ko'rinish
- Oddiy foydalanuvchilar qismi barcha html sahifalardan iborat.
- Admin panel - `http://localhost:3000/admin.html` havolasi ostida joylashgan.
