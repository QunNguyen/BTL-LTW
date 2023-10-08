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
    pool.query("INSERT INTO user (`account`, `password`, `email`,`permission`) VALUES (?,?,?,0);",
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
    pool.query("select * from user",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            let check = false;
            if (err) {
                console.log(err);
            }
            if (reslut) {
                // console.log(reslut)
                for (let index = 0; index < reslut.length; index++) {
                    const element = reslut[index];
                    if (element.email === email && element.password === password) {
                        check = true;
                        res.send({
                            check: true,
                            dataUser: {
                                permission: element.permission,
                                id: element.iduser
                            }
                        });
                        break;
                    }
                }
            }
            if (check == false) res.send(false);
        });
})

app.post('/data', (req, res) => {
    pool.query("SELECT email FROM ltw.user;",
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

app.post('/cart/get_data_book_ID', (req, res) => {
    pool.query("SELECT * FROM book where idbook=?",
        // eslint-disable-next-line no-undef
        [req.body.idbook],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu book thanh cong", req.body.idbook)
                res.send(reslut);

            }
            else {
                console.log('lay du lieu book khong thanh cong');
            }
        });
})


app.post('/cart/evaluate', (req, res) => {
    pool.query("UPDATE `ltw`.`cart` SET `Note` = ?, `Vote` = ?,`Status` = ? WHERE (`Idcart` = ?);",
        // eslint-disable-next-line no-undef
        [req.body.note,req.body.vote,22,req.body.ID],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("Nhan xet don hang thanh cong", req.body.ID)
                res.send(200);

            }
            else {
                console.log('Nhan xet don hang khong thanh cong');
            }
        });
})

app.post('/order/get_data_add_cart', (req, res) => {
    pool.query("SELECT * FROM ltw.cart_wait;",
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu dat hang thanh cong")
                res.send(reslut)
            }
            else {
                console.log('lay du lieu dat hang khong thanh cong');
            }
        });
})

app.post('/header/dataUser', (req, res) => {
    pool.query("SELECT email,account FROM ltw.user Where iduser=? and permission=?",
        [req.body.ID, req.body.permission],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu User thanh cong")
                res.send(reslut)
            }
            else {
                console.log('lay du lieu User khong thanh cong');
            }
        });
})

app.post('/order/delete_data_add_cart', (req, res) => {
    pool.query("DELETE FROM `ltw`.`cart_wait` WHERE (`ID` = ?)",
        [
            req.body.idbook
        ],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("Xoa du lieu dat hang thanh cong", req.body.idbook)
                res.send(200)
            }
            else {
                console.log("Xoa du lieu dat hang khong thanh cong")
            }
        });
})



app.post('/order/add_sub_quantity', (req, res) => {
    pool.query("UPDATE `ltw`.`cart_wait` SET `Quantity` = ?,`SumPrice` = ?  WHERE (`ID` = ?);",
        [
            req.body.quantity,
            req.body.quantity * req.body.price,
            req.body.idbook,
        ],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("thay doi du lieu dat hang thanh cong")
                res.send(200)
            }
            else {
                console.log("thay dois du lieu dat hang khong thanh cong")
            }
        });
})

app.post('/order/cart', (req, res) => {
    req.body.dataOrder.forEach(element => {
        pool.query("INSERT INTO `ltw`.`cart` (`ID`, `Name`, `Quantity`, `Price`, `SumPrice`, `Status`,`Image`) VALUES (?,?,?,?,?,?,?);",
            [
                element.ID,
                element.Name,
                element.Quantity,
                element.Price,
                element.Quantity * element.Price,
                00,
                element.Image
            ],
            (err, reslut) => {
                if (err) {
                    console.log(err);
                }
            });
    });
    req.body.dataOrder.forEach(element => {
        pool.query("DELETE FROM `ltw`.`cart_wait` WHERE (`ID` = ?);",
            [
                element.ID,
            ],
            (err, reslut) => {
                if (err) {
                    console.log(err);
                }
            });
    });
    res.send(200);
    console.log("Order thanh cong")
})

app.post('/main/add_cart', (req, res) => {
    pool.query("SELECT * FROM ltw.cart_wait;",
        [req.body.idbook],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                let check = false;
                for (let index = 0; index < reslut.length; index++) {
                    const element = reslut[index];
                    if (element.ID === req.body.idbook) {
                        check = true;
                        pool.query("UPDATE `ltw`.`cart_wait` SET `Quantity` = ?, `SumPrice` = ? WHERE (`ID` = ?);",
                            // eslint-disable-next-line no-undef
                            [
                                element.Quantity + 1,
                                (element.Quantity + 1) * element.Price,
                                element.ID,
                            ],
                            (err, reslut) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (reslut) {
                                    console.log("them dat sach +1 thanh cong")
                                    res.send(200);
                                }
                                else {
                                    console.log('them dat sach +1 khong thanh cong');
                                    res.send(400)
                                }
                            })
                        break;
                    }
                }
                if (check == false) {
                    pool.query("INSERT INTO `ltw`.`cart_wait` (`ID`, `Name`, `Quantity`, `Price`, `SumPrice`,`Image`) VALUES (?, ?, ?, ?, ?,?);",
                        // eslint-disable-next-line no-undef
                        [
                            req.body.idbook,
                            req.body.name,
                            req.body.quantity,
                            req.body.price,
                            req.body.quantity * req.body.price,
                            req.body.image
                        ],
                        (err, reslut) => {
                            if (err) {
                                console.log(err);
                            }
                            if (reslut) {
                                console.log("them dat sach thanh cong")
                                res.send(200);
                            }
                            else {
                                console.log('them dat sach khong thanh cong');
                                res.send(400)
                            }
                        })
                }
            }
            else {
                console.log('them dat sach khong thanh cong');
                res.send(400)
            }
        });

})

app.post('/cart/data_cart', (req, res) => {
    pool.query("SELECT * FROM ltw.cart;",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("lay du lieu dat hang book thanh cong")
                res.send(reslut);
            }
            else {
                console.log('lay du lieu dat hang book khong thanh cong');
            }
        });
})

app.post('/cart/check_cart', (req, res) => {
    pool.query("UPDATE `ltw`.`cart` SET `Status` = ? WHERE (`Idcart` = ?)",
        // eslint-disable-next-line no-undef
        [req.body.status, req.body.idbook],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                if (req.body.status == 2) {
                    console.log("da nhan book thanh cong")
                } else {
                    console.log("Tu choi nhan hang")
                }

                res.send(200);
            }
            else {
                console.log('da nhan book book khong thanh cong');
            }
        });
})

app.post('/cart/get_note_vote_cart', (req, res) => {
    pool.query("SELECT Idcart,ID,Note,Vote FROM ltw.cart",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("Lay danh gia thanh cong")
                res.send(reslut);
            }
            else {
                console.log(' Lay danh gia khong thanh cong');
            }
        });
})

app.post('/cart/delete_cmt', (req, res) => {
    pool.query("UPDATE `ltw`.`cart` SET `Note` = NULL, `Vote` = NULL WHERE (`Idcart` = ?);",
        // eslint-disable-next-line no-undef
        [req.body.ID],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("Xoa danh gia thanh cong")
                res.send(200);
            }
            else {
                console.log('Xoa danh gia khong thanh cong');
            }
        });
})





app.post('/main/databook/name', (req, res) => {
    pool.query("SELECT name FROM ltw.book",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                res.send(reslut)
            }
        });
}
)

app.post('/main/databook/namevsid', (req, res) => {
    pool.query("SELECT idbook,name FROM ltw.book",
        // eslint-disable-next-line no-undef
        [],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                res.send(reslut)
            }
        });
}
)


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
    pool.query("UPDATE `ltw`.`book` SET `name` = ?, `author` =?, `date` = ?, `numberbook` = ?, `image` = ?, `type` = ?, `note` = ? WHERE idbook = ?",
        // eslint-disable-next-line no-undef
        [name, author, date, numberbook, image, type, note, idbook],
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


app.post('/main/NewBook', (req, res) => {
    const name = req.body.name;
    const author = req.body.author;
    const date = req.body.date;
    const numberbook = req.body.numberbook;
    const image = req.body.image;
    const type = req.body.type;
    const note = req.body.note;
    pool.query("INSERT INTO book ( `name`, `author`, `date`, `numberbook`, `image`, `type`, `note`) VALUES ( ?, ?, ?, ?, ?, ?,?);",
        // eslint-disable-next-line no-undef
        [name, author, date, numberbook, image, type, note],
        (err, reslut) => {
            if (err) {
                console.log(err);
            }
            if (reslut) {
                console.log("Tao moi thanh cong")
                res.send(reslut);
            }
            else {
                console.log('Tao moi khong thanh cong');
            }
        });
})


app.listen(3001, () => {
    console.log("running")
})



