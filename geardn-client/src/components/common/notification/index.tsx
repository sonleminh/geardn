'use client';

import { useNotificationStore } from '@/stores/notification-store';
import { Alert, Snackbar } from '@mui/material';

export const Notification = () => {
  const { message, severity, open, closeNotification } = useNotificationStore();

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={closeNotification}>
      <Alert variant='filled' severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
