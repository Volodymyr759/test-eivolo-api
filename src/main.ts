import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { getSwaggerConfig } from './infrastructure/configs/swagger.config';
import { ALLOWED_ORIGIN_HOSTS, LOCAL_PORT, SWAGGER_DESCRIPTION, SWAGGER_TAG, SWAGGER_TITLE, SWAGGER_VERSION } from './infrastructure/constants';

const PORT = process.env.PORT || LOCAL_PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .setVersion(SWAGGER_VERSION)
        .addTag(SWAGGER_TAG)
        .build();
    const swaggerConfig = getSwaggerConfig();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);

    // CORS settings
    const allowedOrigins = ALLOWED_ORIGIN_HOSTS;
    const options: cors.CorsOptions = {
        origin: allowedOrigins,
    };
    app.use(cors(options));
    app.setGlobalPrefix('api');
    app.use(cookieParser());

    await app.listen(PORT);
}

bootstrap();
