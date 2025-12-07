import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sellx.com' },
    update: {},
    create: {
      email: 'admin@sellx.com',
      phone: '+919876543210',
      name: 'SellX Admin',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
      city: 'Mumbai',
      state: 'Maharashtra'
    },
  })

  // Create sample categories
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      subcategories: {
        create: [
          { name: 'Smartphones' },
          { name: 'Laptops' },
          { name: 'Headphones' },
          { name: 'Cameras' }
        ]
      }
    },
    include: { subcategories: true }
  })

  const fashion = await prisma.category.upsert({
    where: { name: 'Fashion' },
    update: {},
    create: {
      name: 'Fashion',
      subcategories: {
        create: [
          { name: 'Men\'s Clothing' },
          { name: 'Women\'s Clothing' },
          { name: 'Shoes' },
          { name: 'Accessories' }
        ]
      }
    },
    include: { subcategories: true }
  })

  const home = await prisma.category.upsert({
    where: { name: 'Home & Garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      subcategories: {
        create: [
          { name: 'Furniture' },
          { name: 'Decor' },
          { name: 'Kitchen' },
          { name: 'Garden' }
        ]
      }
    },
    include: { subcategories: true }
  })

  // Create sample seller
  const sellerPassword = await bcrypt.hash('seller123', 10)
  const seller = await prisma.user.upsert({
    where: { email: 'seller@sellx.com' },
    update: {},
    create: {
      email: 'seller@sellx.com',
      phone: '+919876543211',
      name: 'John Seller',
      password: sellerPassword,
      role: Role.SELLER,
      sellerStatus: 'APPROVED',
      isVerified: true,
      city: 'Delhi',
      state: 'Delhi',
      sellerDetails: {
        businessName: 'TechHub Electronics',
        gstNumber: 'GST123456789',
        address: '123 Tech Street, Delhi',
        bankAccount: '1234567890',
        ifscCode: 'SBIN0001234'
      }
    },
  })

  // Create sample buyer
  const buyerPassword = await bcrypt.hash('buyer123', 10)
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@sellx.com' },
    update: {},
    create: {
      email: 'buyer@sellx.com',
      phone: '+919876543212',
      name: 'Jane Buyer',
      password: buyerPassword,
      role: Role.BUYER,
      isVerified: true,
      city: 'Bangalore',
      state: 'Karnataka'
    },
  })

  // Create sample products
  const products = [
    {
      sellerId: seller.id,
      title: 'iPhone 15 Pro Max',
      description: 'Brand new iPhone 15 Pro Max with 256GB storage. Comes with original box and accessories.',
      price: 149999,
      condition: 'New',
      categoryId: electronics.id,
      subcategoryId: electronics.subcategories[0].id,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    {
      sellerId: seller.id,
      title: 'MacBook Pro M3',
      description: 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for professionals.',
      price: 199999,
      condition: 'New',
      categoryId: electronics.id,
      subcategoryId: electronics.subcategories[1].id,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    {
      sellerId: seller.id,
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Premium noise-canceling wireless headphones with exceptional sound quality.',
      price: 29999,
      condition: 'New',
      categoryId: electronics.id,
      subcategoryId: electronics.subcategories[2].id,
      images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'],
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Database seeded successfully!')
  console.log('Admin login: admin@sellx.com / admin123')
  console.log('Seller login: seller@sellx.com / seller123')
  console.log('Buyer login: buyer@sellx.com / buyer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })