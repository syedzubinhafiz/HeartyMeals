import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


const session = require("express-session");
const passport = require("passport");


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }));  

  // Authentication & Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // to sign session id
      resave: false, // will default to false in near future: https://github.com/expressjs/session#resave
      saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
      rolling: true, // keep session alive
      cookie: {
        maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE), // session expires in 1 day, refreshed by `rolling: true` option.
        httpOnly: true, // so that cookie can't be accessed via client-side script
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3001);
}
bootstrap();
