import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const BaseCardBody = styled('div')(({ theme }) => ({
  padding: '0.9375rem 20px',
  flex: '1 1 auto',
  position: 'relative',
  '&.plain': {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  '&.profile': {
    marginTop: '15px',
  },
}));
export default function CardBody(props) {
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = clsx(className, {
    plain,
    profile,
  });

  return (
    <BaseCardBody className={cardBodyClasses} {...rest}>
      {children}
    </BaseCardBody>
  );
}

CardBody.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  children: PropTypes.node,
};
