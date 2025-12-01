import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class CategoryController {
    static async getAll(req: AuthRequest, res: Response) {
        try {
            const categories = await prisma.category.findMany({
                include: {
                    parent: true,
                    children: true,
                    _count: {
                        select: { items: true },
                    },
                },
                orderBy: { name: 'asc' },
            });
            return res.json(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const category = await prisma.category.findUnique({
                where: { id: parseInt(id) },
                include: {
                    parent: true,
                    children: true,
                    items: true,
                },
            });

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            return res.json(category);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, parentId, active } = req.body;

            const category = await prisma.category.create({
                data: {
                    name,
                    parentId: parentId || null,
                    active: active !== undefined ? active : true,
                },
                include: { parent: true, children: true },
            });

            return res.status(201).json(category);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, parentId, active } = req.body;

            const category = await prisma.category.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    parentId,
                    active,
                },
                include: { parent: true, children: true },
            });

            return res.json(category);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.category.delete({
                where: { id: parseInt(id) },
            });

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
