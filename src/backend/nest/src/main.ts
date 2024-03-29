import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
	dotenv.config();

const cert = fs.readFileSync('/var/nest_cert.pem', 'utf8');
const key = fs.readFileSync('/var/nest_key.pem', 'utf8');

const httpsOptions = {
	key: key,
	cert: cert,
  };

const app = await NestFactory.create(AppModule);

app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.enableCors({
    origin: "http://localhost:3000",
	credentials:true, // Autorise les requêtes de l'application React
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-internal-secret',
  });
  	await app.listen(4000);
}
bootstrap();
