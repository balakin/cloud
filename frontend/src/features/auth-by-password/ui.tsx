import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider } from 'formik';
import { FC } from 'react';
import { SignInDto } from 'shared/api';
import { useCloudFormik } from 'shared/formik';
import { nameof } from 'shared/helpers';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signIn } from './model';

export type AuthByPasswordFormProps = {
  onSuccess: () => void;
};

export const AuthByPasswordForm: FC<AuthByPasswordFormProps> = ({ onSuccess }) => {
  const { error, formik } = useCloudFormik<SignInDto>({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: Yup.string().required('Required field'),
    }),
    onSubmit: async (dto) => {
      await signIn(dto);
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
              Sign In
            </Typography>
          </Stack>
          <FormError error={error} />
          <FormTextField name={nameof<SignInDto>('userName')} label="Username" />
          <FormPasswordField name={nameof<SignInDto>('password')} label="Password" />
          <FormSubmitButton>Sign In</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
