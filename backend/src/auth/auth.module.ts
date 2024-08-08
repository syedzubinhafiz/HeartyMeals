import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./session.serializer";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: "jwt" }),
  ],
  controllers: [AuthController],
  providers: [
    SessionSerializer,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AuthModule {}
