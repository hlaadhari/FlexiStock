import { Response } from 'express';
import { PrismaClient, MovementType } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class StockController {
    static async getMovements(req: AuthRequest, res: Response) {
        try {
            const movements = await prisma.stockMovement.findMany({
                include: {
                    item: { select: { ref: true, name: true } },
                    user: { select: { name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
            return res.json(movements);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createMovement(req: AuthRequest, res: Response) {
        try {
            const { itemId, type, quantity, reason } = req.body;
            const userId = req.user!.id;

            // Start a transaction to update item quantity and create movement
            const result = await prisma.$transaction(async (tx) => {
                const item = await tx.item.findUnique({ where: { id: itemId } });

                if (!item) {
                    throw new Error('Item not found');
                }

                let newQuantity = item.quantity;
                if (type === MovementType.IN) {
                    newQuantity += quantity;
                } else if (type === MovementType.OUT) {
                    newQuantity -= quantity;
                    if (newQuantity < 0) {
                        throw new Error('Insufficient stock');
                    }
                } else if (type === MovementType.AUDIT) {
                    newQuantity = quantity; // Set to exact quantity for audit
                }

                await tx.item.update({
                    where: { id: itemId },
                    data: { quantity: newQuantity },
                });

                const movement = await tx.stockMovement.create({
                    data: {
                        itemId,
                        type,
                        quantity,
                        reason,
                        userId,
                    },
                    include: {
                        item: { select: { ref: true, name: true } },
                        user: { select: { name: true, email: true } },
                    },
                });

                return movement;
            });

            return res.status(201).json(result);
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ error: error.message || 'Internal server error' });
        }
    }

    static async getItemMovements(req: AuthRequest, res: Response) {
        try {
            const { itemId } = req.params;

            const movements = await prisma.stockMovement.findMany({
                where: { itemId: parseInt(itemId) },
                include: {
                    user: { select: { name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
            });

            return res.json(movements);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
