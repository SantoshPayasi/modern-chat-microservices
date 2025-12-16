export type EventPayload = Record<string, unknown>;

export interface DomainEvent<TType extends string, TPayload extends EventPayload> {
    type: TType;
    payload: TPayload;
    occurredOn: string;
}


export interface EventMetaData {
    correlationId?: string;
    causationId?: string;
    version?: number;
}


export interface OutboundEvent<TType extends string, TPayload extends EventPayload>
    extends DomainEvent<TType, TPayload> {
    metaData?: EventMetaData;
}

export interface InboundEvent<TType extends string, TPayload extends EventPayload>
    extends DomainEvent<TType, TPayload> {
    metaData?: EventMetaData;
}