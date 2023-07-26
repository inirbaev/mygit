const amqp = require('amqplib');

async function processTask(task) {
  // Здесь производите обработку задания
  const result = `Задание обработано: ${task}`;
  return result;
}

async function listenForTasks() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queueName = 'task_queue';

  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1);

  console.log('М2 ожидает задания...');

  channel.consume(queueName, async (msg) => {
    const task = msg.content.toString();
    console.log(`М2 получил задание: ${task}`);
    const result = await processTask(task);

    const responseQueue = msg.properties.replyTo;
    channel.sendToQueue(responseQueue, Buffer.from(result), {
      correlationId: msg.properties.correlationId,
    });

    channel.ack(msg);
    console.log(`М2 обработал задание: ${task}`);
  });
}

listenForTasks().catch((err) => console.error('Ошибка:', err));
