import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from './config/keys';
import cors from 'cors';

const PORT = process.env.PORT || config.localPort;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('Eivolo site API')
        .setDescription('The Eivolo site API description')
        .setVersion('1.0')
        .addTag('messages')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // CORS settings
    const allowedOrigins = ['http://localhost:3000'];
    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };
    app.use(cors(options));

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
