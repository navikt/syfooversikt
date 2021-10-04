import React, { useState } from 'react';
import {
  Notification,
  NotificationType,
} from '@/context/notification/Notifications';

type NotificationProviderProps = {
  children: React.ReactNode;
};

type NotificationContextState = {
  notifications: Notification[];
  displayNotification: (notification: Notification) => void;
  clearNotification: (notification: NotificationType) => void;
};

export const NotificationContext = React.createContext<
  NotificationContextState | undefined
>(undefined);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        displayNotification: (notification) => {
          if (!notifications.includes(notification)) {
            setNotifications([...notifications, notification]);
          }
        },
        clearNotification: (type: NotificationType) => {
          setNotifications(notifications.filter((n) => n.type !== type));
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      `useNotifications must be used within a NotificationProvider`
    );
  }
  return context;
};
