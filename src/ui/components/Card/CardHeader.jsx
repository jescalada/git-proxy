import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const gradientMap = {
  primary: ['#ab47bc', '#8e24aa'],
  info: ['#26c6da', '#00acc1'],
  success: ['#66bb6a', '#43a047'],
  warning: ['#ffa726', '#fb8c00'],
  danger: ['#ef5350', '#e53935'],
  rose: ['#ec407a', '#d81b60'],
};

const BaseCardHeader = styled('div')(
  ({ theme, ownerState }) => {
    const { color, plain, stats, icon } = ownerState;
    const gradient = color ? gradientMap[color] : null;
    const isColored = color && !icon;

    return {
      padding: plain || icon || stats ? 0 : '15px',
      margin: plain || icon || stats ? '0 15px' : '-20px 15px 0',
      borderBottom: 'none',
      borderRadius: isColored ? '3px' : undefined,
      background: isColored ? `linear-gradient(60deg, ${gradient[0]}, ${gradient[1]})` : 'transparent',
      color: isColored ? theme.palette.common.white : undefined,
      position: 'relative',
      zIndex: 3,
      '&:first-of-type': {
        borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0',
      },
      ...(stats && {
        '& svg': {
          fontSize: '36px',
          lineHeight: '56px',
          width: '36px',
          height: '36px',
          textAlign: 'center',
          margin: '10px 10px 4px',
        },
        '& .material-icons, & i': {
          fontSize: '36px',
          lineHeight: '56px',
          width: '56px',
          height: '56px',
          textAlign: 'center',
          marginBottom: '1px',
        },
        ...(icon && {
          textAlign: 'right',
        }),
      }),
      ...(icon && {
        background: 'transparent',
        boxShadow: 'none',
        '& i, & .material-icons': {
          width: '33px',
          height: '33px',
          textAlign: 'center',
          lineHeight: '33px',
        },
        '& svg': {
          width: '24px',
          height: '24px',
          textAlign: 'center',
          lineHeight: '33px',
          margin: '5px 4px 0px',
        },
      }),
    };
  }
);

export default function CardHeader(props) {
  const { className, children, color, plain, stats, icon, ...rest } = props;

  const ownerState = { color, plain, stats, icon };
  const cardHeaderClasses = clsx(className);

  return (
    <BaseCardHeader className={cardHeaderClasses} ownerState={ownerState} {...rest}>
      {children}
    </BaseCardHeader>
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'rose']),
  plain: PropTypes.bool,
  stats: PropTypes.bool,
  icon: PropTypes.bool,
  children: PropTypes.node,
};
