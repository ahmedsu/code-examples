
#include <cmath>
#include <algorithm>

#include "ChromaKey.h"

#ifndef max
#define max(a,b)            (((a) > (b)) ? (a) : (b))
#endif

#ifndef min
#define min(a,b)            (((a) < (b)) ? (a) : (b))
#endif

namespace Chromagic
{
	IChromaKey *createChromaKey()
	{
		return new ChromaKey();
	}
	
	void destroyChromaKey(IChromaKey *key)
	{
		delete key;
	}
	
	ChromaKey::ChromaKey()
	{
		m_hue = 120.0f;
		m_delta_hue = 30.0f;
		m_min_saturation = 0.2f;
		m_left_spill = m_right_spill = 2.0f;
		m_smoothing = 0.0f;
		
		m_min_value = 0.35f;
		m_max_value = 0.95f;
	}
	
	ChromaKey::~ChromaKey()
	{
	}
	
	void ChromaKey::chroma(int width, int height, unsigned char *rgba)
	{
		process(width, height, rgba);
	}
	
	void ChromaKey::process(int width, int height, unsigned char *buffer)
	{
		float rgb[4];
		float hsv[4];
		
		float h1 = m_hue - m_delta_hue / 2.0;
		float h2 = m_hue + m_delta_hue  / 2.0;
		
		float smoothing = 1.0 - m_smoothing;
		
		float hue_tolerance = m_delta_hue / 2.0;
		hue_tolerance /= 360.0f;
		
		h1 /= 360.0f;
		h2 /= 360.0f;
		
		float s = m_min_saturation;
		
		h1 -= 0.1f * smoothing;
		h2 += 0.1f * smoothing;
		
		unsigned char *bits = 0;
		
		for(int y = 0; y < height; y++)
		{
			bits = buffer + y * 4 * width;
			
			for(int x = 0; x < width; x++)
			{
				rgb[2] = *(bits + x * 4 + 0) / 255.0f;
				rgb[1] = *(bits + x * 4 + 1) / 255.0f;
				rgb[0] = *(bits + x * 4 + 2) / 255.0f;
				rgb[3] = *(bits + x * 4 + 3) / 255.0f;
				
				RGB_to_HSV(rgb, hsv);
				
				if(hsv[0] >= h1 && hsv[0] <= h2)
				{
					if(hsv[1] >= s)
					{
						if(hsv[2] >= m_min_value && hsv[2] <= m_max_value) 
						{
							hsv[3] = 0.0f;
							hsv[1] = 0.0f;
							
							HSV_to_RGB(hsv, rgb);
						}
						else if(hsv[2] < m_min_value)
						{
							// make an attempt to preserve the shadows
							hsv[3] = min(1, m_min_value + 1.0f - (hsv[2] / m_min_value));
							hsv[1] = 0.0f;
							hsv[2] = 0.0f;
							
							HSV_to_RGB(hsv, rgb);
						}
						else if(hsv[2] > m_max_value)
						{
							// make an attempt to preserve the highlights
							hsv[3] = min(1, ((hsv[2] - m_max_value) / (1.0f - m_max_value)));
							hsv[1] = 0.0f;
							hsv[2] = 1.0f;
							
							HSV_to_RGB(hsv, rgb);
						}
						
					}
					else
					{
						hsv[3] = 1.0f;
						hsv[1] = 0.0f;
						HSV_to_RGB(hsv, rgb);
					}
					
					*(bits + x * 4 + 0) = rgb[2] * 255.0f;
					*(bits + x * 4 + 1) = rgb[1] * 255.0f;
					*(bits + x * 4 + 2) = rgb[0] * 255.0f;
					*(bits + x * 4 + 3) = rgb[3] * 255.0f;
				}
			}
		}
	}
	
	void ChromaKey::RGB_to_HSV (float *color, float *hsv)
	{
		float r, g, b, delta;
		float colorMax, colorMin;
		float h = 0, s = 0, v = 0;
		r = color[0];
		g = color[1];
		b = color[2];
		colorMax = max(r,g);
		colorMax = max(colorMax,b);
		colorMin = min(r,g);
		colorMin = min(colorMin,b);
		v = colorMax;
		
		if(colorMax != 0)
		{
			s = (colorMax - colorMin) / colorMax;
		}
		if(s != 0) // if not achromatic
		{
			delta = colorMax - colorMin;
			if (r == colorMax)
			{
				h = (g-b)/delta;
			}
			else if (g == colorMax)
			{
				h = 2.0 + (b-r) / delta;
			}
			else // b is max
			{
				h = 4.0 + (r-g)/delta;
			}
			h *= 60;
			
			if( h < 0)
			{
				h +=360;
			}
			
		}
		
		hsv[0] = h / 360.0; // moving h to be between 0 and 1.
		hsv[1] = s;
		hsv[2] = v;
		hsv[3] = color[3];
	}
	
	void ChromaKey::HSV_to_RGB(float *hsv, float *rgb)
	{
		float color[4] = {0.0f, 0.0f, 0.0f, 0.0f};
		float f,p,q,t;
		float h,s,v;
		float r=0,g=0,b=0;
		float i;
		
		if(hsv[1] == 0)
		{
			if(hsv[2] != 0)
			{
				color[0] = color[1] = color[2] = color[3] = hsv[2];
			}
		}
		else
		{
			h =	hsv[0] * 360.0;
			s =	hsv[1];
			v =	hsv[2];
			
			if (h == 360.0)
			{
				h=0;
			}
			
			h /= 60.0f;
			
			i =	(float)((int)h);
			
			f =	h - i;
			
			p =	v *	(1.0 - s); 
			q =	v *	(1.0 - (s *	f));
			t =	v *	(1.0 - (s *	(1.0 -f)));
			if(i < 0.01f)
			{
				r =	v;
				g =	t;
				b =	p;
			}
			else if(i < 1.01f)
			{
				r =	q;
				g =	v;
				b =	p;
			}
			else if(i < 2.01f)
			{
				r =	p;
				g =	v;
				b =	t;
			}
			else if(i < 3.01f)
			{
				r =	p;
				g =	q;
				b =	v;
			}
			else if(i < 4.01f)
			{
				r =	t;
				g =	p;
				b =	v;
			}
			else if(i < 5.01f)
			{
				r =	v;
				g =	p;
				b =	q;
			}
			
			color[0]	= r;
			color[1]	= g;
			color[2]	= b;
		} 
		color[3] = hsv[3];
		
		rgb[0] = color[0];
		rgb[1] = color[1];
		rgb[2] = color[2];
		rgb[3] = color[3];
	} 
	
}
