import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function CustomDialog({
  title = "Default Title",
  content = "Default Content",
  okContent = "Có",
  cancelContent = "Không",
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
      <DialogTitle>
        <Typography sx={{ fontSize: 24, fontWeight: 500 }}>{title}</Typography>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Box
          sx={{
            width: "100%",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {showOkButton && (
            <Button
              onClick={handleOk}
              size="large"
              color="primary"
              variant="contained"
              sx={{ width: "49%" }}
            >
              {okContent}
            </Button>
          )}
          {showCancelButton && (
            <Button
              onClick={handleClose}
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ width: "49%" }}
            >
              {cancelContent}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
