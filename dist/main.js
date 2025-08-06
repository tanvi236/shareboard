"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.1.5:3000',
            'https://shareboard-frontend.vercel.app/'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'X-Requested-With',
            'Origin',
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Live Brainstorm API')
        .setDescription('API documentation for the collaborative visual brainstorming tool')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('boards', 'Board management endpoints')
        .addTag('blocks', 'Block management endpoints')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Live Brainstorm API Docs',
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = process.env.PORT || 5005;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
    console.log(`Image uploads: http://localhost:${port}/uploads/images/`);
}
bootstrap();
//# sourceMappingURL=main.js.map