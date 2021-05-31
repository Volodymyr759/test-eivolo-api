import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/keys';

const PORT = process.env.PORT || config.localPort;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
    // 
}
bootstrap();
