import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { Form, FormikProvider } from 'formik';
import { FC } from 'react';
import { ChangePasswordDto, cloudApi } from 'shared/api';
import { useCloudFormik } from 'shared/formik';
import { FormError, FormPasswordField, FormStack, FormSubmitButton } from 'shared/ui/form';
import * as Yup from 'yup';
import { changePassword } from '../model';

export type ChangePasswordDialogProps = Omit<DialogProps, 'onClose'> & {
  onClose?: () => void;
};

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ onClose, ...props }) => {
  const { error, formik } = useCloudFormik<ChangePasswordDto>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Required field'),
      newPassword: cloudApi.validationSchemes.password().required('Required field'),
    }),
    onSubmit: async (dto) => {
      await changePassword(dto);
      onClose && onClose();
    },
  });

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <DialogTitle>Change password</DialogTitle>
      <FormikProvider value={formik}>
        <Form>
          <DialogContent>
            <FormStack>
              <FormError error={error} />
              <FormPasswordField name="currentPassword" label="Current password" />
              <FormPasswordField name="newPassword" label="New password" />
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
