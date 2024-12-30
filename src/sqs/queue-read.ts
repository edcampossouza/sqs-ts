import process from "node:process";
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

type QueueProcessParams<T> = {
  queueUrl: string;
  processFn: (messageType: T) => Promise<void>;
};

const client = new SQSClient({});

async function readAndProcessMessage<T>(params: QueueProcessParams<T>) {
  const { processFn, queueUrl } = params;
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10,
  });

  const response = await client.send(command);
  if (response.Messages) {
    {
      for (const message of response.Messages) {
        const obj: T = JSON.parse(message.Body!);
        try {
          await processFn(obj);
          await deleteMessage({
            messageReceipt: message.ReceiptHandle!,
            queueUrl: queueUrl,
          });
        } catch (error) {
          console.error(
            `Could not process message id [${message.MessageId}]`,
            error
          );
        }
      }
    }
  }
}

type DeleteMessageParams = {
  queueUrl: string;
  messageReceipt: string;
};

async function deleteMessage(params: DeleteMessageParams) {
  const { queueUrl, messageReceipt } = params;
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: messageReceipt,
    });
    const response = await client.send(command);
  } catch (error) {
    console.error(`Could not delete receipt id [${messageReceipt}]`, error);
  }
}

async function pollForMessages<T>(params: QueueProcessParams<T>) {
  while (true) {
    console.log(`process ${process.pid} is polling for messages:...`);
    await readAndProcessMessage(params);
  }
}

export { pollForMessages };
