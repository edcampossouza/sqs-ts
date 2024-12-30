import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

type QueueSendType = {
  queueUrl: string;
  payload: unknown;
};

const client = new SQSClient();

async function sendMessage(params: QueueSendType) {
  const { payload, queueUrl } = params;
  const cmd = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload),
  });

  try {
    await client.send(cmd);
  } catch (error) {
    console.error(`Could not send payload: : [${payload}]`, error);
  }
}

export default sendMessage;
