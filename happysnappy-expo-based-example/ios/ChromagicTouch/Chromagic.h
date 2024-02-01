
#ifndef _CHROMAGIC_H_
#define _CHROMAGIC_H_

namespace Chromagic
{
	// The main chroma key class.
	class IChromaKey
	{
	public:
		IChromaKey()				{}
		virtual ~IChromaKey()		{}
		
		// Given an rgba block of data, this function adjusts the alpha in place to achieve the keying.
		virtual void chroma(int width, int height, unsigned char *rgba) = 0;
		
		// The Value of the Hue to center the chroma key around.  This should be a value between
		//  0.0f and 360.0f representing the degrees, where 0.0 is Red, 120.0 is Green, and 240.0 is Blue.
		// The default is 120.0.
		virtual void setHue(float hue) = 0;
		virtual float hue() = 0;
		
		// Value in degrees the chroma key will vary.  This effectively increases the pie slice in
		//  HSV color space to chroma out.  
		// The default is 30.0.
		virtual void setTolerance(float tolerance) = 0;
		virtual float tolerance() = 0;
		
		// The minimum saturation to begin chroma keying out.  This value is normalized between
		//  0.0 and 1.0. 
		// The default is 0.2.
		virtual void setSaturation(float saturation) = 0;
		virtual float saturation() = 0;
		
		// Determines the min and maxmimum saturation to be excluded.  The min saturation is used to exclude
		//  shadows from being chroma keyed out, and the max to keep whites from being chroma keyed out.
		//  The default values are 0.35 and 0.95
		virtual void setValue(float min, float max) = 0;
		virtual float minValue() = 0;
		virtual float maxValue() = 0;
		
		// The number of pixels to adjust for chroma spill on the left and right sides of the foreground.
		// The default is 2.0 and 2.0.
		virtual void setSpill(float left, float right) = 0;
		virtual float leftSpill() = 0;
		virtual float rightSpill() = 0;
	};	
	
	IChromaKey *createChromaKey();
	void destroyChromaKey(IChromaKey *key);
	
}

#endif
