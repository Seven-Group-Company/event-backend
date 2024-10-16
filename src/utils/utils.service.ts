import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UtilsService {
  constructor(private readonly config: ConfigService) {}

  async sendEmail(template: string, to: string, subject: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('EMAIL_HOST'),
      port: this.config.get<string>('EMAIL_PORT'),
      // service: "gmail",
      auth: {
        user: this.config.get<string>('EMAIL_HOST_USER'),
        pass: this.config.get<string>('EMAIL_HOST_PASSWORD'),
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `SGC-Events <${this.config.get<string>('USER_EMAIL')}>`,
      to,
      subject,
      html: template,
    };

    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        return 'Email sent';
      }
    });
  }
}
