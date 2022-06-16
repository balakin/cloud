import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC } from 'react';
import { SignInDto } from 'shared/api';
import { useAction } from 'shared/hooks';
import { nameof } from 'shared/lib';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signInAction } from './model';

export type AuthByPasswordFormProps = {
  onSuccess: () => void;
};

export const AuthByPasswordForm: FC<AuthByPasswordFormProps> = ({ onSuccess }) => {
  const signIn = useAction(signInAction);
  const formik = useFormik<SignInDto>({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: Yup.string().required('Required field'),
    }),
    onSubmit: async (values, { setErrors }) => {
      const result = await signIn.execute(values);
      if (result.isSuccess) {
        onSuccess && onSuccess();
      } else {
        setErrors(result.errorPayload.fields);
      }
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
          <FormError error={signIn?.errorPayload?.message ?? null} />
          <FormTextField name={nameof<SignInDto>('userName')} label="Username" />
          <FormPasswordField name={nameof<SignInDto>('password')} label="Password" />
          <FormSubmitButton>Sign In</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
