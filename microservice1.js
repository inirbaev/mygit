const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Функция для отправки задания в RabbitMQ
async function sendTaskToM2(task) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queueName = 'task_queue';

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(task), { persistent: true });

  console.log(`М1 отправил задание: ${task}`);
}

app.get('/', async (req, res) => {
  try {
    // Асинхронная обработка запроса
    const task = JSON.stringify({ method: req.method, url: req.url, query: req.query, headers: req.headers, id: uuidv4() });
    await sendTaskToM2(task);
    res.send('Привет, это ответ на ваш запрос!');
  } catch (err) {
    console.error('Ошибка обработки запроса:', err);
    res.status(500).send('Произошла ошибка при обработке запроса');
  }
});

app.listen(port, () => {
  console.log(`Сервер М1 запущен на http://localhost:${port}`);
});
