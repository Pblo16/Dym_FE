import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import type { NotificationState } from "@/hooks/useEmailNotifications"

interface NotificationProps {
    notification: NotificationState;
    onClose: () => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
    if (!notification.show) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="w-4 h-4" />;
            case 'error':
                return <AlertCircle className="w-4 h-4" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4" />;
            case 'info':
                return <Info className="w-4 h-4" />;
            default:
                return <Info className="w-4 h-4" />;
        }
    };

    const getVariant = () => {
        switch (notification.type) {
            case 'error':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <Alert variant={getVariant()} className="relative">
            {getIcon()}
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={onClose}
            >
                <X className="w-3 h-3" />
            </Button>
        </Alert>
    );
}
