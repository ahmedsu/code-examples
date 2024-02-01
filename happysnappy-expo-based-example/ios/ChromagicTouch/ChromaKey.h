
#ifndef _CHROMAKEY_H_
#define _CHROMAKEY_H_

#include "Chromagic.h"

namespace Chromagic
{
	class ChromaKey : public Chromagic::IChromaKey
	{
		
	public:
		ChromaKey();
		virtual ~ChromaKey();
		
		void chroma(int width, int height, unsigned char *rgba);
		
		void setHue(float hue)					{ m_hue = hue;										}
		float hue()								{ return m_hue;										}
		
		void setTolerance(float tolerance)		{ m_delta_hue = tolerance;							}
		float tolerance()						{ return m_delta_hue;								}
		
		void setSaturation(float saturation)	{ m_min_saturation = saturation;					}
		float saturation()						{ return m_min_saturation;							}
		
		void setValue(float min, float max)		{ m_min_value = min; m_max_value = max;				}
		float minValue()						{ return m_min_value;								}
		float maxValue()						{ return m_max_value;								}
		
		void setSpill(float left, float right)	{ m_left_spill = left; m_right_spill = right;		}
		float leftSpill()						{ return m_left_spill;								}
		float rightSpill()						{ return m_right_spill;								}
		
	protected:
		float m_hue;
		float m_delta_hue;
		float m_min_saturation;
		float m_left_spill;
		float m_right_spill;
		
		float m_min_value;
		float m_max_value;
		
		float m_smoothing;
		
		
		void process(int width, int height, unsigned char *video_frame);
		
	private:
		void RGB_to_HSV (float *color, float *hsv);
		void HSV_to_RGB(float *hsv, float *rgb);
		
	};
}

#endif
