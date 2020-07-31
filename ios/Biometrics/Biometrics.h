#import <React/RCTBridgeModule.h>
#import <LocalAuthentication/LocalAuthentication.h>

@interface Biometrics : NSObject <RCTBridgeModule>
    - (NSString *_Nonnull)getBiometryType:(LAContext *_Nonnull)context;
@end
