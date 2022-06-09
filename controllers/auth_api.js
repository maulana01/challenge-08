/** @format */

const { UserGame } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const MailChecker = require('mailchecker');
require('dotenv').config();

module.exports = {
  register: async (req, res) => {
    // Our register logic starts here
    try {
      // Get user input
      const { username, email, password } = req.body;

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database

      if (!MailChecker.isValid(req.body.email)) {
        res.status(401).json({ error: 'Email Tidak Valid' });
      } else {
        const user = await UserGame.create({
          username,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
          id_role: req.body.id_role ? req.body.id_role : 2,
        });

        // Create token
        const token = jwt.sign({ id_user: user.id_user }, process.env.TOKEN_KEY, {
          expiresIn: '15m',
        });
        // save user token
        user.token = token;

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

        // return new user
        res.status(200).json({ message: 'Berhasil Membuat User Game', result: user });
      }
    } catch (err) {
      res.status(500).json({ message: 'Gagal Create User Game', err: err.message });
    }
    // Our register logic ends here
  },
  login: async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { username, password } = req.body;

      // Validate user input
      if (!(username && password)) {
        res.status(400).send('All input is required');
      }
      // Validate if user exist in our database
      const user = await UserGame.findOne({
        where: {
          username: username,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign({ id_user: user.id_user, username, id_role: user.id_role }, process.env.TOKEN_KEY, {
          expiresIn: '15m',
        });

        // save user token
        user.token = token;

        // user
        res.status(200).json(user);
      } else {
        res.status(400).send('Username atau Password salah!');
      }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  },
};
