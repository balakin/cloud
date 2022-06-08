import { AxiosError } from 'axios';
import { FormikConfig, FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { cloudApi } from 'shared/api';
import { useIsMountedRef } from 'shared/hooks';

export type CloudFormikConfig<Values extends FormikValues = FormikValues> = {
  onSubmit: (
    values: Values,
    formikHelpers: Omit<FormikHelpers<Values>, 'setErrors' | 'setSubmitting'>
  ) => void | Promise<any>;
} & Omit<FormikConfig<Values>, 'onSubmit'>;

export function useCloudFormik<Values extends FormikValues = FormikValues>({
  onSubmit,
  ...other
}: CloudFormikConfig<Values>) {
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useIsMountedRef();

  const formik = useFormik<Values>({
    ...other,
    validateOnBlur: true,
    onSubmit: async (values, { setErrors, setSubmitting, ...formikHelpers }) => {
      setSubmitting(true);
      try {
        onSubmit && (await onSubmit(values, formikHelpers));
      } catch (error) {
        if (isMountedRef.current) {
          if (error instanceof AxiosError) {
            const details = cloudApi.extractProblemDetails(error);
            if (details.errors) {
              const formatted = Object.entries(details.errors).reduce(
                (previous, [key, value]) => ({ ...previous, [key]: value[0] }),
                {}
              ) as Record<string, string>;

              setError(formatted[''] || null);
              delete formatted[''];
              setErrors(formatted as FormikErrors<Values>);
            } else {
              setErrors({});
            }
          } else {
            console.error(error);
            setErrors({ '': 'Unknown error' } as FormikErrors<Values>);
          }
        }
      } finally {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  return { error, formik };
}
