import { useState, useCallback } from 'react';

export interface NotificationState {
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

export interface EmailNotificationHook {
    notification: NotificationState | null;
    showEmailSuccess: (messageId?: string) => void;
    showEmailError: (error: string) => void;
    showEmailWarning: (message: string) => void;
    hideNotification: () => void;
}

/**
 * Hook para manejar notificaciones relacionadas con el servicio de email
 */
export function useEmailNotifications(): EmailNotificationHook {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = useCallback((notificationData: NotificationState) => {
        setNotification(notificationData);

        // Auto-hide después del tiempo especificado
        if (notificationData.duration !== 0) {
            setTimeout(() => {
                setNotification(null);
            }, notificationData.duration || 5000);
        }
    }, []);

    const showEmailSuccess = useCallback((messageId?: string) => {
        showNotification({
            show: true,
            type: 'success',
            title: '✅ Email enviado exitosamente',
            message: messageId
                ? `Su cotización ha sido enviada. ID del mensaje: ${messageId}`
                : 'Su cotización ha sido enviada por correo electrónico.',
            duration: 5000
        });
    }, [showNotification]);

    const showEmailError = useCallback((error: string) => {
        showNotification({
            show: true,
            type: 'error',
            title: '❌ Error al enviar email',
            message: `No se pudo enviar el email de confirmación: ${error}. Su cotización se ha guardado correctamente.`,
            duration: 8000
        });
    }, [showNotification]);

    const showEmailWarning = useCallback((message: string) => {
        showNotification({
            show: true,
            type: 'warning',
            title: '⚠️ Advertencia del servicio de email',
            message,
            duration: 6000
        });
    }, [showNotification]);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showEmailSuccess,
        showEmailError,
        showEmailWarning,
        hideNotification
    };
}
