import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

const prisma = new PrismaClient();

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                jwtConfig.refreshSecret,
                { expiresIn: jwtConfig.refreshExpiresIn }
            );

            return res.json({
                token,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token provided' });
            }

            const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as any;

            const user = await prisma.user.findUnique({ where: { id: decoded.id } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            return res.json({ token });
        } catch (error) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
    }
}
