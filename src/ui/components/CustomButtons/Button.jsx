import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const backgroundMap = {
  primary: '#9c27b0',
  info: '#00acc1',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  rose: '#e91e63',
  white: '#ffffff',
};

const colorMap = {
  white: '#555',
  transparent: 'inherit',
};

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !['colorType', 'simple', 'round', 'block', 'justIcon', 'sizeType'].includes(prop),
})(({ theme, colorType, simple, round, block, justIcon, sizeType }) => {
  const bg = backgroundMap[colorType];
  const fg = colorMap[colorType] || theme.palette.common.white;

  const sizeStyles = {
    sm: {
      padding: '6px 16px',
      fontSize: '0.6875rem',
    },
    lg: {
      padding: '18px 36px',
      fontSize: '0.875rem',
    },
  };

  return {
    textTransform: 'uppercase',
    fontWeight: 400,
    lineHeight: 1.42857143,
    fontSize: '0.75rem',
    padding: '12px 30px',
    margin: '0.3125rem 1px',
    borderRadius: round ? '30px' : '4px',
    width: block ? '100%' : 'auto',
    minWidth: justIcon ? '41px' : undefined,
    minHeight: justIcon ? '41px' : undefined,
    color: simple ? bg || fg : fg,
    backgroundColor: simple ? 'transparent' : bg,
    boxShadow: simple || !bg
      ? 'none'
      : `0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12)`,
    '&:hover': {
      backgroundColor: simple ? 'transparent' : bg,
      boxShadow: simple || !bg
        ? 'none'
        : `0 14px 26px -12px rgba(0,0,0,0.42), 0 4px 23px 0px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)`,
    },
    ...(justIcon && {
      paddingLeft: '12px',
      paddingRight: '12px',
    }),
    ...(sizeType && sizeStyles[sizeType]),
  };
});

export default function RegularButton(props) {
  const {
    color = 'primary',
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    ...rest
  } = props;

  return (
    <StyledButton
      variant={simple ? 'text' : 'contained'}
      disableElevation
      disableRipple={link}
      disabled={disabled}
      className={className}
      classes={muiClasses}
      colorType={color}
      simple={simple}
      round={round}
      block={block}
      justIcon={justIcon}
      sizeType={size}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

RegularButton.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'transparent',
  ]),
  size: PropTypes.oneOf(['sm', 'lg']),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  muiClasses: PropTypes.object,
  children: PropTypes.node,
};
