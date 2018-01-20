"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require('sqlite3').verbose();
function database_connect() {
    var db = new sqlite3.Database('/home/fedor/WebstormProjects/node-vk-bot/utils/chinook.db', sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the chinook database.');
    });
    return db;
}
function help_save(message, email, phone, vk, tg) {
    // строки для формирования sql запроса
    var var_string = '(message';
    var val_string = '(' + '"' + message + '"';
    if (email) {
        var_string += ', email';
        val_string += ', ' + '"' + email + '"';
    }
    if (phone) {
        var_string += ', phone';
        val_string += ', ' + '"' + phone + '"';
    }
    if (vk) {
        var_string += ', vk';
        val_string += ', ' + '"' + vk + '"';
    }
    if (tg) {
        var_string += ', tg';
        val_string += ', ' + '"' + tg + '"';
    }
    var_string += ')';
    val_string += ')';
    var db = database_connect();
    //Perform INSERT operation.
    db.all('INSERT into help' + var_string +
        ' VALUES ' + val_string, function (err) {
        if (err) {
            console.log('insert');
            console.error(err.message);
        }
    });
    db.close();
}
exports.help_save = help_save;
;
function check_registration(email, password, vk, tg) {
    if (email && password) {
        // user from web-site
    }
    if (vk) {
        var db = database_connect();
        db.all('SELECT id FROM users WHERE vk=' + vk + ';', function (err, rows) {
            if (err) {
                throw err;
            }
            if (rows == []) {
                db.all('INSERT INTO users (vk, english_tutor) VALUES (' + vk + ', -1)', function (err) {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('insert into users table');
                });
                db.all('');
            }
            else {
                return rows[0]['id'];
            }
        });
        db.all('SELECT id FROM users WHERE vk=' + vk + ';', function (err, rows) {
            if (err) {
                throw err;
            }
            return rows[0]['id'];
        });
    }
    if (tg) {
        // user from telegram
    }
    return -1;
}
exports.check_registration = check_registration;
function update_course_status(user_id) {
    var db = database_connect();
    db.all('SELECT english_tutor FROM users WHERE id=' + user_id, function (err, rows) {
        if (err) {
            throw err;
        }
        if (rows[0]['english_tutor'] != -1) {
            return 'У вас уже есть доступ к курсу \n можете продолжить обучение';
        }
        else {
            db.all('UPDATE users SET english_tutor=0 WHERE id=' + user_id, function (err, rows) {
                if (err) {
                    throw err;
                }
            });
            return 'Теперь у вас есть доступ к курсу! \n можете начать обучение';
        }
    });
    return 'Поздравляем, теперь у вас есть доступ к курсу!';
}
exports.update_course_status = update_course_status;
function check_token(token) {
    var db = database_connect();
    db.all('SELECT userId FROM referral_share WHERE token=' + token, function (err, rows) {
        if (err) {
            throw err;
        }
        if (rows != []) {
            db.run('DELETE FROM referral_share WHERE token=' + token);
            return true;
        }
        else {
            return false;
        }
    });
    return false;
}
exports.check_token = check_token;
check_registration(undefined, undefined, 123321, undefined);
//help_save( "test_help1", undefined, undefined, 21423543, undefined);
/*
db.run('CREATE TABLE help ( ID integer PRIMARY KEY, message text, userID text, answered integer );');
db.run('SELECT * FROM help');

db.all('SELECT * FROM help', [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});
*/
