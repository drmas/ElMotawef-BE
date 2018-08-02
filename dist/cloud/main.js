"use strict";

var _expoServerSdk = require("expo-server-sdk");

var _expoServerSdk2 = _interopRequireDefault(_expoServerSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var expo = new _expoServerSdk2.default();

Parse.Cloud.beforeSave("Alarms", function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var haajQuery, haaj, query, manager, messages;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.object.isNew()) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.success());

          case 2:

            // find haaj
            haajQuery = new Parse.Query("Haaj");

            query.equalTo("qr", reg.object.get("qr"));
            _context.next = 6;
            return haajQuery.first();

          case 6:
            haaj = _context.sent;


            if (!haaj) {
              res.error({
                error: "لم يتم العثور على الحاج"
              });
            }

            query = new Parse.Query("_User");

            query.equalTo("objectId", haaj.get("objectId"));
            query.include("manager");

            _context.next = 13;
            return query.first();

          case 13:
            manager = _context.sent;


            req.object.set("maanger", manager);

            if (manager) {
              messages = manager.get("tokens").filter(function (token) {
                return _expoServerSdk2.default.isExpoPushToken(token);
              });

              messages = messages.map(function (token) {
                return {
                  to: token,
                  sound: "default",
                  body: "\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u062D\u0627\u062C \u0636\u0645\u0646 \u0645\u062C\u0645\u0648\u0639\u062A\u0643 - " + req.body.get("message")
                };
              });
              expo.sendPushNotificationsAsync(messages);
            }

            res.success();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());