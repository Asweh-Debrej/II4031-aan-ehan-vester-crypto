# Program Next.js

Program ini menggunakan **Next.js**, kerangka kerja React yang memungkinkan Anda membuat aplikasi web dengan mudah. Berikut adalah beberapa langkah untuk memulai:

## Link Deploy
[label](https://t1-aan-ehan-crypto-ciphers.vercel.app/home)

## Instalasi

1. Pastikan Anda memiliki **Node.js** terinstal di komputer Anda. Jika belum, unduh dan instal dari situs resmi Node.js.

2. Clone repositori ini

   ```bash
   git clone https://github.com/Asweh-Debrej/T1-II4031-Kripto/
   ```

3. Jalankan perintah berikut untuk menginstal dependensi:

   ```bash
   yarn install
   ```

4. Jalankan build atau development server

   ```bash
   yarn run build
   yarn start
   ```
   atau
   ```bash
   yarn run dev
   ```

5. Buka URL yang tertera pada terminal

## Package Manager Lainnya (Pengganti Yarn)

* NPM (tidak disarankan)

## Direktori Proyek

````bash
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
````

Algoritma ciphers terdapat pada ./src/lib/cipher

## Anggota
|   Anggota   | NIM   |
|   ---   |   ---   |
| Muhammad Farhan Syakir   |   18221145   |
| Rayhan Nugraha Putra   |   18221149   |
