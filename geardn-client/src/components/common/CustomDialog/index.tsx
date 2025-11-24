import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function CustomDialog({
  title = 'Default Title',
  content = 'Default Content',
  okContent = 'Có',
  cancelContent = 'Không',
  showOkButton = true,
  showCancelButton = true,
  open,
  handleOk,
  handleClose,
}: {
  title?: string;
  content?: string;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  okContent?: string;
  cancelContent?: string;
  open: boolean;
  handleOk: () => void;
  handleClose?: () => void;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {showOkButton && (
          <Button onClick={handleOk} color='primary' variant='contained'>
            {okContent}
          </Button>
        )}
        {showCancelButton && (
          <Button onClick={handleClose} color='inherit'>
            {cancelContent}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
