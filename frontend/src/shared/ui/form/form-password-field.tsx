import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment } from '@mui/material';
import { FC, MouseEventHandler, useState } from 'react';
import { FormTextField, FormTextFieldProps } from './form-text-field';

export type FormPasswordFieldProps = FormTextFieldProps;

export const FormPasswordField: FC<FormTextFieldProps> = ({ InputProps, dependencies, ...props }) => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const handleClickShowPassword: MouseEventHandler<HTMLButtonElement> = () => {
    setPasswordHidden((value) => !value);
  };

  const endAdornment = (
    <>
      <InputAdornment position="end">
        <IconButton onClick={handleClickShowPassword}>{passwordHidden ? <Visibility /> : <VisibilityOff />}</IconButton>
      </InputAdornment>
    </>
  );

  return (
    <FormTextField
      {...props}
      InputProps={{
        ...InputProps,
        endAdornment: endAdornment,
        type: passwordHidden ? 'password' : 'text',
      }}
      dependencies={[passwordHidden, ...(dependencies || [])]}
    />
  );
};
