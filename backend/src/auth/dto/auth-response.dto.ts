import { User } from '../../user/user.entity';

export class AuthResponseDto {
  user: Partial<User>; // User data without sensitive information
  access_token: string;
  refresh_token: string;
  expires_in: number; // Token expiration time in seconds
}

export class LoginResponseDto {
  message: string;
  user: Partial<User>;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class RegisterResponseDto {
  message: string;
  user: Partial<User>;
  access_token: string;
  refresh_token: string;
  expires_in: number;
} 