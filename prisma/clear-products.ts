// prisma/clear-products.ts
// Run this once to clear old products: npx tsx prisma/clear-products.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing all products...');

  // Delete all order items first (foreign key constraint)
  await prisma.orderItem.deleteMany({});
  console.log('✅ Deleted all order items');

  // Then delete all products
  await prisma.product.deleteMany({});
  console.log('✅ Deleted all products');

  console.log('🎉 Database cleared! Now run: npm run prisma:seed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });