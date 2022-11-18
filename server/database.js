const creatPool = require('mysql');
const express = require("express");
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cors())


const pool = creatPool.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "ltw",
})

app.post('/register', (req, res) => {
    const account = req.body.account;
    const password = req.body.password;
    const email = req.body.email;
    console.log(account, password, email)
    pool.query("INSERT INTO user (`account`, `password`, `email`) VALUES (?,?,?);",
        // eslint-disable-next-line no-undef
        [account, password, email],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("dang ky thanh cong")
                res.send(reslut);
            }
            else {
                console.log('dang ky khong thanh cong');
            }
        });
})


app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    pool.query("select * from user Where account = ? and password= ?",
        // eslint-disable-next-line no-undef
        [email, password],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("dang nhap thanh cong")
                res.send(reslut);
            }
            else {
                console.log('dang nhap khong thanh cong');
            }
        });
})

app.post('/data', (req, res) => {
    pool.query("select * from user",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu nguoi dung thanh cong")
                res.send(reslut);
            }
            else {
                console.log('lay du lieu nguoi dung khong thanh cong');
            }
        });
})

app.post('/main/databook', (req, res) => {
    pool.query("SELECT * FROM book;",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu book thanh cong")
                res.send(reslut);
            }
            else {
                console.log('lay du lieu book khong thanh cong');
            }
        });
})


app.post('/main/deleteData', (req, res) => {
    const idbook = req.body.idbook;
    pool.query("DELETE FROM book WHERE idbook = ?",
        // eslint-disable-next-line no-undef
        [idbook],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("xoa book thanh cong")
                res.send(reslut);
            }
            else {
                console.log('xoa book khong thanh cong');
            }
        });
})

app.post('/main/Update', (req, res) => {
    const idbook = req.body.idbook;
    const name = req.body.name;
    const author = req.body.author;
    const date = req.body.date;
    const numberbook = req.body.numberbook;
    const image = req.body.image;
    const type = req.body.type;
    const note = req.body.note;
    console.log(req.body)
    pool.query("UPDATE `ltw`.`book` SET `name` = ?, `author` =?, `date` = ?, `numberbook` = ?, `image` = ?, `type` = ?, `note` = ? WHERE idbook = ?",
        // eslint-disable-next-line no-undef
        [name,author,date,numberbook,image,type,note,idbook],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("cap nhat thanh cong")
                res.send(reslut);
            }
            else {
                console.log('cap nhat khong thanh cong');
            }
        });
})


app.listen(3001, () => {
    console.log("running")
})

// pool.query('SELECT * FROM product',(err,res)=>{
//     if(err)
//     {
//         return console.log(err);
//     }
//     return console.log(res)
// })

