import prismaclient from '@prisma/client';

const { PrismaClient } = prismaclient;
const prisma = new PrismaClient();

export default prisma;