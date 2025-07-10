import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const BaseCardFooter = styled('div')(({ theme }) => ({
  padding: 0,
  paddingTop: '10px',
  margin: '0 15px 10px',
  borderRadius: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 0,
  '&.plain': {
    paddingLeft: '5px',
    paddingRight: '5px',
    backgroundColor: 'transparent',
  },
  '&.profile': {
    marginTop: '-15px',
  },
  '&.stats': {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: '20px',
    '& svg': {
      position: 'relative',
      top: '4px',
      margin: '0 3px',
      width: '16px',
      height: '16px',
    },
    '& .material-icons, & [class*="fa"]': {
      fontSize: '16px',
      position: 'relative',
      top: '4px',
      margin: '0 3px',
    },
  },
  '&.chart': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

export default function CardFooter(props) {
  const { className, children, plain, profile, stats, chart, ...rest } = props;

  const cardFooterClasses = clsx(className, {
    plain,
    profile,
    stats,
    chart,
  });

  return (
    <BaseCardFooter className={cardFooterClasses} {...rest}>
      {children}
    </BaseCardFooter>
  );
}

CardFooter.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  stats: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
