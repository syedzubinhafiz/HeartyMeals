import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto, LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate JWT tokens for user
   * @param user user object
   * @returns access and refresh tokens
   */
  async generateTokens(user: any): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const payload: JwtPayload = {
      sub: user.user_id,
      email: user.email,
      role: user.user_role,
      iat: Math.floor(Date.now() / 1000),
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      access_token,
      refresh_token,
      expires_in: 24 * 60 * 60, // 24 hours in seconds
    };
  }

  /**
   * Sanitize user data for response (remove sensitive information)
   * @param user user object
   * @returns sanitized user data
   */
  sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Register a new user
   * @param registerDto registration data
   * @returns registration response with tokens
   */
  async register(registerDto: RegisterUserDto): Promise<RegisterResponseDto> {
    try {
      // Create user
      const newUser = await this.userService.createUserWithPassword(registerDto);
      
      // Generate tokens
      const tokens = await this.generateTokens(newUser);
      
      // Return response
      return {
        message: 'User registered successfully',
        user: this.sanitizeUser(newUser),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Login user with email and password
   * @param loginDto login credentials
   * @returns login response with tokens
   */
  async login(loginDto: LoginUserDto): Promise<LoginResponseDto> {
    // Find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = await this.userService.comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Validate user from JWT payload
   * @param payload JWT payload
   * @returns user data
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return this.sanitizeUser(user);
  }
}
