import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const WidgetFrame = ({ children, fn }) => {
  useEffect(() => {
    if (fn) {
      fn();
      console.log('Widget was loaded in useEffect.');
    }
  }, [fn]);

  return <div>{children}</div>;
};

WidgetFrame.propTypes = {
  children: PropTypes.element.isRequired,
  fn: PropTypes.func,
};

export default WidgetFrame;
