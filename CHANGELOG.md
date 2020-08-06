<a name="1.1.8"></a>
## 1.1.8 (2020-08-07)
- When not enrolled fingerprint, function isSupport returns "Fingerprint";
- When authenticate error occurs, invoke error callback with errorString & errorCode;
- Authenticate fail 3 times, invoke error callback with errorCode "AUTHENTICATION_FAILED"

<a name="1.1.7"></a>
## 1.1.7 (2020-08-03)
- Transfer auth type(Biometrics OR Passcode) when success
- Add getAuthenticateType function
