var Hook = (function() {
  function Hook(matcher, callback) {
    var _this = this;
    this.$$called = false;
    this.matches = function(action) {
      return _this.$$match(action);
    };
    this.$$match = matcher;
    this.$$callback = callback;
  }
  Hook.prototype.run = function(state) {
    this.$$callback(state, !this.$$called);
    this.$$called = true;
  };
  return Hook;
})();

var HookLink = (function() {
  function HookLink(destroyer) {
    this.$$destroyer = destroyer;
  }
  HookLink.prototype.destroy = function() {
    this.$$destroyer();
  };
  HookLink.prototype.destroyOn = function(scope) {
    var _this = this;
    scope.$on('$destroy', function() {
      _this.$$destroyer();
    });
  };
  return HookLink;
})();

function holdState(state) {
  var $$state = angular.copy(state);
  var get = function() {
    return angular.copy($$state);
  };
  var set = function(partialState) {
    for (var key in partialState) {
      if (partialState.hasOwnProperty(key) && key in $$state) {
        $$state[key] = angular.copy(partialState[key]);
      }
    }
  };
  return { get: get, set: set };
}

if (process.env.NODE_ENV !== 'production') {
  if (!angular) {
    console.warn('Seems like you forgot to load angular. Make sure to load it first before the angularjs-store.');
  }
}
var NgStore = (function() {
  function NgStore(initialState) {
    this.$$hooks = [];
    if (process.env.NODE_ENV !== 'production') {
      if (Object.prototype.toString.call(initialState) !== '[object Object]') {
        console.warn(
          'Initializing the store with a non-object state is not recommended.\n',
          "If you're trying to create a store with primitive type of state, try to wrap it with object.",
        );
      }
    }
    this.$$stateHolder = holdState(initialState);
  }
  NgStore.prototype.copy = function() {
    return this.$$stateHolder.get();
  };
  NgStore.prototype.hook = function(query, callback) {
    var _this = this;
    var matcher;
    if (typeof query === 'string') {
      matcher =
        query === '*'
          ? function() {
              return true;
            }
          : function(action) {
              return action === query;
            };
    } else if (Array.isArray(query)) {
      if (process.env.NODE_ENV !== 'production') {
        var nonStringQueryItem = query.find(function(queryItem) {
          return typeof queryItem !== 'string';
        });
        if (nonStringQueryItem) {
          console.warn(
            'Hook action query contains non-string value (' + nonStringQueryItem + ').\n',
            'Using array as query must only contains string.',
          );
        }
      }
      matcher = function(action) {
        return query.includes(action);
      };
    } else if (query instanceof RegExp) {
      matcher = function(action) {
        return query.test(action);
      };
    } else {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Hook action query must be a either string, array of string, or regular expression.');
      }
      throw new TypeError('Invalid hook query.');
    }
    if (!angular.isFunction(callback)) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Hook callback must be a function.');
      }
      throw new TypeError('Invalid hook callback.');
    }
    var hook = new Hook(matcher, callback);
    this.$$hooks.push(hook);
    hook.run(this.$$stateHolder.get());
    return new HookLink(function() {
      _this.$$hooks.splice(_this.$$hooks.indexOf(hook), 1);
    });
  };
  NgStore.prototype.dispatch = function(action, state) {
    var partialState = angular.isFunction(state) ? state(this.$$stateHolder.get()) : state;
    if (process.env.NODE_ENV !== 'production') {
      if (Object.prototype.toString.call(partialState) !== '[object Object]') {
        console.warn(
          "You're about to update the state using a non-object value.\n",
          'Did you use non-object state?\n',
          "If yes, it's not recommended.\n",
          'Primitive type state must wrap with object.',
        );
      }
    }
    this.$$stateHolder.set(partialState);
    var newState = this.$$stateHolder.get();
    this.$$hooks
      .filter(function(hook) {
        return hook.matches(action);
      })
      .forEach(function(hook) {
        hook.run(newState);
      });
  };
  return NgStore;
})();

export default NgStore;
//# sourceMappingURL=angularjs-store.js.map
