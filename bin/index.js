/****************************************************/
/*        IOServer-mongodb-sync - v1.2.0            */
/*                                                  */
/*    Connect to your MongoDB using FIbers          */
/****************************************************/
/*             -    Copyright 2017    -             */
/*                                                  */
/*   License: Apache v 2.0                          */
/*   @Author: Ben Mz                                */
/*   @Email: benoit (at) webboards (dot) fr         */
/*                                                  */
/****************************************************/

(function() {
  var DBConnector, Fiber, Mongo;

  Mongo = require('mongo-sync');

  Fiber = require('fibers');

  module.exports = DBConnector = (function() {
    function DBConnector(arg) {
      var authMethod, db, e, error, error1, host, port, pwd, ref, user;
      ref = arg != null ? arg : {}, host = ref.host, port = ref.port, user = ref.user, pwd = ref.pwd, db = ref.db, authMethod = ref.authMethod;
      host = host || '127.0.0.1';
      try {
        port = Number(port) || 27017;
      } catch (error) {
        e = error;
        throw 'Invalid port.';
      }
      if (!db) {
        throw 'Database not set.';
      }
      user = user || false;
      pwd = pwd || false;
      authMethod = authMethod || 'SCRAM-SHA-1';
      try {
        this._server = new Mongo.Server(host + ":" + port);
        Fiber((function(_this) {
          return function() {
            _this._database = _this._server.db(db);
            if (user && pwd) {
              return _this._database.auth(user, pwd, {
                authMechanism: authMethod
              });
            }
          };
        })(this)).run();
      } catch (error1) {
        e = error1;
        throw e;
      }
    }

    DBConnector.prototype._close = function() {
      return this._server.close();
    };

    DBConnector.prototype.collection = function(name) {
      return this._database.getCollection(name);
    };

    return DBConnector;

  })();

}).call(this);
