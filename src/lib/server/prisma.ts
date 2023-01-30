declare global {
	var prisma: PrismaClient;
}

import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

const prismaEdge: PrismaClient = new PrismaClientEdge();

export { prisma, prismaEdge };
