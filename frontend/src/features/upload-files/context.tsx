import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Card,
  CardActions,
  CircularProgress,
  Collapse,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { foldersConstants } from 'entities/folders';
import { createContext, FC, forwardRef, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { UploadFileDto } from 'shared/api';
import { useSnackbarErrorHandler } from 'shared/hooks';
import { nameof } from 'shared/lib';
import { Confirmation } from 'shared/ui/confirmation';
import { v4 as uuidv4 } from 'uuid';
import { uploadFilesAction } from './model';

export type UploadFilesCallback = (files: File[], folderId: string | null) => void;

const UploadFilesContext = createContext<UploadFilesCallback>(() => {});

export function useUploadFiles() {
  return useContext(UploadFilesContext);
}

export type UploadFilesProviderProps = PropsWithChildren<{}>;

export const UploadFilesProvider: FC<UploadFilesProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = useState<UploadFilesProgress[]>([]);
  const handleError = useSnackbarErrorHandler();

  const uploadFiles = useCallback<UploadFilesCallback>(
    (files, folderId) => {
      if (files.length === 0) {
        return;
      }

      const id = uuidv4();
      let isError = false;
      let isSuccess = false;
      let fileIndex = 0;
      let fileLoaded = 0;
      let controller: AbortController = new AbortController();

      const nextFile = () => {
        if (fileIndex + 1 === files.length) {
          isSuccess = true;
        } else {
          fileIndex++;
        }

        updateUploadProgress();
      };

      const updateUploadProgress = () => {
        const common = {
          id,
          fileIndex,
          fileName: files[fileIndex].name,
          fileSize: files[fileIndex].size,
          fileLoaded,
          filesCount: files.length,
          isSuccess,
          remove,
        };
        const progress: UploadFilesProgress = isError
          ? { ...common, isError: true, retry, skip }
          : { ...common, isError: false, retry: null, skip: null };

        setUploads((uploads) => {
          let uploadIndex: number | null = null;
          uploads.some((upload, index) => {
            if (upload.id === id) {
              uploadIndex = index;
              return true;
            }

            return false;
          });

          if (uploadIndex !== null) {
            const copy = [...uploads];
            copy[uploadIndex] = progress;
            return copy;
          }

          return [...uploads, progress];
        });
      };

      const upload = async () => {
        if (isSuccess) {
          return;
        }

        try {
          await uploadFilesAction.mutation({
            files: files.slice(fileIndex),
            folderId,
            progressCallback: () => {
              nextFile();
              queryClient.invalidateQueries({
                predicate: (query) => {
                  return (
                    query.queryKey[0] === foldersConstants.QUERY_KEY &&
                    query.queryKey[2] !== foldersConstants.PATH_QUERY_KEY
                  );
                },
              });
            },
            onUploadProgress: (loaded) => {
              fileLoaded = loaded;
              updateUploadProgress();
            },
            signal: controller.signal,
          });
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }

          const formError = uploadFilesAction.errorPayloadExtractor(error);
          handleError(formError.message || formError.fields[nameof<UploadFileDto>('file')]);
          isError = true;
          controller = new AbortController();
          updateUploadProgress();
        }
      };

      const remove = () => {
        controller.abort();
        setUploads((uploads) => {
          return uploads.filter((upload) => upload.id !== id);
        });
      };

      const retry = () => {
        isError = false;
        updateUploadProgress();
        upload();
      };

      const skip = () => {
        isError = false;
        nextFile();
        updateUploadProgress();
        upload();
      };

      updateUploadProgress();
      upload();
    },
    [handleError, queryClient]
  );

  return (
    <UploadFilesContext.Provider value={uploadFiles}>
      {children}
      {uploads.length > 0 && (
        <Snackbar
          open={true}
          TransitionProps={{ appear: false }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <UploadFilesSnackbarContent uploads={uploads} />
        </Snackbar>
      )}
    </UploadFilesContext.Provider>
  );
};

type UploadFilesProgress = {
  id: string;
  fileName: string;
  fileIndex: number;
  fileSize: number;
  fileLoaded: number;
  filesCount: number;
  isSuccess: boolean;
  remove: () => void;
} & ({ isError: false; retry: null; skip: null } | { isError: true; retry: () => void; skip: () => void });

const Root = styled('div')(({ theme }) => ({
  width: '100% !important',

  [theme.breakpoints.up('sm')]: {
    width: '380px !important',
  },
}));

const SnackbarCard = styled(Card)({
  width: '100%',
  color: 'white',
});

const SnackbarActions = styled(CardActions)({
  padding: '8px 8px 8px 16px',
  justifyContent: 'space-between',
});

const SnackbarPaper = styled(Paper)({
  padding: '16px',
  paddingRight: '8px',
  display: 'flex',
});

type UploadFilesSnackbarContentProps = {
  uploads: UploadFilesProgress[];
};

const UploadFilesSnackbarContent = forwardRef<HTMLDivElement, UploadFilesSnackbarContentProps>(({ uploads }, ref) => {
  const [expanded, setExpanded] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);

  const handleExpandClick = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, []);

  const uploaded = uploads.every(({ isSuccess }) => isSuccess);
  const isError = uploads.some(({ isError }) => isError);

  const handleCloseClick = () => {
    if (uploaded) {
      uploads.forEach(({ remove }) => {
        remove();
      });
      return;
    }

    setConfirmationMessage('Are you sure you want to cancel all uploads?');
    setConfirmationAction(() => {
      return () => {
        uploads.forEach(({ remove }) => {
          remove();
        });
      };
    });
  };

  const handleConfirmationNo = useCallback(() => {
    setConfirmationMessage(null);
    setConfirmationAction(null);
  }, []);

  const handleConfirmationYes = useCallback(() => {
    confirmationAction && confirmationAction();
    handleConfirmationNo();
  }, [handleConfirmationNo, confirmationAction]);

  return (
    <>
      {confirmationMessage && confirmationAction && (
        <Confirmation open={true} onYes={handleConfirmationYes} onNo={handleConfirmationNo}>
          <Typography>{confirmationMessage}</Typography>
        </Confirmation>
      )}
      <Root ref={ref}>
        <SnackbarCard sx={{ bgcolor: isError ? 'error.main' : uploaded ? 'success.light' : 'info.main' }}>
          <SnackbarActions>
            <Typography>{isError ? 'Uploading error' : uploaded ? 'Uploaded' : 'Uploading...'}</Typography>
            <Stack spacing={1} direction="row">
              <IconButton aria-label="Show more" color="inherit" onClick={handleExpandClick}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton onClick={handleCloseClick} color="inherit" sx={{ flex: '0 0 auto' }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </SnackbarActions>
          <Collapse in={expanded && uploads.length > 0} timeout="auto" unmountOnExit>
            <SnackbarPaper>
              <Stack spacing={2} flex="1 1 auto" overflow="hidden">
                {uploads.map((progress) => (
                  <UploadProgress
                    key={progress.id}
                    progress={progress}
                    setConfirmationAction={setConfirmationAction}
                    setConfirmationMessage={setConfirmationMessage}
                  />
                ))}
              </Stack>
            </SnackbarPaper>
          </Collapse>
        </SnackbarCard>
      </Root>
    </>
  );
});

const UploadProgress: FC<{
  progress: UploadFilesProgress;
  setConfirmationMessage: (message: string) => void;
  setConfirmationAction: (updater: () => () => void) => void;
}> = ({ progress, setConfirmationMessage, setConfirmationAction }) => {
  const [determinate, setDeterminate] = useState(false);
  const { fileIndex, fileName, filesCount, id, isError, isSuccess, remove, retry, skip, fileLoaded, fileSize } =
    progress;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeterminate(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      setDeterminate(false);
    };
  }, [fileIndex]);

  return (
    <Stack key={id} spacing={1} direction="row" flex="1 1 auto" overflow="hidden">
      <Stack spacing={1} flex="1 1 auto" overflow="hidden">
        <Stack spacing={1} direction="row" alignItems="center" flex="1 1 auto" overflow="hidden">
          {!isSuccess && (
            <CircularProgress
              variant={determinate ? 'determinate' : 'indeterminate'}
              size="1em"
              color={isSuccess ? 'success' : isError ? 'error' : 'primary'}
              value={Math.round((fileLoaded / fileSize) * 100)}
            />
          )}
          <Typography noWrap textOverflow="ellipsis" flex="1" title={fileName}>
            {fileName}
          </Typography>
          <Typography variant="subtitle2" flex="0 1 auto" noWrap textOverflow="ellipsis">
            {isSuccess ? `${filesCount}/${filesCount}` : `${fileIndex}/${filesCount}`}
          </Typography>
        </Stack>
        <LinearProgress
          color={isSuccess ? 'success' : isError ? 'error' : 'primary'}
          variant="determinate"
          value={isSuccess ? 100 : Math.round((fileIndex / filesCount) * 100)}
        />
      </Stack>
      {isError && (
        <>
          <IconButton onClick={retry} color="inherit" sx={{ flex: '0 0 auto' }}>
            <ReplayIcon />
          </IconButton>
          <IconButton onClick={skip} color="inherit" sx={{ flex: '0 0 auto' }}>
            <NavigateNextIcon />
          </IconButton>
        </>
      )}
      <IconButton
        onClick={() => {
          if (isSuccess) {
            remove();
            return;
          }

          setConfirmationMessage('Are you sure you want to cancel the upload?');
          setConfirmationAction(() => {
            return remove;
          });
        }}
        color="inherit"
        sx={{ flex: '0 0 auto' }}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};
