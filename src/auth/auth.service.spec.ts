import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock bcrypt so we don't actually hash passwords during tests
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    admin: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginDto = { email: 'admin@test.com', password: 'password123' };
      const mockAdmin = { id: 1, email: 'admin@test.com', password: 'hashed_password' };

      // 1. Mock Prisma to find the admin
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      // 2. Mock bcrypt to say the password matches
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // 3. Mock JWT to return a fake token
      mockJwtService.signAsync.mockResolvedValue('fake-jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'fake-jwt-token' });
      expect(mockPrismaService.admin.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockAdmin.password);
    });

    it('should throw UnauthorizedException if admin is not found', async () => {
      const loginDto = { email: 'fake@test.com', password: 'password123' };

      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { email: 'admin@test.com', password: 'wrongpassword' };
      const mockAdmin = { id: 1, email: 'admin@test.com', password: 'hashed_password' };

      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password fails

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});