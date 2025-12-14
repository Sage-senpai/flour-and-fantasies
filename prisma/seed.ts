// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bakery.com' },
    update: {},
    create: {
      email: 'admin@bakery.com',
      name: 'Daniella',
      hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Sample products with working placeholder images
  const products = [
    {
      name: 'Rose Velvet Cake',
      slug: 'rose-velvet-cake',
      price: 45.99,
      category: 'Cakes',
      description: 'Ethereal rose-infused velvet cake with cream cheese frosting and edible rose petals.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
      stock: 12,
    },
    {
      name: 'Chocolate Dream Cake',
      slug: 'chocolate-dream-cake',
      price: 42.99,
      category: 'Cakes',
      description: 'Decadent triple-layer chocolate cake with rich ganache and chocolate shavings.',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=400&fit=crop',
      stock: 15,
    },
    {
      name: 'Vanilla Cloud Cake',
      slug: 'vanilla-cloud-cake',
      price: 39.99,
      category: 'Cakes',
      description: 'Light and fluffy vanilla sponge with whipped cream frosting and fresh berries.',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop',
      stock: 10,
    },
    {
      name: 'Strawberry Bliss Cake',
      slug: 'strawberry-bliss-cake',
      price: 48.99,
      category: 'Cakes',
      description: 'Fresh strawberry cake with strawberry compote layers and vanilla buttercream.',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop',
      stock: 8,
    },
    {
      name: 'Pink Macarons Box',
      slug: 'pink-macarons-box',
      price: 24.99,
      category: 'Pastries',
      description: 'Box of 12 delicate French macarons in rose, vanilla, and raspberry flavors.',
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&h=400&fit=crop',
      stock: 20,
    },
    {
      name: 'Cream Puffs',
      slug: 'cream-puffs',
      price: 18.99,
      category: 'Pastries',
      description: 'Light choux pastry filled with vanilla cream and dusted with powdered sugar.',
      image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600&h=400&fit=crop',
      stock: 25,
    },
    {
      name: 'Chocolate Eclairs',
      slug: 'chocolate-eclairs',
      price: 22.99,
      category: 'Pastries',
      description: 'Classic French eclairs with chocolate ganache and pastry cream filling.',
      image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=600&h=400&fit=crop',
      stock: 18,
    },
    {
      name: 'Raspberry Tarts',
      slug: 'raspberry-tarts',
      price: 28.99,
      category: 'Pastries',
      description: 'Buttery tart shells with vanilla cream and fresh raspberries.',
      image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=600&h=400&fit=crop',
      stock: 14,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });