import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResponseServiceModule } from 'src/response-service/response-service.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [PrismaModule, ResponseServiceModule],
  providers: [
    EventService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  controllers: [EventController],
})
export class EventModule {}
