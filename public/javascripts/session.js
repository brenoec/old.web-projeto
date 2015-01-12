
var session = {
  active: false,
  user: '',

  isStorageAvailable: function() {
    return (typeof(Storage) !== "undefined");
  },

  open: function(user) {

    if (!this.isStorageAvailable) {

      return;
    }

    this.active = true;
    this.user = user;

    window.localStorage.session = JSON.stringify(this);

    return true;
  },

  close: function() {

    if (!this.isStorageAvailable) {

      return;
    }

    this.active = false;

    window.localStorage.session = JSON.stringify(this);

    return true;
  },

  get: function() {

    if (!this.isStorageAvailable) {

      return;
    }

    return window.localStorage.session;
  },

  check: function() {
    if (this.active) {
      window.location.assign("/start");
    }
  }
};
