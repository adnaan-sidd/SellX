import { NextRequest, NextResponse } from 'next/server'

// Mock pincode data - in production, this would come from a real API
const PINCODE_DATA: Record<string, { city: string; state: string; district?: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', district: 'New Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai' },
  '560001': { city: 'Bangalore', state: 'Karnataka', district: 'Bangalore Urban' },
  '700001': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '500001': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  '411001': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  '201001': { city: 'Ghaziabad', state: 'Uttar Pradesh', district: 'Ghaziabad' },
  '122001': { city: 'Gurgaon', state: 'Haryana', district: 'Gurgaon' },
  '110096': { city: 'Delhi', state: 'Delhi', district: 'South Delhi' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai Suburban' },
  '560034': { city: 'Bangalore', state: 'Karnataka', district: 'Bangalore Urban' },
  '700032': { city: 'Kolkata', state: 'West Bengal', district: 'South 24 Parganas' },
  '600032': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  '500032': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  '302015': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  '411015': { city: 'Pune', state: 'Maharashtra', district: 'Pune' }
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get('pincode')

    if (!pincode) {
      return NextResponse.json({ error: 'Pincode is required' }, { status: 400 })
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode format' }, { status: 400 })
    }

    const locationData = PINCODE_DATA[pincode]

    if (!locationData) {
      return NextResponse.json({
        error: 'Location not found for this pincode',
        suggestions: [
          'Please verify the pincode',
          'Try nearby pincodes',
          'Contact support if pincode is correct'
        ]
      }, { status: 404 })
    }

    return NextResponse.json({
      city: locationData.city,
      state: locationData.state,
      district: locationData.district,
      pincode: pincode
    })

  } catch (error) {
    console.error('Pincode lookup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}