
var password = document.getElementById('registerPassword');
var passwordConfirmation = document.getElementById('passwordConfirmation');

var form = document.forms['register'];

var validate = {

  password: password,
  passwordConfirmation: passwordConfirmation,

  checkPasswords: function() {
    var span = document.getElementById('passwordConfirmationMessage');

    if (password.value !== passwordConfirmation.value) {
      span.style.visibility = "visible";
      return false;
    } else {
      span.style.visibility = "hidden";
      return true;
    }
  }

};

validate.password.onkeyup = validate.checkPasswords;
validate.passwordConfirmation.onkeyup = validate.checkPasswords;

form.onsubmit = validate.checkPasswords;

validate.checkPasswords();