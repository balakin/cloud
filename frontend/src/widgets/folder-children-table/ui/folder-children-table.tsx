import {
  Skeleton,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
  styled,
  TableRowProps,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableCellProps,
  Typography,
  Stack,
} from '@mui/material';
import { FolderChild, FolderIcon, useFolderChildren } from 'entities/folders';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { FolderChildrenTableRoutes } from '../types';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getNearestScroll } from 'shared/lib';
import { FileIcon } from 'entities/files';
import { FolderActions } from './folder-actions';
import { FileActions } from './file-actions';

const ITEM_HEIGHT = 42;

const Table = styled((props: TableProps) => <MuiTable component="div" {...props} />)({
  display: 'flex',
  flexDirection: 'column',
});

const TableHead = styled((props: TableHeadProps) => <MuiTableHead component="div" {...props} />)({
  display: 'flex',
});

const TableBody = styled((props: TableBodyProps) => <MuiTableBody component="div" {...props} />)({
  display: 'flex',
  flexDirection: 'column',
});

const TableRow = styled((props: TableRowProps) => <MuiTableRow component="div" {...props} />)({
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
});

const HeaderTableRow = styled(TableRow)({
  padding: '5px 0',
});

const BodyTableRow = styled(TableRow)({
  position: 'absolute',
  width: '100%',
  height: `${ITEM_HEIGHT}px`,
  top: 0,
  left: 0,
  alignItems: 'center',
});

const TableCell = styled((props: TableCellProps) => <MuiTableCell component="div" {...props} />)({
  borderBottom: 'none',
});

const IconTableCell = styled(TableCell)({
  width: '30px',
  paddingLeft: '10px',
  paddingRight: 0,
  lineHeight: 1,
});

const NameTableCell = styled(TableCell)({
  flex: '1 1 auto',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',

  '& > a': {
    color: 'black !important',
    textDecoration: 'none',
  },
});

const ActionsTableCell = styled(TableCell)({
  width: '50px',
  paddingLeft: '10px',
  paddingRight: '10px',
});

export type FolderChildrenTableProps = {
  id: string | null;
  usedRoutes: FolderChildrenTableRoutes;
};

export const FolderChildrenTable: FC<FolderChildrenTableProps> = ({ id, usedRoutes: routes }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, status } = useFolderChildren(id);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const children = data ? data.pages.flatMap(({ children }) => children) : [];

  const virtualizer = useVirtualizer<HTMLElement | null, FolderChild>({
    getScrollElement: () => scrollElement,
    count: hasNextPage ? children.length + 1 : children.length,
    estimateSize: () => ITEM_HEIGHT,
    observeElementOffset: (instance, callback) => {
      if (!instance.scrollElement) {
        return;
      }

      const scroll = instance.scrollElement;

      const onScroll = () => {
        const paperOffset = ref.current ? ref.current.offsetTop : 0;
        callback(scroll.scrollTop - paperOffset);
      };

      onScroll();

      instance.scrollElement.addEventListener('scroll', onScroll, {
        capture: false,
        passive: true,
      });

      return () => {
        scroll.removeEventListener('scroll', onScroll);
      };
    },
  });

  useEffect(() => {
    const scrollElement = getNearestScroll(ref.current);
    setScrollElement(scrollElement);
  }, []);

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= children.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualItems, children.length, fetchNextPage, isFetchingNextPage, hasNextPage]);

  let content: ReactNode = null;
  if (status === 'loading') {
    content = <Stub />;
  } else if (status === 'error' || !data) {
    content = null;
  } else {
    content = (
      <Table size="small">
        <TableHead sx={{ borderBottom: children.length > 0 ? undefined : 'none' }}>
          <HeaderTableRow>
            <IconTableCell />
            <NameTableCell>Name</NameTableCell>
            <ActionsTableCell />
          </HeaderTableRow>
        </TableHead>
        <TableBody sx={{ position: 'relative' }} style={{ height: virtualizer.getTotalSize() }}>
          {virtualItems.map(({ key, index, start }) => {
            const isLoaderRow = index > children.length - 1;
            const element = children[index];

            if (isLoaderRow) {
              return <StubRow key={key} />;
            }

            return (
              <BodyTableRow hover key={key} style={{ transform: `translateY(${start}px)` }}>
                <IconTableCell>
                  {element.kind === 'folder' ? (
                    <FolderIcon fontSize="1.25rem" name={element.name} />
                  ) : (
                    <FileIcon fontSize="1.25rem" name={element.name} />
                  )}
                </IconTableCell>
                <NameTableCell>
                  {element.kind === 'folder' ? (
                    <Link to={routes.folder(element.id)}>{element.name}</Link>
                  ) : (
                    element.name
                  )}
                </NameTableCell>
                <ActionsTableCell>
                  {element.kind === 'folder' ? (
                    <FolderActions id={element.id} name={element.name} />
                  ) : (
                    <FileActions id={element.id} name={element.name} />
                  )}
                </ActionsTableCell>
              </BodyTableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return (
    <Stack spacing={4}>
      <Paper variant="outlined" ref={ref}>
        {content}
      </Paper>
      {!isLoading && children.length === 0 && <NoFilesMessage />}
    </Stack>
  );
};

const Stub: FC = () => {
  return (
    <Table size="small">
      <TableHead>
        <HeaderTableRow>
          <IconTableCell />
          <NameTableCell>Name</NameTableCell>
          <ActionsTableCell />
        </HeaderTableRow>
      </TableHead>
      <TableBody>
        {new Array(10).fill(0).map((_, index) => {
          return <StubRow key={`stub-${index}`} />;
        })}
      </TableBody>
    </Table>
  );
};

const StubRow: FC = () => {
  return (
    <TableRow hover>
      <IconTableCell sx={{ lineHeight: '150%' }}>
        <Skeleton width={20} />
      </IconTableCell>
      <NameTableCell sx={{ lineHeight: '150%' }}>
        <Skeleton width={150} />
      </NameTableCell>
      <ActionsTableCell />
    </TableRow>
  );
};

const NoFilesMessage: FC = () => (
  <Typography variant="h5" textAlign="center">
    Folder is empty
  </Typography>
);
