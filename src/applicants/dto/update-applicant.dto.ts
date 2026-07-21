import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicantDto } from './create-applicant.dto';

import { ApplicationStatus, InternshipTrack } from '@prisma/client';

export class UpdateApplicantDto extends PartialType(CreateApplicantDto) {
 

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;


}