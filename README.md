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
    │       └───home
    │───use-case
    │  └───school-transcripts
    │       └───page.js                             // menampilkan komponen transcript-form
    │       └───transcript-form.js          // menampilkan komponen step 1 hingga step 7
    │       └───transcript-table.js          // komponen tabel
    │       └───transcript-input.js         // komponen step 1.1 Create Transcript Data
    │       └───transcript-hash.js          // komponen step 1.2 Create Hash (Automated)
    │       └───transcript-sign.js           // komponen step 1.3 Sign your Hash
    │       └───encrypt-field.js               // komponen step 1.4 Encrypt Each Field
    │       └───submit-database.js        // komponen step 2 Submit Data to Database
    │       └───retrieve-database.js       // komponen step 3 Retrieve Data from Database
    │       └───decrypt-field.js               // komponen step 4 Decrypt your Data
    │       └───hash-validate.js              // komponen step 5 Validate Hash
    │       └───download-transcript.js  // komponen step 6 Download your Transcript
    │       └───decrypt-transcript.js     // komponen step 7 Decrypt your Transcript
    ├───components
    │   └───cipher
    │       └───form
    └───lib
        ├───cipher
        │   └───rc4.js
        │   └───rsa.js
        ├───error
        ├───store
        └───utils
              └───cipher.js 
````

Algoritma ciphers terdapat pada ./src/lib/cipher

## Anggota
|   Anggota   | NIM   |
|   ---   |   ---   |
| Muhammad Farhan Syakir   |   18221145   |
| Silvester Kresna W. P. P.   |   18221049   |
| Rayhan Nugraha Putra   |   18221149   |
