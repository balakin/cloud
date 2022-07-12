import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { foldersConstants } from 'entities/folders';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { cloudApi, CreateFolderDto } from 'shared/api';
import { nameof } from 'shared/lib';
import { ClosableDialogTitle } from 'shared/ui/dialog';
import { FormError, FormStack, FormSubmitButton, FormTextField } from 'shared/ui/form';
import * as Yup from 'yup';
import { createFolderAction } from '../model';

export type CreateFolderDialogProps = Omit<DialogProps, 'onClose'> & {
  onClose?: () => void;
  parentId: string | null;
};

export const CreateFolderDialog: FC<CreateFolderDialogProps> = ({ onClose, parentId, ...props }) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const createFolder = useMutation(createFolderAction.mutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(foldersConstants.QUERY_KEY);
      onClose && onClose();
    },
  });
  const formik = useFormik<CreateFolderDto>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      parentId: parentId,
    },
    validationSchema: Yup.object({
      name: cloudApi.validationSchemes.folderName().required('Required field'),
    }),
    onSubmit: (values, { setErrors, setSubmitting, resetForm }) => {
      setError(null);
      createFolder.mutate(values, {
        onError: (error) => {
          const formError = createFolderAction.errorPayloadExtractor(error);
          setError(formError.message);
          setErrors(formError.fields);
        },
        onSettled: () => {
          setSubmitting(false);
        },
        onSuccess: () => {
          resetForm();
        },
      });
    },
  });

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog maxWidth="xs" fullWidth {...props} onClose={handleClose}>
      <ClosableDialogTitle onClose={handleClose}>Create folder</ClosableDialogTitle>
      <FormikProvider value={formik}>
        <Form>
          <DialogContent>
            <FormStack>
              <FormError error={error} />
              <FormTextField name={nameof<CreateFolderDto>('name')} label="Name" />
            </FormStack>
          </DialogContent>
          <DialogActions>
            <FormSubmitButton variant="text">Create folder</FormSubmitButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};
