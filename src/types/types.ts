export type RequestPayloadType = {
  requestId: string;
  number: number;
};

export type ResponsePayloadType = {
  requestId: string;
  number: number;
  divisors: number;
  time: number | undefined
};
