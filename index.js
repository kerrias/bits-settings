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

  const path = require('path');
  const BaseHelperApi = global.helper.BaseHelperApi;

  const SETTINGS_MANAGER_FILEPATH = path.resolve(__dirname, './lib/settings/settings-manager');

  class ModuleApp {
    constructor() {
      this._baseHelperApi = null;
    }

    load(messageCenter) {
      return Promise.resolve()
      .then(() => {
        this._baseHelperApi = new BaseHelperApi(messageCenter);
      })
      .then(() => this._baseHelperApi.add({name: 'SettingsManager', filepath: SETTINGS_MANAGER_FILEPATH}));
    }

    unload() {
      return Promise.resolve()
      .then(() => {
        this._baseHelperApi = null;
      });
    }
  }

  module.exports = new ModuleApp();
})();
