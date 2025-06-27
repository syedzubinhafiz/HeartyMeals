import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
  sub: string;      // user_id
  email: string;    // user email
  role: string;     // Admin/Patient/Dietitian
  iat: number;      // issued at
  exp?: number;     // expiration (optional, set automatically by JWT library)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    // Return user info that will be attached to request.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  }
}
