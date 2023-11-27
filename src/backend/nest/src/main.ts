import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
	dotenv.config();
  	const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: "http://localhost:3000" // Autorise les requêtes de l'application React
//   });
	app.enableCors()
  	await app.listen(4000);
}
bootstrap();
