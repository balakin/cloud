import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider } from 'formik';
import { FC } from 'react';
import { SignUpDto } from 'shared/api';
import { useCloudFormik } from 'shared/formik';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signUp } from './model';

export type RegistrationFormProps = {
  onSuccess: () => void;
};

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSuccess }) => {
  const { error, formik } = useCloudFormik<SignUpDto & { repeatPassword: string }>({
    initialValues: {
      userName: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: Yup.string()
        .required('Required field')
        .matches(/[^a-z0-9]+/i, 'Passwords must have at least one non alphanumeric character')
        .matches(/\d+/i, "Passwords must have at least one digit ('0'-'9')")
        .matches(/[A-Z]+/, "Passwords must have at least one uppercase ('A'-'Z')")
        .matches(/[a-z]+/, "Passwords must have at least one lowercase ('a'-'z')")
        .min(6, 'Passwords must be at least 6 characters'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password')], "Passwords don't match")
        .required('Required field'),
    }),
    onSubmit: async (dto) => {
      await signUp(dto);
      onSuccess && onSuccess();
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <FormStack>
          <Stack justifyContent="space-between" direction="row" alignItems="center">
            <Logo />
            <Typography sx={{ color: 'text.secondary' }} variant="subtitle1">
              Sign Up
            </Typography>
          </Stack>
          <FormError error={error} />
          <FormTextField name="userName" label="Username" />
          <FormPasswordField name="password" label="Password" />
          <FormPasswordField name="repeatPassword" label="Repeat password" />
          <FormSubmitButton>Sign Up</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
