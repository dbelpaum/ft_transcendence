FROM node:21
WORKDIR /app
RUN npm i -g @nestjs/cli

COPY ./conf/start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh
EXPOSE 4000
CMD ["/tmp/start.sh"]


