import { Socket } from 'socket.io-client';
import { ReorderStreamsParameters, ReorderStreamsType, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters, ConnectRecvTransportType, ShowAlert } from '../../@types/types';
import { Device } from 'mediasoup-client/lib/types';
export interface NewPipeProducerParameters extends ReorderStreamsParameters, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters {
    first_round: boolean;
    shareScreenStarted: boolean;
    shared: boolean;
    landScaped: boolean;
    showAlert?: ShowAlert;
    isWideScreen: boolean;
    updateFirst_round: (firstRound: boolean) => void;
    updateLandScaped: (landScaped: boolean) => void;
    device: Device | null;
    consumingTransports: string[];
    lock_screen: boolean;
    updateConsumingTransports: (transports: string[]) => void;
    connectRecvTransport: ConnectRecvTransportType;
    reorderStreams: ReorderStreamsType;
    getUpdatedAllParams: () => NewPipeProducerParameters;
    [key: string]: any;
}
export interface NewPipeProducerOptions {
    producerId: string;
    islevel: string;
    nsock: Socket;
    parameters: NewPipeProducerParameters;
}
export type NewPipeProducerType = (options: NewPipeProducerOptions) => Promise<void>;
export declare const newPipeProducer: ({ producerId, islevel, nsock, parameters, }: NewPipeProducerOptions) => Promise<void>;
//# sourceMappingURL=newPipeProducer.d.ts.map