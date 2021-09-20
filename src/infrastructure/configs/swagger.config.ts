import { DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_DESCRIPTION, SWAGGER_TAG, SWAGGER_TITLE, SWAGGER_VERSION } from '../constants';

export const getSwaggerConfig = () => {
    return new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .setVersion(SWAGGER_VERSION)
        .addTag(SWAGGER_TAG)
        .build();
};
