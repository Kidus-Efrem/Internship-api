import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicantsService } from './applicants.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { GetApplicantsQueryDto } from './dto/get-applicants-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Applicants')
@ApiBearerAuth()
@Controller('api/applicants')
@UseGuards(JwtAuthGuard)
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  create(@Body() createApplicantDto: CreateApplicantDto) {
    return this.applicantsService.create(createApplicantDto);
  }

  @Get()
  findAll(@Query() query: GetApplicantsQueryDto) {
    return this.applicantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateApplicantDto: UpdateApplicantDto) {
    return this.applicantsService.update(id, updateApplicantDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicantsService.remove(id);
  }
}