# Étape de construction
FROM node:21 as build
WORKDIR /app
EXPOSE 3000
CMD ["bash", "-c", "npm install && npm start"]

#Étape de production
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
