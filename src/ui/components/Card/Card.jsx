import React from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

const BaseCard = styled('div')(
  ({ theme }) => ({
    border: '0',
    marginBottom: '30px',
    marginTop: '30px',
    borderRadius: '6px',
    color: alpha(theme.palette.common.black, 0.87),
    background: theme.palette.common.white,
    width: '100%',
    boxShadow: `0 1px 4px 0 ${alpha(theme.palette.common.black, 0.14)}`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem',
    '&.plain': {
      background: 'transparent',
      boxShadow: 'none',
    },
    '&.profile': {
      marginTop: '30px',
      textAlign: 'center',
    },
    '&.chart p': {
      marginTop: '0px',
      paddingTop: '0px',
    },
  })
);

export default function Card(props) {
  const { className, children, plain, profile, chart, ...rest } = props;
  const cardClasses = clsx(className, {
    plain,
    profile,
    chart,
  });

  return (
    <BaseCard className={cardClasses} {...rest}>
      {children}
    </BaseCard>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
