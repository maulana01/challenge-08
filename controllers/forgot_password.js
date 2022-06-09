/** @format */

const { UserGame } = require('../models');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const MailChecker = require('mailchecker');

module.exports = {
  sendEmailForgotPassword: async (req, res) => {
    UserGame.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          // const token = crypto.randomBytes(20).toString('hex');
          let msgType, msg;
          const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true });
          UserGame.update(
            {
              otp,
              // resetPasswordExpires: Date.now() + 3600000,
              otp_exp: Date.now() + 15 * 60000,
            },
            {
              where: {
                email: req.body.email,
              },
            }
          )
            .then(() => {
              let getUsername = user.username;
              // console.log('ini username', getUsername);
              let htmlEmailTemplate = `
              <div style="font-family: Helvetica,Arial,sans-serif;min-width:800px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Game Dashboard</a>
                  </div>
                  <p style="font-size:1.1em">Hello ${getUsername.charAt(0).toUpperCase() + getUsername.slice(1)},</p>
                  <p>Kami menerima permintaan untuk mengatur ulang kata sandi Anda.
                  Masukkan kode reset kata sandi berikut: </p>
                  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                  <p style="text-align:center; font-style:italic; color:#808080;">kode reset hanya akan berlaku selama 15 menit</p>
                  <p>Jika Anda tidak meminta untuk mengatur ulang kata sandi, abaikan email ini.</p>
                  <p style="font-size:0.9em;">Regards,<br />Game Dashboard</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>US Game Inc</p>
                    <p>1600 Amphitheatre Parkway</p>
                    <p>California</p>
                  </div>
                </div>
              </div>`;
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'maulanaimammalik4@gmail.com',
                  pass: 'eljjzghkqmaveulm',
                },
              });

              // console.log('ini req protocol', req.protocol);
              // console.log('ini req full url', req.originalUrl);
              // console.log('ini req origin', req.get('origin'));
              // console.log('ini list all req', req);

              const mailOptions = {
                from: 'maulanaimammalik4@gmail.com',
                to: req.body.email,
                subject: `${otp} merupakan kode pemulihan akun Anda`,
                // html:
                //   '<html><h1>Klik link berikut untuk mengubah password anda</h1><a href=' +
                //   req.get('origin') +
                //   '/reset-password?u=' +
                //   user.id_user +
                //   '&n=' +
                //   otp +
                //   '>Reset Password</a></html>',
                html: htmlEmailTemplate,
              };

              // console.log(mailOptions.html);

              if (!MailChecker.isValid(req.body.email)) {
                msgType = 'error';
                msg = 'Email tidak terkirim, Pastikan Email anda valid';
                // res.render('error', { msg: 'Email tidak terkirim, Pastikan Email anda valid' });
                req.flash(msgType, msg);
                res.redirect('/forgot-password');
              } else {
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email Sent:', info.response);
                    msgType = 'success';
                    msg = 'Email terkirim, silahkan cek email anda';
                    req.flash(msgType, msg);
                    res.redirect('/recover-code?u=' + user.id_user);
                  }
                });
              }
            })
            .catch((err) => {
              // res.render('error', { status: res.status(500), err: err.message });
              res.status(500);
              req.flash('error', err.message);
              res.redirect('/forgot-password');
            });
        } else {
          // res.render('error', { status: res.status(401), err: 'Email not found' });
          res.status(401);
          req.flash('error', 'Email not found');
          res.redirect('/forgot-password');
        }
      })
      .catch((err) => {
        // res.render('error', { status: res.status(500), err: err.message });
        res.status(500);
        req.flash('error', err.message);
        res.redirect('/forgot-password');
      });
  },
  recoverCodePage: async (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.query.u,
      },
    })
      .then((user) => {
        if (user) {
          // console.log('ini hasil get user', user);
          res.render('verif-otp', {
            u: req.query.u,
          });
        } else {
          // res.render('error', { status: res.status(401), err: 'ID User tidak valid' });
          res.status(401);
          req.flash('error', 'ID User tidak valid');
          res.redirect('/forgot-password');
        }
      })
      .catch((err) => {
        res.render('error', { status: res.status(500), err: `User dengan ID ${req.query.u} tidak ditemukan` });
        // console.log('ini er', err);
        // res.status(500);
        // req.flash('error', `User dengan ID ${req.query.u} tidak ditemukan`);
        // res.redirect('/forgot-password');
      });
  },
  recoverCodeVerif: async (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.body.u,
        otp: req.body.otp,
      },
    })
      .then((user) => {
        if (user) {
          // console.log('ini otp exp', user.dataValues.otp_exp);
          if (user.dataValues.otp_exp < Date.now()) {
            // res.render('error', { status: res.status(401), err: 'OTP Expired' });
            res.status(401);
            req.flash('error', 'OTP Expired');
            res.redirect('/recover-code?u=' + user.id_user);
          } else {
            res.redirect('/reset-password?u=' + req.body.u + '&n=' + req.body.otp);
          }
        } else {
          // res.render('error', {
          //   status: res.status(401),
          //   err: 'OTP tidak valid',
          // });
          res.status(401);
          req.flash('error', 'OTP tidak valid');
          res.redirect('/recover-code?u=' + req.body.u);
        }
      })
      .catch((err) => {
        res.render('error', {
          status: res.status(500),
          err: err.message,
        });
      });
  },
  resetPasswordPage: async (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.query.u,
        otp: req.query.n,
        // resetPasswordExpires: { $gt: Date.now() },
        // otp_exp: { $gt: Date.now() },
      },
    })
      .then((user) => {
        if (user) {
          // console.log('ini hasil get user', user);
          if (user.otp_exp < Date.now()) {
            // res.render('error', { status: res.status(401), err: 'OTP Expired' });
            res.status(401);
            req.flash('error', 'OTP Expired');
            res.redirect('/recover-code?u=' + user.id_user);
          } else {
            res.render('reset-password', {
              u: user.dataValues.id_user,
              n: user.dataValues.otp,
            });
          }
        } else {
          // res.render('error', { status: res.status(401), err: 'OTP tidak valid' });
          res.status(401);
          req.flash('error', 'OTP tidak valid');
          res.redirect('/recover-code?u=' + req.query.u);
        }
      })
      .catch((err) => {
        // res.render('error', { status: res.status(500), err: 'OTP tidak ada' });
        res.status(500);
        req.flash('error', 'OTP tidak ada');
        res.redirect('/recover-code?u=' + req.query.u);
      });
  },
  updatePassword: async (req, res) => {
    let msgType, msg;
    UserGame.findOne({
      where: {
        otp: req.body.n,
        // resetPasswordExpires: { $gt: Date.now() },
        // otp_exp: { $gt: Date.now() },
      },
    })
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
              msgType = 'error';
              msg = 'Password sudah pernah digunakan';
              req.flash(msgType, msg);
              res.redirect('/reset-password?u=' + req.body.u + '&n=' + req.body.n);
              // res.render('error', { status: res.status(401), err: 'Password sudah digunakan' });
            } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  res.render('error', { status: res.status(500), err: err.message });
                } else {
                  UserGame.update(
                    {
                      password: hash,
                      otp: null,
                      otp_exp: null,
                    },
                    {
                      where: {
                        otp: req.body.n,
                      },
                    }
                  )
                    .then(() => {
                      msgType = 'success';
                      msg = 'Password berhasil diubah';
                      req.flash(msgType, msg);
                      res.redirect('/login');
                      // res.render('login', { status: res.status(200), msg: 'Password berhasil diubah' });
                    })
                    .catch((err) => {
                      res.render('error', { status: res.status(500), err: err.message });
                    });
                }
              });
            }
          });
        } else {
          // res.render('error', { status: res.status(401), err: 'OTP tidak valid' });
          res.status(401);
          req.flash('error', 'OTP tidak valid');
          res.redirect('/recover-code?u=' + req.body.u);
        }
      })
      .catch((err) => {
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
};
/* ============================== NOT USED ============================== */
//   sendEmailForgotPasswordApi: async (req, res) => {
//     UserGame.findOne({
//       where: {
//         email: req.body.email,
//       },
//     })
//       .then((user) => {
//         if (user) {
//           const token = crypto.randomBytes(20).toString('hex');
//           UserGame.update(
//             {
//               forgotPasswordToken: token,
//               // resetPasswordExpires: Date.now() + 3600000,
//             },
//             {
//               where: {
//                 email: req.body.email,
//               },
//             }
//           )
//             .then(() => {
//               let msgType, msg;
//               const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                   user: 'maulanaimammalik4@gmail.com',
//                   pass: 'eljjzghkqmaveulm',
//                 },
//               });

//               // console.log('ini req protocol', req.protocol);
//               // console.log('ini req full url', req.originalUrl);
//               // console.log('ini req origin', req.get('origin'));
//               // console.log('ini list all req', req);

//               const mailOptions = {
//                 from: 'maulanaimammalik4@gmail.com',
//                 to: req.body.email,
//                 subject: 'Forgot Password Message!',
//                 html:
//                   '<html><h1>Klik link berikut untuk mengubah password anda</h1><a href=' +
//                   req.get('origin') +
//                   '/reset-password?token=' +
//                   token +
//                   '>Reset Password</a></html>',
//               };

//               // console.log(mailOptions.html);

//               transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                   console.log(error);
//                   msgType = 'error';
//                   msg = 'Email tidak terkirim, Pastikan Email anda valid';
//                 } else {
//                   console.log('Email Sent:', info.response);
//                   msgType = 'success';
//                   msg = 'Email terkirim, silahkan cek email anda';
//                 }
//                 res.status(200).json({ message: msg });
//               });
//             })
//             .catch((err) => {
//               res.status(500).json({ err: err.message });
//             });
//         } else {
//           res.status(401).json({ err: 'Email not found' });
//         }
//       })
//       .catch((err) => {
//         res.status(500).json({ err: err.message });
//       });
//   },
//   resetPasswordApi: async (req, res) => {
//     UserGame.findOne({
//       where: {
//         forgotPasswordToken: req.query.token,
//         // resetPasswordExpires: { $gt: Date.now() },
//       },
//     })
//       .then((user) => {
//         if (user) {
//           // console.log('ini hasil get user', user);
//           res.render('reset-password', {
//             token: user.dataValues.forgotPasswordToken,
//           });
//         } else {
//           res.status(401).json({ err: 'Token tidak valid' });
//         }
//       })
//       .catch((err) => {
//         res.status(500).json({ err: 'Token tidak ada' });
//       });
//   },
//   updatePasswordApi: async (req, res) => {
//     let msgType, msg;
//     UserGame.findOne({
//       where: {
//         forgotPasswordToken: req.body.forgotPasswordToken,
//         // resetPasswordExpires: { $gt: Date.now() },
//       },
//     })
//       .then((user) => {
//         if (user) {
//           bcrypt.compare(req.body.password, user.password, (err, result) => {
//             if (result) {
//               msgType = 'error';
//               msg = 'Password sudah pernah digunakan';
//               // req.flash(msgType, msg);
//               // res.redirect('/reset-password?token=' + req.body.forgotPasswordToken);
//               res.status(401).json({ err: msg });
//               // res.render('error', { status: res.status(401), err: 'Password sudah digunakan' });
//             } else {
//               bcrypt.hash(req.body.password, 10, (err, hash) => {
//                 if (err) {
//                   res.status(500).json({ err: err.message });
//                 } else {
//                   UserGame.update(
//                     {
//                       password: hash,
//                       forgotPasswordToken: null,
//                       // resetPasswordExpires: null,
//                     },
//                     {
//                       where: {
//                         forgotPasswordToken: req.body.forgotPasswordToken,
//                       },
//                     }
//                   )
//                     .then(() => {
//                       msgType = 'success';
//                       msg = 'Password berhasil diubah';
//                       // req.flash(msgType, msg);
//                       // res.redirect('/login');
//                       res.status(200).json({ message: msg });
//                       // res.render('login', { status: res.status(200), msg: 'Password berhasil diubah' });
//                     })
//                     .catch((err) => {
//                       res.status(500).json({ err: err.message });
//                     });
//                 }
//               });
//             }
//           });
//         } else {
//           res.status(401).json({ err: 'Token tidak valid' });
//         }
//       })
//       .catch((err) => {
//         res.status(500).json({ err: err.message });
//       });
//   },
// };

/* ============================== NOT USED ============================== */
