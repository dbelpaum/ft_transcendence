# Étape de construction
FROM node:21 as build
WORKDIR /app
EXPOSE 3000
COPY ./conf/react_cert.pem /var/react_cert.pem 
COPY ./conf/react_key.pem /var/react_key.pem 
RUN chmod 777 /var/*.pem

CMD ["bash", "-c", "npm install && npm start"]

#Étape de production
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
