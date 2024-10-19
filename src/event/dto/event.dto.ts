import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class EventDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  location: string;

  @IsDate()
  startDate: string;

  @IsDate()
  endDate: string;

  @IsBoolean()
  isRecurring: boolean;

  @IsNotEmpty()
  organizerId: string | number;
}
