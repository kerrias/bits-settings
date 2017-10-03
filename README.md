Settings
===
This BITS module provides helpers to quickly stand up settings for a module. It has two main features; backend SettingsManager and a browser custom element that will sync with the backend. The settings in the `SettingsManager` are namespaced by the provided `tag`. The `tag` allows many modules in the system to all use the `SettingsManager` and not conflict with common settings names.

## Settings Manager
The `SettingsManager` is added to the `global` object on load. The module and create its own settings manager by inheriting or encapsulating the `SettingsManager`.
``` javascript
const SettingsManager = global.helper.SettingsManager;
const KEY_REQUEST_TIMEOUT = 'requestTimeout';
const DEFAULT_REQUEST_TIMEOUT = 2;

class MySettingsManager {
  static get TAG() {
    return 'example#MySettings';
  }

  static get SCOPES() {
    return ['example'];
  }

  constructor() {
    this._settings = new SettingsManager(MySettingsManager.TAG, {scopes: MySettingsManager.SCOPES});
  }

  load(messageCenter) {
    return Promise.resolve()
    .then(() => this._settings.load(messageCenter))
    .then(() => this._settings.setDefault({key: KEY_REQUEST_TIMEOUT, value: DEFAULT_REQUEST_TIMEOUT}));
  }

  unload() {
    return Promise.resolve()
    .then(() => this._settings.unload());
  }

  getTimeoutDuration() {
    return this._settings.get({key: KEY_REQUEST_TIMEOUT, defValue: DEFAULT_REQUEST_TIMEOUT});
  }

  setTimeoutDuration(requestTimeout) {
    return this._settings.set({key: KEY_REQUEST_TIMEOUT, value: requestTimeout});
  }
}
```

## settings-document element
This module as provides an element that will sync a setting to the UI

``` HTML
<settings-document tag="example#MySettings" key="requestTimeout" data="{{requestTimeout}}"></settings-document>
<paper-input label="Request Timeout (s)" type="number" value="{{requestTimeout}}"></paper-input>
```
