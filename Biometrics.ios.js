/**
 * @providesModule Biometrics
 * @flow
 */
'use strict';

import { NativeModules } from 'react-native';
const NativeBiometrics = NativeModules.Biometrics;
const { iOSErrors } = require('./data/errors');
const { getError, BiometricsError, BiometricsUnifiedError } = require('./errors');

/**
 * High-level docs for the Biometrics iOS API can be written here.
 */

export default {
  isSupported(config) {
    return new Promise((resolve, reject) => {
      NativeBiometrics.isSupported(config, (error, biometryType) => {
        if (error) {
          return reject(createError(config, error.message));
        }

        resolve(biometryType);
      });
    });
  },

  getAuthenticateType(config) {
    return new Promise((resolve) => {
      NativeBiometrics.getAuthenticateType(config, (authType) => {
        resolve(authType);
      });
    });
  },

  authenticate(reason, config) {
    const DEFAULT_CONFIG = {
      fallbackLabel: null,
      unifiedErrors: false,
      passwordFallback: false
    };
    const authReason = reason ? reason : ' ';
    const authConfig = Object.assign({}, DEFAULT_CONFIG, config);

    return new Promise((resolve, reject) => {
      NativeBiometrics.authenticate(authReason, authConfig, (error, options) => {
        // Return error if rejected
        if (error) {
          return reject(createError(authConfig, error.message));
        }

        resolve(options);
      });
    });
  }
};

function createError(config, error) {
  const { unifiedErrors } = config || {};

  if (unifiedErrors) {
    return new BiometricsUnifiedError(getError(error));
  }

  const details = iOSErrors[error];
  details.name = error;

  return new BiometricsError(error, details);
}
