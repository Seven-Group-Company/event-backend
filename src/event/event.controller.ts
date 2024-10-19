import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Create a new Event
  @Post('create')
  async createEvent(@Body() dto: EventDto) {
    return await this.eventService.createEvent(dto);
  }

  // Get all Events
  @Get('list')
  async getAllEvents(@Request() req) {
    return this.eventService.getAllEvents(req);
  }

  // Get Event by ID
  @Get('get/:id')
  async getEventById(@Param('id') id: string) {
    return await this.eventService.getEventById(Number(id));
  }

  // Update Event by ID
  @Put('update/:id')
  async updateEvent(@Param('id') id: string, @Body() dto: EventDto) {
    return await this.eventService.updateEvent(Number(id), dto);
  }

  // Delete Event by ID
  @Delete('delete/:id')
  async deleteEvent(@Param('id') id: string) {
    return await this.eventService.deleteEvent(Number(id));
  }
}
