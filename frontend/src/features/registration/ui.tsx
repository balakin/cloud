import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider } from 'formik';
import { FC } from 'react';
import { cloudApi, SignUpDto } from 'shared/api';
import { useCloudFormik } from 'shared/formik';
import { nameof } from 'shared/helpers';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signUp } from './model';

export type RegistrationFormProps = {
  onSuccess: () => void;
};

type FormValues = SignUpDto & { repeatPassword: string };

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSuccess }) => {
  const { error, formik } = useCloudFormik<FormValues>({
    initialValues: {
      userName: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: cloudApi.validationSchemes.password().required('Required field'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref(nameof<FormValues>('password'))], "Passwords don't match")
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
          <FormTextField name={nameof<FormValues>('userName')} label="Username" />
          <FormPasswordField name={nameof<FormValues>('password')} label="Password" />
          <FormPasswordField name={nameof<FormValues>('repeatPassword')} label="Repeat password" />
          <FormSubmitButton>Sign Up</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
