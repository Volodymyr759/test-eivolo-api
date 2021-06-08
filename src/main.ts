import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from './config/keys';

const PORT = process.env.PORT || config.localPort;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Eivolo site API')
        .setDescription('The Eivolo site API description')
        .setVersion('1.0')
        .addTag('messages')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    // 
}
bootstrap();
