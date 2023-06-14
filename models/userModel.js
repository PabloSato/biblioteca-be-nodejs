const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  hash_email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must have more or equal than 8 characters'],
    select: false, // => para que no se devuelva nunca cuando hacemos peticiones
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Solo funciona en create y Save!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// --------------------------------------------- 1 - MIDDLEWARE --------------------------------
// -- document middleware --
userSchema.pre('save', async function (next) {
  // Encriptamos el password cuando el campo ha sido cambiado (updated)
  if (!this.isModified('password')) return next(); // => si el pass no se ha modificado, salimos

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; // => Nunca persistimos este campo en la BBDD, solo lo queremos para validar

  next();
});

userSchema.pre('save', function (next) {
  // Hasheamos el email
  if (this.isNew) {
    this.hash_email = md5(this.email);
    return next();
  }

  // Cambiamos el passwordConfirmChangeAt a NOW, para cuando se hacen las comprobaciones
  if (!this.isModified('password')) return next(); // => Si no se ha modificado nada o es nuevo, pasamos de esto

  this.passwordChangeAt = Date.now() - 1000; // Siempre quitamos un segundo de gracia para darle tiempo a persistir en la BBDD la info

  next();
});
// -- query middleware --
// userSchema.pre(/^find/, function (next) {});
// --------------------------------------------- 2 - METHODS -------------------------------
// los instance methods son métodos que están disponibles en todos los documentos de la colección

/**
 * Método que usamos en el login para comprobar si el password que nos pasan es el correcto
 * Debemos pasarlo el password candidato y el this.password (este está a select: false, no lo obtendríamos)
 */
userSchema.methods.correctPassword = async function (try_pass, user_pass) {
  // compare() => compara dos strings a los que hashe, si son iguales devuevle true
  return await bcrypt.compare(try_pass, user_pass);
};

/**
 * Método que cambia el valor de passwordChangeAt tras la modificación del password.
 * Tenemos que pasarle el JWTTimestamp del token generado, para comprobarlo
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // Sólo los documentos que han modificado el password tienen seteado el campo passwordChangeAt
  if (this.passwordChangeAt) {
    // el timestamp nos devuevle la fecha en milisec, pero el ttl del token está en sec. Hay que modificarlo
    // Para pasar de milisec a sec, dividimos por 1000
    // Al parseInt hay que especificarle la base del número (en este caso base 10)
    const changeTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    // Comprobamos si el tiempo resultant es mayor que el ttl del token
    // en caso de TRUE, es que SI se ha cambiado el password
    return JWTTimestamp < changeTimestamp;
  }
  // FALSE => significa que NO se ha cambiado el password
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Generamos un token random
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Lo encriptamos por seguridad y lo guardamos en la BBDD
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Le damos un TTL
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // => 10 minutos a partir de NOW
  // Devolvemos el nuevo token
  return resetToken;
};

// --------------------------------------------- 0 - EXPORT --------------------------------
const User = mongoose.model('User', userSchema);
module.exports = User;
