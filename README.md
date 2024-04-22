# Program Next.js

Program ini menggunakan **Next.js**, kerangka kerja React yang memungkinkan Anda membuat aplikasi web dengan mudah. Berikut adalah beberapa langkah untuk memulai:

## Link Deploy
<(https://ii4031-aan-vester-crypto.vercel.app/cipher/rsa)>

## Instalasi

1. Pastikan Anda memiliki **Node.js** terinstal di komputer Anda. Jika belum, unduh dan instal dari situs resmi Node.js.

2. Clone repositori ini

   ```bash
   git clone https://github.com/Asweh-Debrej/II4031-aan-vester-crypto.git
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

## CATATAN PENTING

Beberapa karakter UTF-8 tidak bisa disalin ke *clipboard* sehingga penggunaan Base64 untuk *clipboard* sangat disarankan

*update, sekarang keliatannya udah fixed

## Direktori Proyek

````bash
├───public
└───src
    ├───app
    │   └───(main)
    │       ├───about
    │       ├───cipher
    │       │   ├───affine
    │       │   ├───playfair
    │       │   ├───product
    │       │   ├───rc4
    │       │   ├───rsa
    │       │   │   └───page.js <============= new
    │       │   ├───rsa-test
    │       │   ├───vigenere
    │       │   ├───vigenere-auto-key
    │       │   └───vigenere-ext
    │       └───home
    ├───components
    │   └───cipher
    │       └───form
    │           └───rsa.js <================= new
    └───lib
        ├───cipher
        │   └───rsa.js <===================== new
        ├───error
        ├───store
        └───utils
              └───cipher.js <================ updated
````

Algoritma ciphers terdapat pada ./src/lib/cipher

## Anggota
|   Anggota   | NIM   |
|   ---   |   ---   |
| Muhammad Farhan Syakir   |   18221145   |
| Silvester Kresna W. P. P.   |   18221049   |
