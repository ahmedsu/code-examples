//
//  ChromagicOptions.h
//  Snapt
//
//  Created by Marc Stroebel on 2019/02/20.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ChromagicOptions : NSObject

@property (nonatomic) NSNumber* hue;
@property (nonatomic) NSNumber* tolerance;
@property (nonatomic) NSNumber* leftSpill;
@property (nonatomic) NSNumber* rightSpill;
@property (nonatomic) NSNumber* saturation;
@property (nonatomic) NSNumber* minValue;
@property (nonatomic) NSNumber* maxValue;

@end

NS_ASSUME_NONNULL_END
