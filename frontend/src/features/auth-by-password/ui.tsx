import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC, useState } from 'react';
import { useMutation } from 'react-query';
import { SignInDto } from 'shared/api';
import { nameof } from 'shared/lib';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signInAction } from './model';

export type AuthByPasswordFormProps = {
  onSuccess: () => void;
};

export const AuthByPasswordForm: FC<AuthByPasswordFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const signIn = useMutation(signInAction.mutation, {
    onSuccess: () => {
      onSuccess && onSuccess();
    },
  });
  const formik = useFormik<SignInDto>({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: Yup.string().required('Required field'),
    }),
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setError(null);
      signIn.mutate(values, {
        onError: (error) => {
          const formError = signInAction.errorPayloadExtractor(error);
          setErrors(formError.fields);
          setError(formError.message);
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
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
