//
//  ChromagicBridge.m
//  Snapt
//
//  Created by Marc Stroebel on 2018/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ChromagicBridge.h"
#import <UIKit/UIKit.h>
#import "Chromagic.h"
#import "UIImage+FixOrientation.h"
#import "ChromagicOptions.h"

@implementation ChromagicBridge

RCT_EXPORT_MODULE(Chromagic);

RCT_EXPORT_METHOD(chromaTheImage:(NSString*)imageURI
                  options:(NSDictionary*)optionsDictionary
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  if ([imageURI containsString:@"file:///"]) {
    imageURI = [imageURI stringByReplacingOccurrencesOfString:@"file:///" withString:@"/"];
  }
  
  UIImage* image = [[UIImage imageWithContentsOfFile:imageURI] fixOrientation];
  
  if (image == nil) {
    reject(@"404", @"Image not found at path specified: %@", nil);
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    CGImageRef imageRef = [image CGImage];
    NSUInteger width = CGImageGetWidth(imageRef);
    NSUInteger height = CGImageGetHeight(imageRef);
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    unsigned char *rawData = (unsigned char *)malloc(height * width * 4);
    NSUInteger bytesPerPixel = 4;
    NSUInteger bytesPerRow = bytesPerPixel * width;
    NSUInteger bitsPerComponent = 8;
    CGContextRef context = CGBitmapContextCreate(rawData, width, height,
                                                 bitsPerComponent, bytesPerRow, colorSpace,
                                                 kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
    CGColorSpaceRelease(colorSpace);
    
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), imageRef);
    
    // Create Chromagic object
    Chromagic::IChromaKey *ck = Chromagic::createChromaKey();
    
    // Set up the object with any options that might have been passed in
    ChromagicOptions* options = [self mapDictionaryToOptionsObject:optionsDictionary];
    
    if (options.hue != nil) { ck->setHue(options.hue.floatValue); }
    if (options.tolerance != nil) { ck->setTolerance(options.tolerance.floatValue); }
    if (options.leftSpill != nil && options.rightSpill != nil) { ck->setSpill(options.leftSpill.floatValue, options.rightSpill.floatValue); }
    if (options.saturation != nil) { ck->setSaturation(options.saturation.floatValue); }
    if (options.minValue != nil && options.maxValue != nil) { ck->setValue(options.minValue.floatValue, options.maxValue.floatValue); }
    
    // Actually perform the chroma job on the image
    ck->chroma(width, height, rawData);
    
    CGImageRef img = CGBitmapContextCreateImage(context);
    UIImage *ui_img = [UIImage imageWithCGImage: img];
    
    // Now write the image to the same imageURI that was passed in (except now as a PNG extension)
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"dd-MM-yyyy-HH-mm-ss"];
    NSString *dateString = [formatter stringFromDate:[NSDate date]];
    NSString* oldExtension = @".jpg";
    NSString* newExtension = [NSString stringWithFormat:@"-%@.png", dateString];
    
    NSString* pngImageURI = [imageURI stringByReplacingOccurrencesOfString:oldExtension withString:newExtension];
    [UIImagePNGRepresentation(ui_img) writeToFile:pngImageURI atomically:YES];
    
    CGContextRelease(context);
    free(rawData);
    
    resolve(pngImageURI);
  });
}

- (ChromagicOptions*)mapDictionaryToOptionsObject:(NSDictionary*)dictionary {
  ChromagicOptions* options = [[ChromagicOptions alloc] init];
  
  NSNumberFormatter* f = [[NSNumberFormatter alloc] init];
  f.numberStyle = NSNumberFormatterDecimalStyle;
  
  for (int i = 0; i < [dictionary allKeys].count; i++) {
    NSString* key = [dictionary allKeys][i];
    
    if ([dictionary valueForKey:key] != nil) {
      id value = [dictionary valueForKey:key];
      
      if ([value isKindOfClass:([NSString class])]) {
        [options setValue:[f numberFromString:value] forKey:key];
      } else if ([value isKindOfClass:([NSNumber class])]) {
        [options setValue:value forKey:key];
      }
    }
  }
  
  return options;
}

@end
