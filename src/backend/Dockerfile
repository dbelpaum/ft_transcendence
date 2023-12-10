FROM node:21
WORKDIR /app
RUN npm i -g @nestjs/cli

COPY ./conf/nest_cert.pem /var/nest_cert.pem
COPY ./conf/nest_key.pem /var/nest_key.pem
RUN chmod 777 /var/*.pem

COPY ./conf/start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh
EXPOSE 4000
CMD ["/tmp/start.sh"]


