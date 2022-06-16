import { Stack, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC } from 'react';
import { cloudApi, SignUpDto } from 'shared/api';
import { useAction } from 'shared/hooks';
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
  const signUp = useAction(signUpAction);
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
    onSubmit: async (values, { setErrors }) => {
      const result = await signUp.execute(values);
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
              Sign Up
            </Typography>
          </Stack>
          <FormError error={signUp.errorPayload?.message ?? null} />
          <FormTextField name={nameof<Values>('userName')} label="Username" />
          <FormPasswordField name={nameof<Values>('password')} label="Password" />
          <FormPasswordField name={nameof<Values>('repeatPassword')} label="Repeat password" />
          <FormSubmitButton>Sign Up</FormSubmitButton>
        </FormStack>
      </Form>
    </FormikProvider>
  );
};
