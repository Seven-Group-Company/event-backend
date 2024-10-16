import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  photo: string;

  @IsString()
  token: string | number;

  @IsString()
  otp: string | number;
}
