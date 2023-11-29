import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as https from 'https';

async function bootstrap() {
	dotenv.config();

const cert = fs.readFileSync('/var/nest_cert.pem', 'utf8');
const key = fs.readFileSync('/var/nest_key.pem', 'utf8');

const httpsOptions = {
	key: key,
	cert: cert,
  };

const app = await NestFactory.create(AppModule, {
	httpsOptions
});
  app.enableCors({
    origin: "https://localhost:3000",
	credentials:true, // Autorise les requêtes de l'application React
  });
	app.enableCors()
  	await app.listen(4000);
}
bootstrap();
