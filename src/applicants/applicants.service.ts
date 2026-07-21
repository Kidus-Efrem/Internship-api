import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Prisma } from '@prisma/client';
import { GetApplicantsQueryDto } from './dto/get-applicants-query.dto';

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

    async findAll(query: GetApplicantsQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      track,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (track) {
      where.track = track;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.applicant.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.applicant.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
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
    // findOne already throws a 404 if it doesn't exist, and returns the applicant
    const currentApplicant = await this.findOne(id);

    if (dto.status) {
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