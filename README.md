# React Native Biometrics

forked from [naoufal/react-native-biometric-identification](https://github.com/MaDejing/react-native-biometric-identification)

React Native Biometrics is a [React Native](http://facebook.github.io/react-native/) library for authenticating users with biometric authentication methods like Face ID and Biometrics on both iOS and Android (experimental).

![react-native-biometric-identification](https://cloud.githubusercontent.com/assets/1627824/7975919/2c69a776-0a42-11e5-9773-3ea1c7dd79f3.gif)

#### Breaking changes

Please review all changes in the [Changelog](https://github.com/MaDejing/react-native-biometric-identification/blob/master/CHANGELOG.md)

## Documentation

- [Install](https://github.com/MaDejing/react-native-biometric-identification#install)
- [Usage](https://github.com/MaDejing/react-native-biometric-identification#usage)
- [Example](https://github.com/MaDejing/react-native-biometric-identification#example)
- [Fallback](https://github.com/MaDejing/react-native-biometric-identification#fallback)
- [Methods](https://github.com/MaDejing/react-native-biometric-identification#methods)
- [Errors](https://github.com/MaDejing/react-native-biometric-identification#errors)
- [License](https://github.com/MaDejing/react-native-biometric-identification#license)

## Install

```shell
npm i --save react-native-biometric-identification
```

## Usage

### >= 0.60

Autolinking will just do the job.

### < 0.60

#### Mostly automatic

`react-native link react-native-biometric-identification`

#### Manual linking

In order to use Biometric Authentication, you must first link the library to your project.

#### Using Cocoapods (iOS only)

On iOS you can also link package by updating your podfile

```ruby
pod 'BiometricIdentification', :path => "#{node_modules_path}/react-native-biometric-identification"
```

and then run

```shell
$ > cd ios
$ > pod install
```

#### Using native linking

There's excellent documentation on how to do this in the [React Native Docs](http://facebook.github.io/react-native/docs/linking-libraries-ios.html#content).

### Platform Differences

iOS and Android differ slightly in their TouchID authentication.

On Android you can customize the title and color of the pop-up by passing in the **optional config object** with a color and title key to the `authenticate` method. Even if you pass in the config object, iOS **does not** allow you change the color nor the title of the pop-up. iOS does support `passcodeFallback` as an option, which when set to `true` will allow users to use their device pin - useful for people with Face / Touch ID disabled. Passcode fallback only happens if the device does not have touch id or face id enabled.

Error handling is also different between the platforms, with iOS currently providing much more descriptive error codes.

### App Permissions

Add the following permissions to their respective files:

In your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

In your `Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>Enabling Face ID allows you quick and secure access to your account.</string>
```

### Requesting Face ID/Touch ID Authentication

Once you've linked the library, you'll want to make it available to your app by requiring it:

```js
var Biometrics = require('react-native-biometric-identification');
```

or

```js
import Biometrics from 'react-native-biometric-identification';
```

Requesting Face ID/Touch ID Authentication is as simple as calling:

```js
Biometrics.authenticate('to demo this react-native component', optionalConfigObject)
  .then(successOptions => {
    // Success code
  })
  .catch(error => {
    // Failure code
  });
```

## Example

Using Face ID/Touch ID in your app will usually look like this:

```js
import React from "react"
var Biometrics = require('react-native-biometric-identification');
//or import Biometrics from 'react-native-biometric-identification'

class YourComponent extends React.Component {
  _pressHandler() {
    Biometrics.authenticate('to demo this react-native component', optionalConfigObject)
      .then(successOptions => {
        AlertIOS.alert('Authenticated Successfully');
      })
      .catch(error => {
        AlertIOS.alert('Authentication Failed');
      });
  },

  render() {
    return (
      <View>
        ...
        <TouchableHighlight onPress={this._pressHandler}>
          <Text>
            Authenticate with Touch ID
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
};
```

## Methods

### authenticate(reason, config)

Attempts to authenticate with Face ID/Touch ID.
Returns a `Promise` object.

**Arguments**

- `reason` - **optional** - `String` that provides a clear reason for requesting authentication.

- `config` - **optional** - configuration object for more detailed dialog setup:
  - `title` - **Android** - title of confirmation dialog
  - `imageColor` - **Android** - color of fingerprint image
  - `imageErrorColor` - **Android** - color of fingerprint image after failed attempt
  - `authFailDescription` - **Android** - text shown next to the fingerprint image after failed attempt
  - `cancelText` - **Android** - cancel button text
  - `fallbackLabel` - **iOS** - by default specified 'Show Password' label. If set to empty string label is invisible.
  - `unifiedErrors` - return unified error messages (see below) (default = false)
  - `passcodeFallback` - **iOS** - by default set to false. If set to true, will allow use of keypad passcode.

**Examples**

```js
const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  authFailDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

Biometrics.authenticate('to demo this react-native component', optionalConfigObject)
  .then(successOptions => {
    AlertIOS.alert('Authenticated Successfully');
  })
  .catch(error => {
    AlertIOS.alert('Authentication Failed');
  });
```

### isSupported()

Returns a `Promise` that rejects if TouchID is not supported. On iOS resolves with a `biometryType` `String` of `FaceID` or `TouchID`.

**Examples**

```js
const optionalConfigObject = {
  unifiedErrors: false // use unified error messages (default false)
  passcodeFallback: false // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
}

Biometrics.isSupported(optionalConfigObject)
  .then(biometryType => {
    // Success code
    if (biometryType === 'FaceID') {
        console.log('FaceID is supported.');
    } else {
        console.log('TouchID is supported.');
    }
  })
  .catch(error => {
    // Failure code
    console.log(error);
  });
```

## Errors

There are various reasons why biomentric authentication may not be available or fail. `Biometrics.isSupported` and `Biometrics.authenticate` will return an error representing the reason.

#### iOS Errors

Format:

```
{
  name: "TheErrorCode",
  message: "the error message",
  details: {
    name: "TheErrorCode",
    message: "the error message"
  }
}
```

| name                          | message                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `LAErrorAuthenticationFailed` | Authentication was not successful because the user failed to provide valid credentials.                                              |
| `LAErrorUserCancel`           | Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.                                           |
| `LAErrorUserFallback`         | Authentication was canceled because the user tapped the fallback button (Enter Password).                                            |
| `LAErrorSystemCancel`         | Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up. |
| `LAErrorPasscodeNotSet`       | Authentication could not start because the passcode is not set on the device.                                                        |
| `LAErrorTouchIDNotAvailable`  | Authentication could not start because Touch ID is not available on the device                                                       |
| `LAErrorTouchIDNotEnrolled`   | Authentication could not start because Touch ID has no enrolled fingers.                                                             |
| `LAErrorTouchIDLockout`       | Authentication failed because of too many failed attempts.                                                                               |
| `RCTTouchIDUnknownError`      | Could not authenticate for an unknown reason.                                                                                        |
| `RCTTouchIDNotSupported`      | Device does not support Touch ID.                                                                                                    |

_More information on errors can be found in [Apple's Documentation](https://developer.apple.com/library/prerelease/ios/documentation/LocalAuthentication/Reference/LAContext_Class/index.html#//apple_ref/c/tdef/LAError)._

#### Android errors

Format:

```
{
  name: "Touch ID Error",
  message: "Touch ID Error",
  details: "the error message",
  code: "THE_ERROR_CODE"
}
```

isSupported:

| name             | message          | details        | code            |
| ---------------- | ---------------- | -------------- | --------------- |
| `Touch ID Error` | `Touch ID Error` | Not supported. | `NOT_SUPPORTED` |
| `Touch ID Error` | `Touch ID Error` | Not supported. | `NOT_AVAILABLE` |
| `Touch ID Error` | `Touch ID Error` | Not supported. | `NOT_PRESENT`   |
| `Touch ID Error` | `Touch ID Error` | Not supported. | `NOT_ENROLLED`  |

authenticate:

| name             | message          | details                                         | code                                   |
| ---------------- | ---------------- | ----------------------------------------------- | -------------------------------------- |
| `Touch ID Error` | `Touch ID Error` | Not supported                                   | `NOT_SUPPORTED`                        |
| `Touch ID Error` | `Touch ID Error` | Not supported                                   | `NOT_AVAILABLE`                        |
| `Touch ID Error` | `Touch ID Error` | Not supported                                   | `NOT_PRESENT`                          |
| `Touch ID Error` | `Touch ID Error` | Not supported                                   | `NOT_ENROLLED`                         |
| `Touch ID Error` | `Touch ID Error` | failed                                          | `AUTHENTICATION_FAILED`                |
| `Touch ID Error` | `Touch ID Error` | cancelled                                       | `AUTHENTICATION_CANCELED`              |
| `Touch ID Error` | `Touch ID Error` | Too many attempts. Try again Later.             | `FINGERPRINT_ERROR_LOCKOUT`            |
| `Touch ID Error` | `Touch ID Error` | Too many attempts. Fingerprint sensor disabled. | `FINGERPRINT_ERROR_LOCKOUT_PERMANENT`  |
| `Touch ID Error` | `Touch ID Error` | ?                                               | `FINGERPRINT_ERROR_UNABLE_TO_PROCESS`, |
| `Touch ID Error` | `Touch ID Error` | ?                                               | `FINGERPRINT_ERROR_TIMEOUT`,           |
| `Touch ID Error` | `Touch ID Error` | ?                                               | `FINGERPRINT_ERROR_CANCELED`,          |
| `Touch ID Error` | `Touch ID Error` | ?                                               | `FINGERPRINT_ERROR_VENDOR`,            |

#### Unified errors

Format:

```
{
  name: "TouchIDError",
  message: "the error message",
  code: "THE_ERROR_CODE"
}
```

| name           | message                             | code                    |
| -------------- | ----------------------------------- | ----------------------- |
| `TouchIDError` | Authentication failed               | `AUTHENTICATION_FAILED` |
| `TouchIDError` | User canceled authentication        | `USER_CANCELED`         |
| `TouchIDError` | System canceled authentication      | `SYSTEM_CANCELED`       |
| `TouchIDError` | Biometry hardware not present       | `NOT_PRESENT`           |
| `TouchIDError` | Biometry is not supported           | `NOT_SUPPORTED`         |
| `TouchIDError` | Biometry is not currently available | `NOT_AVAILABLE`         |
| `TouchIDError` | Biometry is not enrolled            | `NOT_ENROLLED`          |
| `TouchIDError` | Biometry timeout                    | `TIMEOUT`               |
| `TouchIDError` | Biometry lockout                    | `LOCKOUT`               |
| `TouchIDError` | Biometry permanent lockout          | `LOCKOUT_PERMANENT`     |
| `TouchIDError` | Biometry processing error           | `PROCESSING_ERROR`      |
| `TouchIDError` | User selected fallback              | `USER_FALLBACK`         |
| `TouchIDError` | User selected fallback not enrolled | `FALLBACK_NOT_ENROLLED` |
| `TouchIDError` | Unknown error                       | `UNKNOWN_ERROR`         |

## License

Copyright (c) 2020, Dejing Ma

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
