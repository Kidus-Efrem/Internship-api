import { IsEmail, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { InternshipTrack } from '@prisma/client';

export class CreateApplicantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(InternshipTrack)
  track: InternshipTrack;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}