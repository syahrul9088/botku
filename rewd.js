
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
var randomize = require('randomatic')
var random = require('random-name')
const cheerio = require('cheerio');
const delay = require('delay')
var md5 = require('md5');
const { read, copySync } = require('fs-extra');

const functionSendOtp = (nomor, reff, auth, hash) => new Promise((resolve, reject) => {
    const bodys = {
        mobile_number: `+62${nomor}`,
        referral_code: reff,
        otp_hash: hash
        }
    
      fetch('https://xcelpay.io/api/share-earn/register', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': auth,
            'Content-Type': 'application/json',
            'Content-Length': 83,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
           // 'Cookie': 'id=s%3Ac7ecBrYy4Te9B75_1RZOeRN5NkhXlReT.1sZ%2BsFihwF4qBEY%2F%2BWxSrDhJdaKqZpKA0tHjIIuSP5A',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionVerifOtp = (otp, nomor, auth) => new Promise((resolve, reject) => {
    const bodys = {
        mobile_number: `+62${nomor}`,
        otp_code: otp
        }
    
      fetch('https://xcelpay.io/api/share-earn/verify-otp', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': auth,
            'Content-Type': 'application/json',
            'Content-Length': 51,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            //'Cookie': 'id=s%3Ac7ecBrYy4Te9B75_1RZOeRN5NkhXlReT.1sZ%2BsFihwF4qBEY%2F%2BWxSrDhJdaKqZpKA0tHjIIuSP5A',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });


const functionWd = (id, wallet, bearer) => new Promise((resolve, reject) => {
    const bodys = {
        user_id: id,
        wallet_address: wallet
        }
    
      fetch('https://xcelpay.io/api/share-earn/withdraw', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json',
            'Content-Length': 100,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            //'Cookie': 'id=s%3A5h380jb4IhP0D-jIO-L31hJhboOPKxn2.3B5OlMS%2Fh%2BgcODXL3o7Cmbh7iCHNmet4xSj%2FZTe8EGI',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionBalance = (bearer) => new Promise((resolve, reject) => {
    fetch('https://xcelpay.io/api/share-earn/user-balance', { 
        method: 'GET', 
        headers: {
          'authorization': `Bearer ${bearer}`,
          'Content-Type': 'application/json',
          'Host': 'xcelpay.io',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
         // 'Cookie': 'id=s%3A5h380jb4IhP0D-jIO-L31hJhboOPKxn2.3B5OlMS%2Fh%2BgcODXL3o7Cmbh7iCHNmet4xSj%2FZTe8EGI',
          'User-Agent': 'okhttp/3.12.1'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

(async () => {
    const reff = readlineSync.question('[?] Reff code: ')
    const jumlah = readlineSync.question('[?] Jumlah reff: ')
    const noLogin = readlineSync.question('[?] Nomor HP login (ex: 819088XXXX): ')
    const wallet = readlineSync.question('[?] Wallet: ')
    for (var i = 0; i < jumlah; i++){
    try {
        const hash = randomize('Aa0',12)
        const nomor = randomize('0', 10)
        const auth = md5(nomor)
        const regist = await functionSendOtp(nomor, reff, auth, hash)
        const otp = regist.otp
        console.log(`[${i+1}] OTP ${otp}`)
        const verif = await functionVerifOtp(otp, nomor, auth)
        console.log(`[${i+1}] ${verif.message}`)
        const login = await functionSendOtp(noLogin, reff, auth, hash)
        const otpp = login.otp
        const veriff = await functionVerifOtp(otpp, noLogin, auth)
        const bearer = veriff.token
        const id = veriff.userDetails._id
        const balance = await functionBalance(bearer)
        if (balance.balance == 10000){
            const wd = await functionWd(id, wallet, bearer)
            console.log(`[+] ${wd.message}`)
        }
    } catch (e) {
        console.log(e)
    }
}
})()
