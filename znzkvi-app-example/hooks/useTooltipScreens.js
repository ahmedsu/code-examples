import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOOLTIP_SCREEN_LOCAL_STORAGE_KEY} from '../config';

const useTooltipScreens = screenName => {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const setScreens = async () => {
    const screens = await AsyncStorage.getItem(
      TOOLTIP_SCREEN_LOCAL_STORAGE_KEY
    );

    if (screens) {
      const parsedScreens = JSON.parse(screens);
      parsedScreens.push(screenName);

      await AsyncStorage.setItem(
        TOOLTIP_SCREEN_LOCAL_STORAGE_KEY,
        JSON.stringify(parsedScreens)
      );
    } else {
      await AsyncStorage.setItem(
        TOOLTIP_SCREEN_LOCAL_STORAGE_KEY,
        JSON.stringify([screenName])
      );
    }

    setTooltipVisible(false);
  };

  useEffect(() => {
    const getScreens = async () => {
      try {
        // await AsyncStorage.removeItem(TOOLTIP_SCREEN_LOCAL_STORAGE_KEY);
        const screens = await AsyncStorage.getItem(
          TOOLTIP_SCREEN_LOCAL_STORAGE_KEY
        );
        const parsedScreens = JSON.parse(screens);

        if (parsedScreens && parsedScreens.includes(screenName)) {
          setTooltipVisible(false);
        }
      } catch (error) {
        console.error('Error retrieving screens from local storage', error);
      }
    };

    getScreens();
  }, [screenName]);

  return [tooltipVisible, setScreens];
};

export default useTooltipScreens;
