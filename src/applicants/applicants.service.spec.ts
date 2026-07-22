import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('ApplicantsService', () => {
  let service: ApplicantsService;

  // 1. Create the "Stunt Double" (Mock) for Prisma
  const mockPrismaService = {
    applicant: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  // 2. Setup: Run this before every single test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        { provide: PrismaService, useValue: mockPrismaService }, // Inject the stunt double!
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
  });

  // 3. Clear the mock's memory after each test so tests don't interfere with each other
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create an applicant', async () => {
      const createDto = { name: 'John', email: 'john@test.com', track: 'BACKEND' as any };
      const mockApplicant = { id: 1, ...createDto, status: 'PENDING', deletedAt: null };

      // Tell the stunt double: "When create is called, return this fake applicant"
      mockPrismaService.applicant.create.mockResolvedValue(mockApplicant);

      const result = await service.create(createDto);

      expect(result).toEqual(mockApplicant);
      expect(mockPrismaService.applicant.create).toHaveBeenCalledWith({ data: createDto });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = { name: 'John', email: 'john@test.com', track: 'BACKEND' as any };

      // Tell the stunt double to simulate a Prisma unique constraint error (P2002)
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '6.0.0',
      });
      mockPrismaService.applicant.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if moving from REJECTED to ACCEPTED', async () => {
      const applicantId = 1;
      const updateDto = { status: 'ACCEPTED' as any };

      // Stunt double pretends the current applicant is REJECTED
      mockPrismaService.applicant.findFirst.mockResolvedValue({
        id: applicantId,
        status: 'REJECTED',
        deletedAt: null,
      });

      await expect(service.update(applicantId, updateDto)).rejects.toThrow(
        new BadRequestException('Cannot move an applicant directly from Rejected to Accepted'),
      );
    });

    it('should throw NotFoundException if applicant does not exist', async () => {
      const applicantId = 999;
      const updateDto = { status: 'SHORTLISTED' as any };

      // Stunt double pretends the applicant doesn't exist
      mockPrismaService.applicant.findFirst.mockResolvedValue(null);

      await expect(service.update(applicantId, updateDto)).rejects.toThrow(
        new NotFoundException(`Applicant with ID ${applicantId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete an applicant by setting deletedAt', async () => {
      const applicantId = 1;
      const mockApplicant = { id: applicantId, status: 'PENDING', deletedAt: null };

      mockPrismaService.applicant.findFirst.mockResolvedValue(mockApplicant);
      mockPrismaService.applicant.update.mockResolvedValue({ ...mockApplicant, deletedAt: new Date() });

      const result = await service.remove(applicantId);

      expect(result.deletedAt).toBeDefined(); // Check that deletedAt is now set
      expect(mockPrismaService.applicant.update).toHaveBeenCalledWith({
        where: { id: applicantId },
        data: { deletedAt: expect.any(Date) }, // Check that we passed a Date object
      });
    });
  });
});