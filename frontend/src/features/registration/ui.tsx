import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC, useState } from 'react';
import { useMutation } from 'react-query';
import { cloudApi, SignUpDto } from 'shared/api';
import { nameof } from 'shared/lib';
import { FormError, FormPasswordField, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import { Logo } from 'shared/ui/logo';
import * as Yup from 'yup';
import { signUpAction } from './model';

export type RegistrationFormProps = {
  onSuccess: () => void;
};

type Values = SignUpDto & { repeatPassword: string };

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const signUp = useMutation(signUpAction.mutation, {
    onSuccess: () => {
      onSuccess && onSuccess();
    },
  });
  const formik = useFormik<Values>({
    initialValues: {
      userName: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required field'),
      password: cloudApi.validationSchemes.password().required('Required field'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref(nameof<Values>('password'))], "Passwords don't match")
        .required('Required field'),
    }),
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setError(null);
      signUp.mutate(values, {
        onError: (error) => {
          const formError = signUpAction.errorPayloadExtractor(error);
          setError(formError.message);
          setErrors(formError.fields);
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
              Sign Up
            </Typography>
          </Stack>
          <FormError error={error} />
          <FormTextField name={nameof<Values>('userName')} label="Username" />
          <FormPasswordField name={nameof<Values>('password')} label="Password" />
          <FormPasswordField name={nameof<Values>('repeatPassword')} label="Repeat password" />
          <FormSubmitButton>Sign Up</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
