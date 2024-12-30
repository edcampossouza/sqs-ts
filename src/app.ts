import dotenv from "dotenv";
import os from "node:os";
import cluster from "node:cluster";
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
    time: t2 - t1,
  };
  console.log(`posting response (pid: [${process.pid}])`, payload);
  sendMessage({ payload, queueUrl: responseQueueUrl });
}

const processes = getParallelism();

function getParallelism(): number {
  const MAXIMUM_PARALLELISM = process.env.MAXIMUM_PARALLELISM;
  if ("max".toLowerCase() === MAXIMUM_PARALLELISM) {
    return os.availableParallelism();
  }
  const n = parseInt(MAXIMUM_PARALLELISM || "");
  if (Number.isNaN(n) || n < 1) return 1;

  return n;
}

if (cluster.isPrimary) {
  console.log(`spawning ${processes} processes`);
  for (let i = 0; i < processes; i++) {
    cluster.fork();
  }
} else {
  console.log(`process $${process.pid} starting`);
  pollForMessages({ processFn: processRequest, queueUrl: requestQueueUrl });
}
