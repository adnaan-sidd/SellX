import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const seller1 = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      phone: '+919876543210',
      name: 'John Seller',
      role: 'SELLER',
      isVerified: true,
      sellerStatus: 'APPROVED'
    }
  })

  const seller2 = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      phone: '+919876543211',
      name: 'Jane Seller',
      role: 'SELLER',
      isVerified: true,
      sellerStatus: 'APPROVED'
    }
  })

  // Create sample products
  const products = [
    {
      sellerId: seller1.id,
      title: 'iPhone 14 Pro Max',
      description: 'Latest iPhone with excellent camera',
      price: 120000,
      condition: 'New',
      category: 'Electronics',
      subcategory: 'Mobiles',
      images: ['https://via.placeholder.com/400x400?text=iPhone'],
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      status: 'ACTIVE' as const
    },
    {
      sellerId: seller1.id,
      title: 'MacBook Pro M3',
      description: 'Powerful laptop for professionals',
      price: 180000,
      condition: 'New',
      category: 'Electronics',
      subcategory: 'Laptops',
      images: ['https://via.placeholder.com/400x400?text=MacBook'],
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      status: 'ACTIVE' as const
    },
    {
      sellerId: seller2.id,
      title: 'Honda City 2020',
      description: 'Well maintained sedan',
      price: 800000,
      condition: 'Used',
      category: 'Vehicles',
      subcategory: 'Cars',
      images: ['https://via.placeholder.com/400x400?text=Honda+City'],
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      status: 'ACTIVE' as const
    },
    {
      sellerId: seller2.id,
      title: 'Wooden Dining Table',
      description: 'Beautiful 6-seater dining table',
      price: 25000,
      condition: 'New',
      category: 'Home & Furniture',
      subcategory: 'Furniture',
      images: ['https://via.placeholder.com/400x400?text=Dining+Table'],
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      status: 'ACTIVE' as const
    },
    {
      sellerId: seller1.id,
      title: 'Nike Air Max Shoes',
      description: 'Comfortable running shoes',
      price: 8000,
      condition: 'New',
      category: 'Fashion',
      subcategory: 'Footwear',
      images: ['https://via.placeholder.com/400x400?text=Nike+Shoes'],
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      status: 'ACTIVE' as const
    }
  ]

  for (const product of products) {
    // Find or create category and subcategory
    const category = await prisma.category.upsert({
      where: { name: product.category },
      update: {},
      create: { name: product.category }
    })

    let subcategory = null
    if (product.subcategory) {
      subcategory = await prisma.subcategory.upsert({
        where: {
          name_categoryId: {
            name: product.subcategory,
            categoryId: category.id
          }
        },
        update: {},
        create: {
          name: product.subcategory,
          categoryId: category.id
        }
      })
    }

    await prisma.product.create({
      data: {
        sellerId: product.sellerId,
        title: product.title,
        description: product.description,
        price: product.price,
        condition: product.condition,
        categoryId: category.id,
        subcategoryId: subcategory?.id,
        images: product.images,
        city: product.city,
        state: product.state,
        pincode: product.pincode,
        status: product.status
      }
    })
  }

  console.log('Sample data seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })