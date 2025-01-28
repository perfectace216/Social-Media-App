import { PrismaClient } from '@prisma/client';

declare global {
	var prismaGlobal: PrismaClient;
}
