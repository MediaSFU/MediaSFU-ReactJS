import { Transport, CloseAndResizeParameters, CloseAndResizeType } from '../../@types/types';
export interface ProducerClosedParameters extends CloseAndResizeParameters {
    consumerTransports: Transport[];
    screenId?: string;
    updateConsumerTransports: (transports: Transport[]) => void;
    closeAndResize: CloseAndResizeType;
    getUpdatedAllParams: () => ProducerClosedParameters;
    [key: string]: any;
}
export interface ProducerClosedOptions {
    remoteProducerId: string;
    parameters: ProducerClosedParameters;
}
export type ProducerClosedType = (options: ProducerClosedOptions) => Promise<void>;
export declare const producerClosed: ({ remoteProducerId, parameters, }: ProducerClosedOptions) => Promise<void>;
//# sourceMappingURL=producerClosed.d.ts.map