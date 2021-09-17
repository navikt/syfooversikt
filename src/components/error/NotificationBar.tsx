import React, { ReactElement, ReactNode } from 'react';
import { useNotifications } from '@/context/notification/NotificationContext';
import { AlertstripeFullbredde } from '@/components/AlertStripe/AlertstripeFullbredde';

export const NotificationBar = (): ReactElement => {
  const { notifications } = useNotifications();

  const notificationBars = notifications.map(
    (notification, index): ReactNode => {
      return (
        <AlertstripeFullbredde key={index} type={notification.level}>
          {notification.message}
        </AlertstripeFullbredde>
      );
    }
  );

  return <>{notificationBars}</>;
};
