// changed for the reccommeded wat for singleton pattern, need to check if it works

// import { PrismaClient } from '@prisma/client';

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
// } else {
//     if (!global.prisma) {
//         global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
// }

// export default prisma;

import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      if (process.env.NODE_ENV === 'production') {
        PrismaSingleton.instance = new PrismaClient();
      } else {
        if (!(global as any).prisma) {
          (global as any).prisma = new PrismaClient();
        }
        PrismaSingleton.instance = (global as any).prisma;
      }
    }
    return PrismaSingleton.instance;
  }
}

export default PrismaSingleton.getInstance();