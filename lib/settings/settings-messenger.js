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

  const Messenger = global.helper.Messenger;

  class SettingsMessenger extends Messenger {
    constructor(tag, manager, {scopes=null, readScopes=scopes, writeScopes=scopes}={}) {
      super();
      if ('string' !== typeof(tag) || 0 >= tag.length) {
        throw new TypeError('tag must be a non-empty string.');
      }
      this._tag = tag;
      this._readScopes = readScopes;
      this._manager = manager;
      this.addRequestListener(`${this._tag} get`, {scopes: this._readScopes}, this._get.bind(this));
      this.addRequestListener(`${this._tag} set`, {scopes: writeScopes}, this._set.bind(this));
      this.addEmitterEventListener(this._manager, 'set', this._onSet.bind(this));
    }

    _get(metadata, request) {
      return this._manager.get(request);
    }

    _set(metadata, request) {
      return this._manager.set(request);
    }

    _onSet(key, value) {
      this.sendEvent(`${this._tag} set`, {scopes: this._readScopes}, key, value);
    }
  }

  module.exports = SettingsMessenger;
})();
