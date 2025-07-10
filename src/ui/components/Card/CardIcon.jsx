import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const backgroundMap = {
  primary: '#ab47bc',
  info: '#26c6da',
  success: '#66bb6a',
  warning: '#ffa726',
  danger: '#ef5350',
  rose: '#ec407a',
};

const BaseCardIcon = styled('div')(({ theme, ownerState }) => {
  const { color } = ownerState;
  const background = backgroundMap[color] ?? theme.palette.grey[300];

  return {
    borderRadius: '3px',
    backgroundColor: background,
    padding: '15px',
    marginTop: '-20px',
    marginRight: '15px',
    float: 'left',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  };
});

export default function CardIcon(props) {
  const { className, children, color, ...rest } = props;

  const ownerState = { color };
  const cardIconClasses = clsx(className);

  return (
    <BaseCardIcon className={cardIconClasses} ownerState={ownerState} {...rest}>
      {children}
    </BaseCardIcon>
  );
}

CardIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'rose']),
  children: PropTypes.node,
};
