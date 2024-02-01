import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

function Divider({ size = 10, direction = 'h' }) {
  return <View style={direction === 'h' ? { width: size } : { height: size }} />;
}

Divider.propTypes = {
  size: PropTypes.number,
  direction: PropTypes.string,
};

export default Divider;
