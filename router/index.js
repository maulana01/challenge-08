/** @format */

const router = require('express').Router();
const { UserGameBiodata } = require('../models');
const auth = require('../middleware/auth');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const storageImage = multer.diskStorage({
  destination: 'images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + req.body.username + path.extname(file.originalname));
  },
});
const uploadImage = multer({
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed'));
    }
  },
});

const storageVideo = multer.diskStorage({
  destination: 'videos',
  filename: function (req, file, cb) {
    cb(null, 'Gameplay-ID_User-' + req.body.id_user + '-' + Date.now() + path.extname(file.originalname));
  },
});
const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'video/mp4' || file.mimetype == 'video/x-msvideo' || file.mimetype == 'video/quicktime') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .mp4, .avi and .mov format allowed'));
    }
  },
});

const {
  getAllUserGameApi,
  getUserGameByIdApi,
  getUserGameByLoggedInUserApi,
  createUserGameApi,
  updateUserGameApi,
  deleteUserGameApi,
} = require('../controllers/user_game_api');

const {
  getAllUserGameViews,
  getUserGameByUserLoggedinViews,
  getUserGameByIdViews,
  createUserGameFormViews,
  createUserGameViews,
  updateUserGameViews,
  deleteUserGameViews,
} = require('../controllers/user_game_views');

const {
  getAllUserGameHistoryApi,
  getUserGameHistoryByIdApi,
  createUserGameHistoryApi,
  deleteUserGameHistoryByHistoryIdApi,
  deleteUserGameHistoryByUserGameIdApi,
  getUserGameHistoryByLoggedInUserApi,
} = require('../controllers/user_game_history_api');

const {
  getAllUserGameHistoryViews,
  getUserGameHistoryByUserLoggedinViews,
  createUserGameHistoryFormViews,
  createUserGameHistoryViews,
  deleteUserGameHistoryByHistoryIdViews,
  deleteUserGameHistoryByUserGameIdViews,
} = require('../controllers/user_game_history_views');

const {
  getAllUserGameBiodataApi,
  getUserGameBiodataByIdApi,
  getUserGameBiodataByLoggedInUserApi,
  createUserGameBiodataApi,
  updateUserGameBiodataApi,
  deleteUserGameBiodataApi,
} = require('../controllers/user_game_biodata_api');

const {
  getAllUserGameBiodataViews,
  getUserGameBiodataByUserLoggedinViews,
  getUserGameBiodataByIdViews,
  createUserGameBiodataFormViews,
  createUserGameBiodataViews,
  updateUserGameBiodataViews,
  deleteUserGameBiodataViews,
  createUserGameBiodataFormUserRoleViews,
  createUserGameBiodataUserRoleViews,
} = require('../controllers/user_game_biodata_views');

const { errorPage } = require('../controllers/error');

const { registerPage, registerViews } = require('../controllers/auth_views');

const { register, login } = require('../controllers/auth_api');
const { diskStorage } = require('multer');
const {
  sendEmailForgotPassword,
  resetPasswordPage,
  updatePassword,
  sendEmailForgotPasswordApi,
  recoverCodePage,
  recoverCodeVerif,
} = require('../controllers/forgot_password');

// const { login, loginPage } = require('../controllers/auth');

function AuthorizationAdminApi(req, res, next) {
  if (req.user.id_role == 1) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized Access' });
}

function AuthorizationUserGameBiodataApi(req, res, next) {
  if (req.user.id_role == 2) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized Access' });
}

function checkAlreadyExistBiodataApi(req, res, next) {
  UserGameBiodata.findOne({
    where: {
      id_user: req.user.id_user,
    },
  }).then((userGameBiodata) => {
    if (userGameBiodata) {
      res.status(400).json({ error: 'Data anda sudah ada' });
    } else {
      next();
    }
  });
}

/* REST API ENDPOINT */

// User_Games Endpoint
router.get('/api/get-users-games', auth, getAllUserGameApi);
// router.get('/api/get-user-games-byloggedinuser', auth, getUserGameByLoggedInUserApi);
router.get('/api/get-user-games/:id', auth, getUserGameByIdApi);
router.post(
  '/api/create-user-games',
  auth,
  AuthorizationAdminApi,
  uploadImage.single('avatar'),
  createUserGameApi,
  (error, req, res, next) => {
    res.status(415).json({ message: 'Gagal Create User Game', err: error.message });
  }
);
router.put(
  '/api/update-user-games/:id',
  auth,
  AuthorizationAdminApi,
  uploadImage.single('avatar'),
  updateUserGameApi,
  (error, req, res, next) => {
    res.status(415).json({ message: 'Gagal Create User Game', err: error.message });
  }
);
router.delete('/api/delete-user-games/:id', auth, AuthorizationAdminApi, deleteUserGameApi);

// // User_Game_Histories Endpoint
router.get('/api/get-user-game-histories', auth, getAllUserGameHistoryApi);
// router.get('/api/get-user-game-history-byloggedinuser', auth, getUserGameHistoryByLoggedInUserApi);
router.get('/api/get-user-game-history/:id', auth, getUserGameHistoryByIdApi);
router.post(
  '/api/create-user-game-history',
  auth,
  AuthorizationAdminApi,
  uploadVideo.single('gameplay_video'),
  createUserGameHistoryApi,
  (error, req, res, next) => {
    res.status(415).json({ message: 'Gagal Create User Game', err: error.message });
  }
);
router.delete('/api/delete-user-game-history-id/:id', auth, AuthorizationAdminApi, deleteUserGameHistoryByHistoryIdApi);
router.delete('/api/delete-user-game-history-usergameid/:id', auth, AuthorizationAdminApi, deleteUserGameHistoryByUserGameIdApi);

// // User_Game_Biodatas Endpoint
router.get('/api/get-user-game-biodatas', auth, getAllUserGameBiodataApi);
// router.get('/api/get-user-game-biodata-byloggedinuser', auth, getUserGameBiodataByLoggedInUserApi);
router.get('/api/get-user-game-biodata/:id', auth, getUserGameBiodataByIdApi);
// router.post(
//   '/api/create-user-game-biodata-roleuser',
//   auth,
//   AuthorizationUserGameBiodataApi,
//   checkAlreadyExistBiodataApi,
//   createUserGameBiodataApi
// );
router.post('/api/create-user-game-biodata', auth, AuthorizationAdminApi, createUserGameBiodataApi);
router.put('/api/update-user-game-biodata/:id', auth, AuthorizationAdminApi, updateUserGameBiodataApi);
router.delete('/api/delete-user-game-biodata/:id', auth, AuthorizationAdminApi, deleteUserGameBiodataApi);

router.post('/api/register', register);
router.post('/api/login', login);

// router.post('/api/forgot-password-email', checkNotAuthenticated, sendEmailForgotPasswordApi);
// router.post('/api/reset-password', checkNotAuthenticated, updatePassword);

/* ================================================================================================ */

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/view');
  }
  next();
}

function UserGameAuthorizationAdminViews(req, res, next) {
  if (req.user.dataValues.id_role == 1) {
    return next();
  }
  res.redirect('/viewroleuser');
}

function UserGameBiodataAuthorizationAdminViews(req, res, next) {
  if (req.user.dataValues.id_role == 1) {
    return next();
  }
  res.redirect('/viewroleuser/usergamesbiodata');
}

function UserGameHistoryAuthorizationAdminViews(req, res, next) {
  if (req.user.dataValues.id_role == 1) {
    return next();
  }
  res.redirect('/viewroleuser/usergameshistory');
}

function UserGameAuthorizationUserViews(req, res, next) {
  if (req.user.dataValues.id_role == 2) {
    return next();
  }
  res.redirect('/view');
}

function UserGameBiodataAuthorizationUserViews(req, res, next) {
  if (req.user.dataValues.id_role == 2) {
    return next();
  }
  res.redirect('/view/usergamesbiodata');
}

function checkAlreadyExistBiodataViews(req, res, next) {
  UserGameBiodata.findOne({
    where: {
      id_user: req.user.dataValues.id_user,
    },
  }).then((userGameBiodata) => {
    if (userGameBiodata) {
      res.redirect('/view/usergamesbiodata');
    } else {
      next();
    }
  });
}

function UserGameHistoryAuthorizationUserViews(req, res, next) {
  if (req.user.dataValues.id_role == 2) {
    return next();
  }
  res.redirect('/view/usergameshistory');
}

// views Endpoint
router.get('/view', checkAuthenticated, UserGameAuthorizationAdminViews, getAllUserGameViews);
router.get('/viewroleuser', checkAuthenticated, UserGameAuthorizationUserViews, getUserGameByUserLoggedinViews);
router.get('/view/usergames/create', checkAuthenticated, UserGameAuthorizationAdminViews, createUserGameFormViews);
router.get('/view/usergames/update/:id', checkAuthenticated, getUserGameByIdViews);
router.post('/view/usergames', checkAuthenticated, uploadImage.single('avatar'), createUserGameViews, (error, req, res, next) => {
  res.render('error', { status: res.status(415), err: error.message });
});
router.post('/view/usergames/:id', checkAuthenticated, uploadImage.single('avatar'), updateUserGameViews, (error, req, res, next) => {
  res.render('error', { status: res.status(415), err: error.message });
});
router.get('/view/usergames/delete/:id', checkAuthenticated, UserGameAuthorizationAdminViews, deleteUserGameViews);

router.get('/view/usergamesbiodata', checkAuthenticated, UserGameBiodataAuthorizationAdminViews, getAllUserGameBiodataViews);
router.get('/viewroleuser/usergamesbiodata', checkAuthenticated, UserGameBiodataAuthorizationUserViews, getUserGameBiodataByUserLoggedinViews);
router.get(
  '/viewroleuser/usergamesbiodata/create',
  checkAuthenticated,
  UserGameBiodataAuthorizationUserViews,
  checkAlreadyExistBiodataViews,
  createUserGameBiodataFormUserRoleViews
);
router.get('/view/usergamesbiodata/create', checkAuthenticated, UserGameBiodataAuthorizationAdminViews, createUserGameBiodataFormViews);
router.get('/view/usergamesbiodata/update/:id', checkAuthenticated, getUserGameBiodataByIdViews);
router.post('/viewroleuser/usergamesbiodata', checkAuthenticated, createUserGameBiodataUserRoleViews);
router.post('/view/usergamesbiodata', checkAuthenticated, createUserGameBiodataViews);
router.post('/view/usergamesbiodata/:id', checkAuthenticated, updateUserGameBiodataViews);
router.get('/view/usergamesbiodata/delete/:id', checkAuthenticated, UserGameBiodataAuthorizationAdminViews, deleteUserGameBiodataViews);

router.get('/view/usergameshistory', checkAuthenticated, UserGameHistoryAuthorizationAdminViews, getAllUserGameHistoryViews);
router.get('/viewroleuser/usergameshistory', checkAuthenticated, UserGameHistoryAuthorizationUserViews, getUserGameHistoryByUserLoggedinViews);
router.get('/view/usergameshistory/create', checkAuthenticated, UserGameHistoryAuthorizationAdminViews, createUserGameHistoryFormViews);
router.post(
  '/view/usergameshistory',
  checkAuthenticated,
  uploadVideo.single('gameplay_video'),
  createUserGameHistoryViews,
  (error, req, res, next) => {
    res.render('error', { status: res.status(415), err: error.message });
  }
);
router.get(
  '/view/usergameshistory/deletebyhistory/:id',
  checkAuthenticated,
  UserGameHistoryAuthorizationAdminViews,
  deleteUserGameHistoryByHistoryIdViews
);
router.get(
  '/view/usergameshistory/deletebyusergame/:id',
  checkAuthenticated,
  UserGameHistoryAuthorizationAdminViews,
  deleteUserGameHistoryByUserGameIdViews
);
router.get('/view/error', errorPage);

router.get('/register', checkNotAuthenticated, registerPage);
router.post('/register', checkNotAuthenticated, registerViews);

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/view',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// const otp = require('otp-generator');
// router.get('/tes', (req, res) => {
// const otpg = otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true });
// console.log(otpg);
//   console.log(Date.now(), '-', Date.now() + 1 * 60000);
// });

router.get('/forgot-password', checkNotAuthenticated, (req, res) => {
  res.render('forgot-password');
});

router.post('/forgot-password-email', checkNotAuthenticated, sendEmailForgotPassword);

router.get('/recover-code', checkNotAuthenticated, recoverCodePage);
router.post('/recover-code', checkNotAuthenticated, recoverCodeVerif);

router.get('/reset-password', checkNotAuthenticated, resetPasswordPage);

router.post('/reset-password', checkNotAuthenticated, updatePassword);

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

router.all('*', (req, res) => {
  res.redirect('/login');
});

module.exports = router;
