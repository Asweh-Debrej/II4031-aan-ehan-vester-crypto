# Program Next.js

Program ini menggunakan **Next.js**, kerangka kerja React yang memungkinkan Anda membuat aplikasi web dengan mudah. Berikut adalah beberapa langkah untuk memulai:

## Instalasi

1. Pastikan Anda memiliki **Node.js** terinstal di komputer Anda. Jika belum, unduh dan instal dari situs resmi Node.js.

2. Clone repositori ini
   ```bash
   git clone https://github.com/Asweh-Debrej/T1-II4031-Kripto/

4. Jalankan perintah berikut untuk menginstal dependensi:
   ```bash
   yarn install

5. Lakukan build aplikasi
   ```bash
   yarn run build

6. Jalankan aplikasi pada localhost
   ```bash
   yarn start

## Direktori Proyek
```bash
T1-II4031-Kripto
    ├───public
    └───src
        ├───app
        │   └───(main)
        │       ├───cipher
        │       │   ├───affine
        │       │   ├───playfair
        │       │   ├───product
        │       │   ├───vigenere
        │       │   ├───vigenere-auto-key
        │       │   └───vigenere-ext
        │       └───home
        ├───components
        │   └───cipher
        │       └───form
        └───lib
            ├───cipher
            ├───error
            ├───store
            └───utils
