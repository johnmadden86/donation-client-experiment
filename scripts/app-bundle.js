define('app',['exports', 'aurelia-framework', 'services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function App(ds) {
      _classCallCheck(this, App);

      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.loggedIn = false;
      this.newUser = false;

      this.donationService = ds;
    }

    App.prototype.login = function login(e) {
      console.log('Trying to log in ' + this.email);
      var status = this.donationService.authenticate(this.email, this.password);
      this.prompt = status.message;
      this.loggedIn = status.success;
    };

    App.prototype.switchNewUser = function switchNewUser() {
      var innerHtml = 'Sign Up';
      this.newUser = !this.newUser;
      if (this.newUser) {
        innerHtml = 'Login';
      }
      document.getElementById('newUser').innerHTML = innerHtml;
    };

    App.prototype.signUp = function signUp(e) {
      this.donationService.register(this.firstName, this.lastName, this.email, this.password);
      console.log('Registering new user: ' + this.email);
      this.loggedIn = true;
    };

    App.prototype.logout = function logout() {
      console.log('Logging out`');
      this.email = '';
      this.password = '';
      this.loggedIn = false;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/donation-service',['exports', 'aurelia-framework', './fixtures', './messages', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _fixtures, _messages, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DonationService = (_dec = (0, _aureliaFramework.inject)(_fixtures2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function DonationService(data, ea) {
      _classCallCheck(this, DonationService);

      this.donations = [];
      this.methods = [];
      this.candidates = [];
      this.users = {};
      this.total = 0;

      this.donations = data.donations;
      this.candidates = data.candidates;
      this.methods = data.methods;
      this.users = data.users;
      this.ea = ea;
    }

    DonationService.prototype.authenticate = function authenticate(email, password) {
      var status = {
        success: false,
        message: ''
      };

      if (this.users[email]) {
        if (this.users[email].password === password) {
          status.success = true;
          status.message = 'logged in';
        } else {
          status.message = 'Incorrect password';
        }
      } else {
        status.message = 'Unknown user';
      }

      return status;
    };

    DonationService.prototype.donate = function donate(amount, method, candidate) {
      var donation = {
        amount: amount,
        method: method,
        candidate: candidate
      };
      this.total += parseInt(amount, 10);
      this.ea.publish(new _messages.TotalUpdate(this.total));
      this.donations.push(donation);
      console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method + '. Total so far: ' + this.total);
    };

    DonationService.prototype.addCandidate = function addCandidate(firstName, lastName, office) {
      var candidate = {
        firstName: firstName,
        lastName: lastName,
        office: office
      };
      this.candidates.push(candidate);
      console.log('New candidate added: ' + candidate.firstName + ' ' + candidate.lastName + ', ' + candidate.office);
    };

    DonationService.prototype.register = function register(firstName, lastName, email, password) {
      this.users[email] = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
    };

    return DonationService;
  }()) || _class);
  exports.default = DonationService;
});
define('services/fixtures',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Fixtures = function Fixtures() {
    _classCallCheck(this, Fixtures);

    this.methods = ['Cash', 'PayPal'];
    this.candidates = [{
      firstName: 'Lisa',
      lastName: 'Simpson'
    }, {
      firstName: 'Bart',
      lastName: 'Simpson'
    }];
    this.donations = [{
      amount: 23,
      method: 'cash',
      candidate: this.candidates[0]
    }, {
      amount: 212,
      method: 'paypal',
      candidate: this.candidates[1]
    }];
    this.users = {
      'homer@simpson.com': {
        firstName: 'Homer',
        lastName: 'Simpson',
        email: 'homer@simpson.com',
        password: 'secret'
      },
      'marge@simpson.com': {
        firstName: 'Marge',
        lastName: 'Simpson',
        email: 'marge@simpson.com',
        password: 'secret'
      }
    };
  };

  exports.default = Fixtures;
});
define('viewmodels/candidates',['exports', 'aurelia-framework', '../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Candidate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Candidate = exports.Candidate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Candidate(ds) {
      _classCallCheck(this, Candidate);

      this.firstName = '';
      this.lastName = '';
      this.office = '';

      this.donationService = ds;
    }

    Candidate.prototype.addCandidate = function addCandidate() {
      this.donationService.addCandidate(this.firstName, this.lastName, this.office);
    };

    return Candidate;
  }()) || _class);
});
define('viewmodels/donate',['exports', 'aurelia-framework', '../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Donate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Donate = exports.Donate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Donate(ds) {
      _classCallCheck(this, Donate);

      this.amount = 0;
      this.methods = [];
      this.selectedMethod = '';
      this.candidates = [];
      this.selectedCandidate = '';

      this.donationService = ds;
      this.methods = ds.methods;
      this.selectedMethod = this.methods[0];
      this.candidates = ds.candidates;
      this.selectedCandidate = this.candidates[0];
    }

    Donate.prototype.makeDonation = function makeDonation() {
      this.donationService.donate(this.amount, this.selectedMethod, this.selectedCandidate);
    };

    return Donate;
  }()) || _class);
});
define('viewmodels/report',['exports', 'aurelia-framework', '../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Report = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Report = exports.Report = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function Report(ds) {
    _classCallCheck(this, Report);

    this.donations = [];

    this.donationService = ds;
    this.donations = this.donationService.donations;
  }) || _class);
});
define('viewmodels/stats',['exports', 'aurelia-framework', '../services/messages', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _messages, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Stats = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Stats = exports.Stats = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function Stats(ea) {
    var _this = this;

    _classCallCheck(this, Stats);

    this.total = 0;

    ea.subscribe(_messages.TotalUpdate, function (msg) {
      _this.total = msg.total;
    });
  }) || _class);
});
define('viewmodels/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TotalUpdate = exports.TotalUpdate = function TotalUpdate(total) {
    _classCallCheck(this, TotalUpdate);

    this.total = total;
  };
});
define('services/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TotalUpdate = exports.TotalUpdate = function TotalUpdate(total) {
    _classCallCheck(this, TotalUpdate);

    this.total = total;
  };
});
define('viewmodels/login',[], function () {
  "use strict";
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><div class=\"ui container\"><nav class=\"ui inverted menu\"><header class=\"header item\"><a href=\"/\">Donation</a></header><div class=\"right menu\"><div show.bind=\"!loggedIn\"><a id=\"newUser\" class=\"item\" click.trigger=\"switchNewUser()\">Sign Up</a></div><div show.bind=\"loggedIn\"><a id=\"logout\" class=\"item\" click.trigger=\"logout()\">Logout</a></div></div></nav><section class=\"ui four column stackable grid basic segment\"><div show.bind=\"!loggedIn\" class=\"ui row\"><aside show.bind=\"!newUser\" class=\"ui five wide column\"><compose view=\"./viewmodels/login.html\"></compose></aside><article show.bind=\"newUser\" class=\"ui five wide column\"><compose view=\"./viewmodels/sign-up.html\"></compose></article></div><div show.bind=\"loggedIn\" class=\"ui row\"><aside class=\"column\"><compose view-model=\"./viewmodels/donate\"></compose></aside><article class=\"column\"><compose view-model=\"./viewmodels/report\"></compose></article><article class=\"column\"><compose view-model=\"./viewmodels/candidates\"></compose></article><article class=\"column\"><compose view-model=\"./viewmodels/stats\"></compose></article></div></section></div></template><script></script>"; });
define('text!viewmodels/candidates.html', ['module'], function(module) { module.exports = "<template><form submit.trigger=\"addCandidate()\" class=\"ui form stacked segment\"><h3 class=\"ui dividing header\">Add a Candidate</h3><div class=\"field\"><label>First Name</label><input value.bind=\"firstName\"></div><div class=\"field\"><label>Last Name</label><input value.bind=\"lastName\"></div><div class=\"field\"><label>Office</label><input value.bind=\"office\"></div><button class=\"ui blue submit button\">Add</button></form></template>"; });
define('text!viewmodels/donate.html', ['module'], function(module) { module.exports = "<template><form submit.trigger=\"makeDonation()\" class=\"ui form stacked segment\"><h3 class=\"ui dividing header\">Make a Donation</h3><div class=\"grouped inline fields\"><div class=\"field\"><label>Amount</label><input type=\"number\" value.bind=\"amount\"></div></div><h4 class=\"ui dividing header\">Select Method</h4><div class=\"grouped inline fields\"><div class=\"field\" repeat.for=\"method of methods\"><div class=\"ui radio checkbox\"><input type=\"radio\" model.bind=\"method\" checked.bind=\"selectedMethod\"><label>${method}</label></div></div><label class=\"ui circular label\"> ${selectedMethod} </label></div><h4 class=\"ui dividing header\">Select Candidate</h4><div class=\"grouped inline fields\"><div class=\"field\" repeat.for=\"candidate of candidates\"><div class=\"ui radio checkbox\"><input type=\"radio\" model.bind=\"candidate\" checked.bind=\"selectedCandidate\"><label>${candidate.lastName}, ${candidate.firstName}</label></div></div><label class=\"ui circular label\"> ${selectedCandidate.firstName} ${selectedCandidate.lastName}</label></div><button class=\"ui blue submit button\">Donate</button></form></template>"; });
define('text!viewmodels/report.html', ['module'], function(module) { module.exports = "<template><article class=\"ui stacked segment\"><h3 class=\"ui dividing header\">Donations to Date</h3><table class=\"ui celled table segment\"><thead><tr><th>Amount</th><th>Method donated</th><th>Candidate</th></tr></thead><tbody><tr repeat.for=\"donation of donations\"><td> ${donation.amount}</td><td> ${donation.method}</td><td> ${donation.candidate.lastName}, ${donation.candidate.firstName}</td></tr></tbody></table></article></template>"; });
define('text!viewmodels/stats.html', ['module'], function(module) { module.exports = "<template><section class=\"ui stacked statistic segment\"><div class=\"value\"> ${total} </div><div class=\"label\">Donated</div></section></template>"; });
define('text!viewmodels/login.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"login($event)\" class=\"ui stacked segment form\"><h3 class=\"ui header\">Log-in</h3><div class=\"field\"><label>Email</label><input placeholder=\"Email\" value.bind=\"email\"></div><div class=\"field\"><label>Password</label><input type=\"password\" value.bind=\"password\"></div><button class=\"ui blue submit button\">Login</button><h3>${prompt}</h3></form></template>"; });
define('text!viewmodels/sign-up.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"signUp($event)\" class=\"ui stacked segment form\"><h3 class=\"ui header\">Sign Up</h3><div class=\"field\"><label>First Name</label><input placeholder=\"First Name\" value.bind=\"firstName\"></div><div class=\"field\"><label>Last Name</label><input placeholder=\"Last Name\" value.bind=\"lastName\"></div><div class=\"field\"><label>Email</label><input placeholder=\"Email\" value.bind=\"email\"></div><div class=\"field\"><label>Password</label><input type=\"password\" value.bind=\"password\"></div><button class=\"ui blue submit button\">Sign Up</button><h3>${prompt}</h3></form></template>"; });
//# sourceMappingURL=app-bundle.js.map