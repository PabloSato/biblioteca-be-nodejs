const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// ----------------------- FREE ROUTES -------------------------------
// -- FREE ROUTES --
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// -- LOG OUT ROUTES --
router.post('/logout', authController.logout);
// ---------------------- AUTHENTICATED ROUTES -----------------------
router.use(authController.protect);
// ---------------- ME ROUTES ----------------
router.get('/me', userController.getMe, userController.getUser);

// -------------- ADMIN ROUTES ---------------
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
