// constants.ts
export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'yourSecretKey', // Nên dùng biến môi trường cho an ninh
  };
  