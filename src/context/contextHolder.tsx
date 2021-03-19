import { finnMiljoStreng } from '../utils/miljoUtil';

interface ContextHolderProps {
  ident: string;
  callback(a: any): void;
}

const ContextholderConnection = (ident: ContextHolderProps['ident']) => {
  return new WebSocket(
    `wss://veilederflatehendelser${finnMiljoStreng()}.adeo.no/modiaeventdistribution/ws/${ident}`
  );
};

export const opprettWebsocketConnection = (
  ident: ContextHolderProps['ident'],
  callback: ContextHolderProps['callback']
) => {
  if (window.location.hostname.indexOf('localhost') !== -1) {
    return;
  }

  const connection = ContextholderConnection(ident);
  connection.onmessage = (e) => {
    callback(e);
  };
  // tslint:disable-next-line:no-empty
  connection.onerror = () => {};
  connection.onclose = () => {
    setTimeout(() => {
      opprettWebsocketConnection(ident, callback);
    }, 1000);
  };
};
