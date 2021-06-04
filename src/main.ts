import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/keys';
import cors from 'cors';

const PORT = process.env.PORT || config.localPort;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = ['http://localhost:3000'];
    const options: cors.CorsOptions = { origin: allowedOrigins };
    app.use(cors(options));

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    // 
}
bootstrap();
