import { LoadingButton, LoadingButtonProps } from 'shared/ui/buttons';
import { useFormikContext } from 'formik';
import { FC } from 'react';

export type FormSubmitButtonProps = LoadingButtonProps;

export const FormSubmitButton: FC<FormSubmitButtonProps> = (props) => {
  const { isSubmitting } = useFormikContext();

  return <LoadingButton type="submit" color="primary" variant="contained" loading={isSubmitting} {...props} />;
};
