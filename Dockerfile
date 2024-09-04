FROM quay.io/princerudh/rudhra:latest

RUN git clone https://github.com/rudhachu/rudhra_3 /root/bot
WORKDIR /root/bot/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
