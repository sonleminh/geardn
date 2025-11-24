import { AlertColor } from "@mui/material";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type NotificationState = {
    message: string;
    severity: 'success' | 'warning' | 'error' | 'info';
    open: boolean;
    showNotification: (message: string, severity?: AlertColor) => void;
    closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    devtools(persist(
        (set) => ({
            message: '',
            severity: 'success',
            open: false,
            showNotification: (message, severity = 'success') => set({ message, severity, open: true }),
            closeNotification: () => set({ message: '', severity: 'success', open: false }),
        }),
        {
            name: 'notification-store',
        }
    ))
)