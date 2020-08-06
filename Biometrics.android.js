import { NativeModules, processColor } from 'react-native';
import { androidApiErrorMap, androidModuleErrorMap } from './data/errors';
import { getError, BiometricsError, BiometricsUnifiedError } from './errors';
const NativeBiometrics = NativeModules.BiometricsAuth;

export default {
  isSupported(config) {
    return new Promise((resolve, reject) => {
      NativeBiometrics.isSupported(
        (error, code) => {
          return reject(createError(config, error, code));
        },
        (biometryType) => {
          return resolve(biometryType);
        }
      );
    });
  },

  getAuthenticateType() {
    return new Promise((resolve) => {
      resolve('AuthenticationTypeBiometrics');
    });
  },

  authenticate(reason, config) {
    var DEFAULT_CONFIG = {
      title: 'Authentication Required',
      imageColor: '#1306ff',
      imageErrorColor: '#ff0000',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      authFailDescription: 'Not recognized. Try again.',
      cancelText: 'Cancel',
      unifiedErrors: false
    };
    var authReason = reason ? reason : ' ';
    var authConfig = Object.assign({}, DEFAULT_CONFIG, config);
    var imageColor = processColor(authConfig.imageColor);
    var imageErrorColor = processColor(authConfig.imageErrorColor);

    authConfig.imageColor = imageColor;
    authConfig.imageErrorColor = imageErrorColor;

    return new Promise((resolve, reject) => {
      NativeBiometrics.authenticate(
        authReason,
        authConfig,
        (error, code) => {
          return reject(createError(authConfig, error, code));
        },
        options => {
          return resolve({
            authType: 'AuthenticationTypeBiometrics',
          });
        }
      );
    });
  }
};

function createError(config, error, code) {
  const { unifiedErrors } = config || {};
  const errorCode = androidApiErrorMap[code] || androidModuleErrorMap[code];

  if (unifiedErrors) {
    return new BiometricsUnifiedError(getError(errorCode));
  }

  return new BiometricsError('Touch ID Error', error, errorCode);
}
