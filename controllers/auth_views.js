/** @format */

const express = require('express');
const app = express();
const { UserGame } = require('../models');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const nodemailer = require('nodemailer');
const MailChecker = require('mailchecker');

app.use(flash());

module.exports = {
  registerPage: (req, res) => {
    res.render('register');
  },
  registerViews: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!MailChecker.isValid(req.body.email)) {
      req.flash('error', 'Email is not valid');
      res.redirect('/register');
    } else {
      UserGame.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        avatar: null,
        id_role: 2,
      })
        .then((user) => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'maulanaimammalik4@gmail.com',
              pass: 'eljjzghkqmaveulm',
            },
          });

          const mailOptions = {
            from: 'maulanaimammalik4@gmail.com',
            to: req.body.email,
            subject: 'Welcome Message!',
            html: '<html><h1>Selamat Datang, Terimakasih sudah mendaftar &#9786;</h1></html>',
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email Sent:', info.response);
            }
          });

          req.flash('success', 'Register Success');
          res.redirect('/login');
        })
        .catch((err) => {
          req.flash('error', err.message);
          res.redirect('/register');
        });
    }
  },
};
