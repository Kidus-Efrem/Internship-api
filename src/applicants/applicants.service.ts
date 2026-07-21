import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApplicantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateApplicantDto) {
    try {
      return await this.prisma.applicant.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email address is already registered');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.applicant.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const applicant = await this.prisma.applicant.findFirst({
      where: { id, deletedAt: null },
    });

    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${id} not found`);
    }

    return applicant;
  }

  async update(id: number, dto: UpdateApplicantDto) {
    await this.findOne(id);

    if (dto.status) {
      const currentApplicant = await this.prisma.applicant.findUnique({ where: { id } });

      if (currentApplicant.status === 'REJECTED' && dto.status === 'ACCEPTED') {
        throw new BadRequestException('Cannot move an applicant directly from Rejected to Accepted');
      }
    }

    return this.prisma.applicant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}