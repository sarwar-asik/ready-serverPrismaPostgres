// import { Users } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertDB = async (data: any): Promise<any> => {
  const result = await prisma.Users.create({
    data,
  });

  return result;
};

export const UsersService = { insertDB };
