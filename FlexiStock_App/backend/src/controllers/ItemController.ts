import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class ItemController {
    static async getAll(req: AuthRequest, res: Response) {
        try {
            const items = await prisma.item.findMany({
                include: {
                    category: true,
                },
            });
            return res.json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const item = await prisma.item.findUnique({
                where: { id: parseInt(id) },
                include: {
                    category: true,
                    movements: {
                        include: { user: { select: { name: true, email: true } } },
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                },
            });

            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            return res.json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        try {
            const { ref, name, categoryId, quantity, minStock, location, status } = req.body;

            const item = await prisma.item.create({
                data: {
                    ref,
                    name,
                    categoryId,
                    quantity: quantity || 0,
                    minStock: minStock || 0,
                    location,
                    status: status || 'ACTIVE',
                },
                include: { category: true },
            });

            return res.status(201).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { ref, name, categoryId, quantity, minStock, location, status } = req.body;

            const item = await prisma.item.update({
                where: { id: parseInt(id) },
                data: {
                    ref,
                    name,
                    categoryId,
                    quantity,
                    minStock,
                    location,
                    status,
                },
                include: { category: true },
            });

            return res.json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.item.delete({
                where: { id: parseInt(id) },
            });

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getLowStock(req: AuthRequest, res: Response) {
        try {
            const items = await prisma.item.findMany({
                where: {
                    quantity: {
                        lte: prisma.item.fields.minStock,
                    },
                },
                include: { category: true },
            });

            return res.json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
