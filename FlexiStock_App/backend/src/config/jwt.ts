export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecretkey',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
};
