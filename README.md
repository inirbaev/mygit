# Инструкция по запуску данного проекта
1. Скачать Docker: https://www.docker.com/
2. Запустить RabbitMQ: docker run -d --name my-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
3. Запустите микросервисы:
node m1.js
node m2.js