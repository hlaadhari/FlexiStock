import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@flexistock.com' },
        update: {},
        create: {
            email: 'admin@flexistock.com',
            name: 'Admin User',
            password,
            role: Role.ADMIN,
        },
    });

    // Create Manager
    const manager = await prisma.user.upsert({
        where: { email: 'manager@flexistock.com' },
        update: {},
        create: {
            email: 'manager@flexistock.com',
            name: 'Manager User',
            password,
            role: Role.MANAGER,
        },
    });

    // Create User
    const user = await prisma.user.upsert({
        where: { email: 'user@flexistock.com' },
        update: {},
        create: {
            email: 'user@flexistock.com',
            name: 'Regular User',
            password,
            role: Role.USER,
        },
    });

    console.log({ admin, manager, user });

    // Create Categories
    const electronics = await prisma.category.create({
        data: {
            name: 'Electronics',
            children: {
                create: [
                    { name: 'Computers' },
                    { name: 'Phones' },
                ],
            },
        },
    });

    console.log({ electronics });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
