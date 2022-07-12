import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { foldersConstants } from 'entities/folders';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ChangeFileDto, cloudApi } from 'shared/api';
import { nameof } from 'shared/lib';
import { ClosableDialogTitle } from 'shared/ui/dialog';
import { FormError, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import * as Yup from 'yup';
import { renameAction } from '../model';

export type RenameFileDialogProps = Omit<DialogProps, 'onClose'> & {
  id: string;
  name: string;
  onClose?: () => void;
};

export const RenameFileDialog: FC<RenameFileDialogProps> = ({ id, name, onClose, ...props }) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const rename = useMutation(renameAction.mutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(foldersConstants.QUERY_KEY);
      onClose && onClose();
    },
  });
  const formik = useFormik<ChangeFileDto>({
    initialValues: {
      name,
    },
    validationSchema: Yup.object({
      name: cloudApi.validationSchemes.fileName().required('Required field'),
    }),
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setError(null);
      rename.mutate(
        { id, data: values },
        {
          onError: (error) => {
            const formError = renameAction.errorPayloadExtractor(error);
            setError(formError.message);
            setErrors(formError.fields);
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    },
  });

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <ClosableDialogTitle onClose={handleClose}>Rename</ClosableDialogTitle>
      <FormikProvider value={formik}>
        <Form>
          <DialogContent>
            <FormStack>
              <FormError error={error} />
              <FormTextField name={nameof<ChangeFileDto>('name')} label="Name" />
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
