/****************************************************/
/*           IOServer-mongodb - v2.1.0              */
/*                                                  */
/*    Connect to your MongoDB using FIbers          */
/****************************************************/
/*             -    Copyright 2018    -             */
/*                                                  */
/*   License: Apache v 2.0                          */
/*   @Author: Ben Mz                                */
/*   @Email: benoit (at) prohacktive (dot) io       */
/*                                                  */
/****************************************************/
(function() {
  var Fiber, IOServer_Mongodb, Mongo;

  Mongo = require('mongo-sync');

  Fiber = require('fibers');

  module.exports = IOServer_Mongodb = (function() {
    function IOServer_Mongodb(arg) {
      var authMethod, authSource, db, e, error, error1, host, options, port, pwd, ref, user;
      ref = arg != null ? arg : {}, host = ref.host, port = ref.port, user = ref.user, pwd = ref.pwd, db = ref.db, authMethod = ref.authMethod, authSource = ref.authSource;
      host = host || '127.0.0.1';
      try {
        port = Number(port) || 27017;
      } catch (error) {
        e = error;
        throw new Error('Invalid port.');
      }
      if (!db) {
        throw new Error('Database not set.');
      }
      options = {};
      options.user = user || false;
      options.password = pwd || false;
      options.authMethod = authMethod || 'SCRAM-SHA-1';
      options.authSource = authSource || 'admin';
      try {
        this._server = new Mongo.Server(host + ":" + port);
        this._client = new Mongo.Client(this._server, options);
        Fiber((function(_this) {
          return function() {
            return _this._database = _this._client.connect("mongodb://" + host + ":" + port + "/" + db);
          };
        })(this)).run();
      } catch (error1) {
        e = error1;
        throw new Error(e.stack);
      }
    }

    IOServer_Mongodb.prototype._close = function() {
      return this._server.close();
    };

    IOServer_Mongodb.prototype.collection = function(name) {
      return this._database.getCollection(name);
    };

    return IOServer_Mongodb;

  })();

}).call(this);
