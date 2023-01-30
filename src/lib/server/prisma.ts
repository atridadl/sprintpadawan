import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { dev } from '$app/environment';
const prisma: PrismaClient = dev ? new PrismaClient() : new PrismaClientEdge();

export default prisma;
