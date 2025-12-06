import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { s3 } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const pincode = formData.get('pincode') as string
    const governmentId = formData.get('governmentId') as File
    const selfieWithId = formData.get('selfieWithId') as File

    // Validate required fields
    if (!name || !email || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    if (!governmentId) {
      return NextResponse.json({ error: 'Government ID is required' }, { status: 400 })
    }

    // Validate government ID file
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(governmentId.type)) {
      return NextResponse.json({ 
        error: 'Invalid government ID format. Only JPG, PNG, and PDF are allowed.' 
      }, { status: 400 })
    }

    if (governmentId.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Government ID file size must be less than 5MB' 
      }, { status: 400 })
    }

    // Validate selfie file if provided
    let selfieUrl = null
    if (selfieWithId) {
      if (!selfieWithId.type.startsWith('image/')) {
        return NextResponse.json({ 
          error: 'Selfie must be an image file (JPG or PNG)' 
        }, { status: 400 })
      }

      if (selfieWithId.size > 5 * 1024 * 1024) {
        return NextResponse.json({ 
          error: 'Selfie file size must be less than 5MB' 
        }, { status: 400 })
      }
    }

    // Upload government ID to S3
    const govtIdExtension = governmentId.name.split('.').pop()
    const govtIdFileName = `${session.user.id}-govt-id-${Date.now()}.${govtIdExtension}`
    const govtIdKey = `seller-documents/${govtIdFileName}`

    const govtIdBuffer = Buffer.from(await governmentId.arrayBuffer())
    const govtIdCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: govtIdKey,
      Body: govtIdBuffer,
      ContentType: governmentId.type,
      ServerSideEncryption: 'AES256',
      Metadata: {
        userId: session.user.id,
        uploadType: 'seller-government-id'
      }
    })

    await s3.send(govtIdCommand)
    const govtIdUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${govtIdKey}`

    // Upload selfie if provided
    if (selfieWithId) {
      const selfieExtension = selfieWithId.name.split('.').pop()
      const selfieFileName = `${session.user.id}-selfie-${Date.now()}.${selfieExtension}`
      const selfieKey = `seller-documents/${selfieFileName}`

      const selfieBuffer = Buffer.from(await selfieWithId.arrayBuffer())
      const selfieCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: selfieKey,
        Body: selfieBuffer,
        ContentType: selfieWithId.type,
        ServerSideEncryption: 'AES256',
        Metadata: {
          userId: session.user.id,
          uploadType: 'seller-selfie'
        }
      })

      await s3.send(selfieCommand)
      selfieUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${selfieKey}`
    }

    // Prepare seller details
    const sellerDetails = {
      name,
      email,
      address,
      city,
      state,
      pincode,
      govIdUrl: govtIdUrl,
      selfieUrl
    }

    // Update user as seller with pending status
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: 'SELLER',
        sellerStatus: 'PENDING',
        sellerDetails,
        name // Update name if changed
      }
    })

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({
      message: 'Application submitted successfully',
      status: 'PENDING'
    })

  } catch (error) {
    console.error('Seller application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' }, 
      { status: 500 }
    )
  }
}