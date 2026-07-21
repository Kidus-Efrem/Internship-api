import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
	constructor(private prisma: PrismaService){}
	async getSummary(){
		const [
      total,
      pending,
      shortlisted,
      accepted,
      rejected,
      frontend,
      backend,
      mobile,
      uiux,
      dataAnalytics
    ]  = await Promise.all([
		this.prisma.applicant.count({where:{deletedAt:null}}),
		this.prisma.applicant.count({where:{status:'PENDING'}}),
		this.prisma.applicant.count({where:{status:'SHORTLISTED'}}),
		this.prisma.applicant.count({where:{status:'ACCEPTED'}}),
		this.prisma.applicant.count({where:{status:"REJECTED"}}),
		this.prisma.applicant.count({where:{status:"REJECTED"}}),
		this.prisma.applicant.count({where:{track:"FRONTEND"}}),
		this.prisma.applicant.count({where:{track:"BACKEND"}}),
		this.prisma.applicant.count({where:{track:"MOBILE"}}),
		this.prisma.applicant.count({where:{track:"UI_UX"}}),
		this.prisma.applicant.count({where:{track:"DATA_ANALYTICS"}}),


	])
	 return {
      totalApplicants: total,
      byStatus: {
        PENDING: pending,
        SHORTLISTED: shortlisted,
        ACCEPTED: accepted,
        REJECTED: rejected,
      },
      byTrack: {
        FRONTEND: frontend,
        BACKEND: backend,
        MOBILE: mobile,
        UI_UX: uiux,
        DATA_ANALYTICS: dataAnalytics,
      },
    };
	}

	}
