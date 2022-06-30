import React from 'react';
import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ message, type }) => (
  <div className={`alert ${type}`} role="alert">
    {message}
  </div>
);

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
}

Alert.defaultProps = {
  message: 'Alert Message',
  type: 'success',
}

export default Alert;
