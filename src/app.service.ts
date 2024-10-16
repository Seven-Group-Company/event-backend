import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}
  getHello(): string {
    const url = this.config.get<string>('DATABASE_URL');
    return url;
  }
}
