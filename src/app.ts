import dotenv from "dotenv";
import * as uuid from "uuid";
import { numberOfDivisors } from "./calc/primes.js";
import sendMessage from "./sqs/queue-send.js";
import { RequestPayloadType, ResponsePayloadType } from "./types/types.js";
import { pollForMessages } from "./sqs/queue-read.js";

dotenv.config();

const responseQueueUrl = process.env.RESPONSE_QUEUE_URL!;
const requestQueueUrl = process.env.REQUEST_QUEUE_URL!;

async function processRequest(param: RequestPayloadType) {
  if (param.number === undefined) {
    throw new Error("invalid request: " + JSON.stringify(param));
  }
  const t1 = new Date().getTime();
  const divisors = numberOfDivisors(param.number);
  const t2 = new Date().getTime();
  const payload: ResponsePayloadType = {
    requestId: param.requestId,
    number: param.number,
    divisors,
    time: t2 - t1
  };
  sendMessage({ payload, queueUrl: responseQueueUrl });
}

//processRequest({ number: 100, requestId: uuid.v4() });

pollForMessages<RequestPayloadType>({
  processFn: processRequest,
  queueUrl: requestQueueUrl,
});
