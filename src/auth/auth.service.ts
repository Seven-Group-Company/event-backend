import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as speakeasy from 'speakeasy';
import { generateQR } from 'src/helpers/qr-codeGenerator';
import { UtilsService } from 'src/utils/utils.service';
import { userTemplate } from 'src/helpers/emailTemplates/createUserTemplate';
import { otpTemplate } from 'src/helpers/emailTemplates/OTPTemplate';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly utils: UtilsService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    try {
      const { name, email, photo } = dto;
      const checkExistance = await this.prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (checkExistance) {
        return {
          success: false,
          statusCode: 404,
          message: 'User Already Exists',
          data: null,
        };
      }

      const secret = speakeasy.generateSecret({
        length: 20,
        name: `SGC-Event-Mgt (${email})`,
        issuer: 'SGC-Insurance',
      });

      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          name: dto.name,
          createdBy: 1,
          photo,
          mfa: {
            create: {
              mfaSecret: secret.base32,
              mfaQrCode: await generateQR(secret.otpauth_url),
              mfaEnabled: false,
            },
          },
        },
      });
      const emailData = {
        name,
      };

      // Send OTP to user
      await this.utils.sendEmail(userTemplate(emailData), email, 'OTP');
      return {
        success: true,
        statusCode: 200,
        message: 'User Created successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      };
    }
  }

  loginUser = async (dto: AuthDto) => {
    const { email } = dto;
    try {
      const existance: { id: number; name: string; email: string } =
        await this.prisma.users.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      if (!existance) {
        return {
          success: false,
          statusCode: 404,
          message: 'Invalid Email',
          data: null,
        };
      }
      const otpExistance = await this.prisma.otp.findUnique({
        where: {
          email,
        },
      });

      if (otpExistance) {
        const otp = speakeasy.totp({
          secret: otpExistance.otp,
          encoding: 'base32',
        });

        const emailData = {
          name: existance.name,
          otp,
        };

        // Send OTP to user
        this.utils.sendEmail(otpTemplate(emailData), email, 'OTP');
        return {
          success: true,
          statusCode: 200,
          message: 'OTP sent successfully',
          data: null,
        };
      }

      // Create OPT Secret
      const createSecret = await this.prisma.otp.create({
        data: {
          email,
          otp: speakeasy.generateSecret({ length: 20 }).base32,
        },
        select: {
          id: true,
          otp: true,
        },
      });

      // Generate OTP
      const otp = speakeasy.totp({
        secret: createSecret.otp,
        encoding: 'base32',
      });
      const emailData = {
        name: existance.name,
        otp,
      };
      console.log(otp);
      // Send OTP to user
      this.utils.sendEmail(otpTemplate(emailData), email, 'OTP');
      return {
        success: true,
        statusCode: 200,
        message: 'OTP sent successfully',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      };
    }
  };

  verifyOTP = async (dto: AuthDto) => {
    const OTP_EXPIRATION_TIME = 300;
    const { email, otp } = dto;
    try {
      const existance: any = await this.prisma.otp.findUnique({
        where: {
          email,
        },
        select: {
          otp: true,
          user: {
            select: {
              id: true,
              active: true,
              email: true,
              name: true,
              photo: true,
              mfa: {
                select: {
                  mfaQrCode: true,
                  mfaEnabled: true,
                },
              },
            },
          },
        },
      });

      if (!existance) {
        return {
          success: false,
          statusCode: 404,
          message: 'Invalid Email',
          data: null,
        };
      }
      const currentTime = Date.now();
      if (currentTime - existance.createdAt > OTP_EXPIRATION_TIME * 1000) {
        return {
          success: false,
          statusCode: 404,
          message: 'OTP expired',
          data: null,
        };
      }

      const verified = speakeasy.totp.verify({
        secret: existance.otp,
        encoding: 'base32',
        token: otp,
        window: 1, // Accepts OTPs generated up to one time step before or after the current time
      });

      if (verified) {
        await this.prisma.otp.delete({
          where: {
            email,
          },
        });

        return {
          success: true,
          statusCode: 200,
          message: 'Login Successfull',
          data: {
            mfaQrCode: existance.user?.mfa?.mfaQrCode,
            mfaEnabled: existance.user?.mfa?.mfaEnabled,
          },
        };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: 'Invalid OTP',
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: null,
        error: error.message,
      };
    }
  };

  verifyMFA = async (dto: AuthDto) => {
    const { email, token } = dto;

    const existance: any = await this.prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
        mfa: true,
      },
    });

    if (email === existance.email) {
      const verified = speakeasy.totp.verify({
        secret: existance.mfa?.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 1, // Accepts OTPs generated up to one time step before or after the current time
      });

      if (verified) {
        const token = await this.jwtService.signAsync(existance);

        await this.prisma.mfa.update({
          where: {
            email,
          },
          data: {
            mfaEnabled: true,
          },
        });
        return {
          success: true,
          statusCode: 200,
          message: 'MFA verified successfully',
          data: { token: token },
        };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: 'Invalid Verification Code',
          data: null,
        };
      }
    } else {
      return {
        success: false,
        statusCode: 404,
        message: 'Invalid Email',
        data: null,
      };
    }
  };
}
