/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { Role } from "@prisma/client";
import config from "../config";
import prisma from "../shared/prisma";

export const seedSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await prisma.user.findFirst({
            where: {
                role:Role.super_admin,
            },
        });
        if (existingSuperAdmin) {
            // console.log('Super admin account already exists');
            return;
        }
   

      await prisma.user.create({
            data: {
            email: config.superAdmin.email as string,
            password: config.superAdmin.password as string,
            role: 'super_admin',
            is_active: true,
            is_verified: true
            },
        });
      
        console.log('Super admin account created successfully');
    } catch (error: any) {
        console.error('Error creating super admin account:', error.message);
    }
};