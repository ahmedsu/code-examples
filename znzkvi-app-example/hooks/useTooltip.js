import React from 'react';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Metrics} from '@themes';
import Popover from 'react-native-popover-view';

const {width} = Dimensions.get('screen');
const rightOffset = width * 0.04;
const leftOffset = width * 0.08;

export const TooltipIcon = React.forwardRef(({onPress, color}, ref) => (
  <TouchableOpacity
    style={{
      paddingTop: 4,
      paddingLeft: Metrics.xs,
      paddingRight: Metrics.m
    }}
    onPress={onPress}>
    <Icon
      ref={ref}
      name={'alert-circle-outline'}
      color={color ?? Colors.darkgray}
      size={15}
    />
  </TouchableOpacity>
));

export const InfoPopOver = React.forwardRef(
  (
    {
      children,
      infoRef,
      onClose,
      isVisible,
      mode,
      placement,
      popoverStyle,
      left = leftOffset,
      right = rightOffset,
      verticalOffset = 6
    },
    ref
  ) => {
    return (
      <Popover
        ref={ref}
        mode={mode}
        placement={placement}
        popoverStyle={{
          backgroundColor: '#e8e8e8',
          paddingLeft: 15,
          paddingTop: 9,
          paddingRight: Metrics.rg,
          paddingBottom: Metrics.rg,
          borderRadius: Metrics.rg,
          shadowOffset: {
            width: 0,
            height: 4
          },
          shadowRadius: 4,
          shadowOpacity: 0.5,
          ...popoverStyle
        }}
        verticalOffset={verticalOffset}
        displayAreaInsets={{left, right}}
        backgroundStyle={{backgroundColor: 'transparent'}}
        from={infoRef}
        isVisible={isVisible}
        onRequestClose={onClose}>
        <View>{children}</View>
      </Popover>
    );
  }
);

const useTooltip = () => {
  const infoRef = React.useRef(null);
  const popupRef = React.useRef(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const onCloseCallback = React.useCallback(() => {
    setShowTooltip(false);
  }, []);

  const onOpenCallback = React.useCallback(() => {
    setShowTooltip(true);
  }, []);

  return {
    onOpenCallback,
    showTooltip,
    onCloseCallback,
    infoRef,
    popupRef
  };
};

export default useTooltip;
