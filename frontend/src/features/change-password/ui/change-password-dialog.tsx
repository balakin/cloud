import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC } from 'react';
import { ChangePasswordDto, cloudApi } from 'shared/api';
import { useAction } from 'shared/hooks';
import { nameof } from 'shared/lib';
import { ClosableDialogTitle } from 'shared/ui/dialog';
import { FormError, FormPasswordField, FormStack, FormSubmitButton } from 'shared/ui/form';
import * as Yup from 'yup';
import { changePasswordAction } from '../model';

export type ChangePasswordDialogProps = Omit<DialogProps, 'onClose'> & {
  onClose?: () => void;
};

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ onClose, ...props }) => {
  const changePassword = useAction(changePasswordAction);
  const formik = useFormik<ChangePasswordDto>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Required field'),
      newPassword: cloudApi.validationSchemes.password().required('Required field'),
    }),
    onSubmit: async (values, { setErrors }) => {
      const result = await changePassword.execute(values);
      if (result.isSuccess) {
        onClose && onClose();
      } else {
        setErrors(result.errorPayload.fields);
      }
    },
  });

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <ClosableDialogTitle onClose={handleClose}>Change password</ClosableDialogTitle>
      <FormikProvider value={formik}>
        <Form>
          <DialogContent>
            <FormStack>
              <FormError error={changePassword?.errorPayload?.message ?? null} />
              <FormPasswordField name={nameof<ChangePasswordDto>('currentPassword')} label="Current password" />
              <FormPasswordField name={nameof<ChangePasswordDto>('newPassword')} label="New password" />
            </FormStack>
          </DialogContent>
          <DialogActions>
            <FormSubmitButton variant="text">Change</FormSubmitButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};
