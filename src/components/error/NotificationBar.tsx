import React, { ReactElement, ReactNode } from 'react';
import { useNotifications } from '@/context/notification/NotificationContext';
import { Alert, Heading } from '@navikt/ds-react';
import { Notification } from '@/context/notification/Notifications';

interface Props {
  notification: Notification;
}

function AlertWithCloseButton({ notification }: Props) {
  const [show, setShow] = React.useState(true);
  return show ? (
    <Alert
      variant={notification.variant}
      className="mb-4"
      size="small"
      onClose={() => setShow(false)}
      closeButton
    >
      {!!notification.header && (
        <Heading size="xsmall" level="3">
          {notification.header}
        </Heading>
      )}
      {notification.message}
    </Alert>
  ) : null;
}

export default function NotificationBar(): ReactElement {
  const { notifications } = useNotifications();

  const notificationBars = notifications.map(
    (notification, index): ReactNode => (
      <AlertWithCloseButton key={index} notification={notification} />
    )
  );

  return <>{notificationBars}</>;
}
