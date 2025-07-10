import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  paddingBottom: '10px',
  margin: '27px 0 0',
  position: 'relative',
  verticalAlign: 'unset',
}));

const StyledLabel = styled(InputLabel)(({ theme, ownerState }) => ({
  fontSize: '14px',
  lineHeight: 1.42857,
  fontWeight: 400,
  color: ownerState.error
    ? theme.palette.error.main
    : ownerState.success
    ? theme.palette.success.main
    : theme.palette.text.secondary,
}));

const StyledInput = styled(Input)(({ theme, ownerState }) => ({
  marginTop: ownerState.labelText ? 0 : '16px',
  '&:before': {
    borderColor: theme.palette.grey[400],
  },
  '&:after': {
    borderColor: ownerState.error
      ? theme.palette.error.main
      : ownerState.success
      ? theme.palette.success.main
      : theme.palette.primary.main,
  },
  '&:hover:not(.Mui-disabled):before': {
    borderColor: theme.palette.grey[400],
  },
}));

const FeedbackIcon = styled('div')(({ theme, color }) => ({
  position: 'absolute',
  top: '18px',
  right: '0',
  zIndex: 2,
  width: '24px',
  height: '24px',
  textAlign: 'center',
  color,
  pointerEvents: 'none',
}));

export default function CustomInput(props) {
  const {
    formControlProps = {},
    labelText,
    id,
    labelProps = {},
    inputProps = {},
    error,
    success,
  } = props;

  const ownerState = { error, success, labelText };

  const feedbackColor = error
    ? 'error.main'
    : success
    ? 'success.main'
    : 'transparent';

  return (
    <StyledFormControl {...formControlProps}>
      {labelText && (
        <StyledLabel htmlFor={id} {...labelProps} ownerState={ownerState}>
          {labelText}
        </StyledLabel>
      )}
      <StyledInput
        id={id}
        ownerState={ownerState}
        disableUnderline={false}
        {...inputProps}
      />
      {error && (
        <FeedbackIcon color="red">
          <ClearIcon fontSize="small" />
        </FeedbackIcon>
      )}
      {!error && success && (
        <FeedbackIcon color="green">
          <CheckIcon fontSize="small" />
        </FeedbackIcon>
      )}
    </StyledFormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
};
