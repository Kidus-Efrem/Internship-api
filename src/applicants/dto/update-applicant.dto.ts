import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicantDto } from './create-applicant.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus, InternshipTrack } from '@prisma/client';

export class UpdateApplicantDto extends PartialType(CreateApplicantDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(InternshipTrack)
  @IsOptional()
  track?: InternshipTrack;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}