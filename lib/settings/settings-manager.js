/**
Copyright 2017 LGS Innovations

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

(() => {
  'use strict';

  const EventEmitter = require('events');
  const SettingsMessenger = require('./settings-messenger');
  const CollectionApi = global.helper.MongodbCollectionApi;

  class SettingsManager extends EventEmitter {
    constructor(tag, {scopes=null, readScopes=scopes, writeScopes=scopes}={}) {
      super();
      if ('string' !== typeof(tag) || 0 >= tag.length) {
        throw new TypeError('tag must be a non-empty string.');
      }
      this._tag = tag;
      this._messenger = new SettingsMessenger(this._tag, this, {readScopes: readScopes, writeScopes: writeScopes});
      this._collectionApi = null;
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => {
        this._collectionApi = new CollectionApi(messageCenter, 'settings');
      })
      .then(() => this._messenger.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
      .then(() => this._messenger.unload())
      .then(() => {
        this._collectionApi = null;
      });
    }

    _checkKey(key) {
      return Promise.resolve()
      .then(() => {
        const keyType = typeof(key);
        if ('string' !== keyType && 'symbol' !== keyType) {
          return Promise.reject(new TypeError('key must be a String or Symbol.'));
        } else {
          return key;
        }
      });
    }

    setDefault({key, value}={}) {
      return this._checkKey(key)
      .then(() => this.has({key: key}))
      .then((exists) => {
        if (!exists) {
          return this.set({key: key, value: value});
        }
      });
    }

    has({key}={}) {
      return this._checkKey(key)
      .then(() => this._collectionApi.findOne({tag: this._tag, key: key}))
      .then((setting) => null !== setting);
    }

    get({key, defValue=null}={}) {
      return this._checkKey(key)
      .then(() => this._collectionApi.findOne({tag: this._tag, key: key}))
      .then((r) => {
        if (r) {
          return r.value;
        } else {
          return defValue;
        }
      });
    }

    set({key, path='value', value}={}) {
      return this._checkKey(key)
      .then(() => {
        const filter = {
          tag: this._tag,
          key: key
        };
        const update = {
          $set: {
            [path]: value
          }
        };
        const options = {
          upsert: true,
          returnOriginal: false
        };
        return this._collectionApi.findOneAndUpdate(filter, update, options);
      })
      .then((r) => {
        const setting = r.value;
        this.emit('set', setting.key, setting.value);
        return setting.value;
      });
    }
  }

  module.exports = SettingsManager;
})();
