import React, { ReactElement, ReactNode } from 'react';
import { useNotifications } from '@/context/notification/NotificationContext';
import { Alert } from '@navikt/ds-react';

export const NotificationBar = (): ReactElement => {
  const { notifications } = useNotifications();

  const notificationBars = notifications.map(
    (notification, index): ReactNode => {
      return (
        <Alert key={index} variant={notification.variant}>
          {notification.message}
        </Alert>
      );
    }
  );

  return <>{notificationBars}</>;
};
