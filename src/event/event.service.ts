import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/response-service/response-service.service';
import { EventDto } from './dto';
import { Response } from 'express';
import { createObject } from 'src/helpers/objectCreator';

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private responseService: ResponseService,
  ) {}
  private res: Response;

  // Create an Event
  async createEvent(dto: EventDto) {
    try {
      const data = await this.prisma.event.create({
        data: {
          ...dto,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          organizerId: Number(dto.organizerId),
        },
      });
      return this.responseService.sendSuccess(this.res, data);
    } catch (error) {
      return this.responseService.sendServerError(this.res, error);
    }
  }

  // Get all Events
  async getAllEvents(req) {
    console.log(req);
    try {
      const data = await this.prisma.event.findMany();
      return this.responseService.sendSuccess(this.res, data);
    } catch (error) {
      return this.responseService.sendServerError(this.res, error);
    }
  }

  // Get Event by ID
  async getEventById(id: number | string) {
    try {
      const data = await this.prisma.event.findUnique({
        where: { id: Number(id) },
      });
      if (!data) {
        return this.responseService.sendNotFound(this.res);
      }
      return this.responseService.sendSuccess(this.res, data);
    } catch (error) {
      return this.responseService.sendServerError(this.res, error);
    }
  }

  // Update Event by ID
  async updateEvent(id: number | string, dto: EventDto) {
    try {
      const parseData = createObject(dto);

      ['startDate', 'endDate'].forEach((dateField) => {
        if (dateField in parseData && parseData[dateField]) {
          parseData[dateField] = new Date(parseData[dateField]);
        }
      });

      const data = await this.prisma.event.update({
        where: { id: Number(id) },
        data: {
          ...parseData,
          updatedAt: new Date(),
        },
      });
      return this.responseService.sendSuccess(this.res, data);
    } catch (error) {
      return this.responseService.sendServerError(this.res, error.message);
    }
  }

  // Delete Event by ID
  async deleteEvent(id: number) {
    try {
      const checkExistance = await this.getEventById(id);
      if (checkExistance.statusCode === 404) return checkExistance;
      const data = await this.prisma.event.delete({
        where: { id },
      });
      return this.responseService.sendSuccess(this.res, data);
    } catch (error) {
      return this.responseService.sendServerError(this.res, error);
    }
  }
}
