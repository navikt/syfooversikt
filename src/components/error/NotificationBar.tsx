import React, { ReactNode } from "react";
import { useNotifications } from "@/context/notification/NotificationContext";
import { LocalAlert } from "@navikt/ds-react";
import { Notification } from "@/context/notification/Notifications";

interface Props {
  notification: Notification;
}

function AlertWithCloseButton({ notification }: Props) {
  const [isVisible, setIsVisible] = React.useState(true);
  return isVisible ? (
    <LocalAlert status={notification.status} className="mb-4" size="small">
      <LocalAlert.Header>
        <LocalAlert.Title as="h3">
          {notification.header || notification.message}
        </LocalAlert.Title>
        <LocalAlert.CloseButton onClick={() => setIsVisible(false)} />
      </LocalAlert.Header>
      {!!notification.header && (
        <LocalAlert.Content>{notification.message}</LocalAlert.Content>
      )}
    </LocalAlert>
  ) : null;
}

export default function NotificationBar() {
  const { notifications } = useNotifications();

  return notifications.map(
    (notification, index): ReactNode => (
      <AlertWithCloseButton key={index} notification={notification} />
    ),
  );
}
