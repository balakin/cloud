import { FastField, FastFieldProps } from 'formik';
import { TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { useDependenciesKey } from './hooks';

export type FormTextFieldProps = {
  name: string;
  dependencies?: Array<unknown>;
} & Omit<TextFieldProps, 'name'>;

export const FormTextField: FC<FormTextFieldProps> = ({ name, dependencies, InputProps, ...props }) => {
  const key = useDependenciesKey(dependencies);

  return (
    <FastField name={name} key={key}>
      {({ field, meta }: FastFieldProps<string>) => {
        const helperText = meta.touched && meta.error;
        const error = Boolean(helperText);

        return <TextField {...props} InputProps={{ ...field, ...InputProps }} error={error} helperText={helperText} />;
      }}
    </FastField>
  );
};
