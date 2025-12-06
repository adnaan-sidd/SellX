import {
  loginSchema,
  signupSchema,
  createProductSchema,
  contactFormSchema,
  validateData,
  sanitizeHtml
} from '../validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        phone: '+919876543210',
        otp: '123456'
      }

      const result = validateData(loginSchema, validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBe('+919876543210')
        expect(result.data.otp).toBe('123456')
      }
    })

    it('should reject invalid phone number', () => {
      const invalidData = {
        phone: 'invalid-phone',
        otp: '123456'
      }

      const result = validateData(loginSchema, invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid OTP', () => {
      const invalidData = {
        phone: '+919876543210',
        otp: '12345' // Too short
      }

      const result = validateData(loginSchema, invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('should validate valid signup data', () => {
      const validData = {
        phone: '+919876543210',
        name: 'John Doe'
      }

      const result = validateData(signupSchema, validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBe('+919876543210')
        expect(result.data.name).toBe('John Doe')
      }
    })

    it('should reject invalid name', () => {
      const invalidData = {
        phone: '+919876543210',
        name: 'John123' // Contains numbers
      }

      const result = validateData(signupSchema, invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('createProductSchema', () => {
    it('should validate valid product data', () => {
      const validData = {
        title: 'iPhone 12 Pro Max',
        description: 'Excellent condition iPhone 12 Pro Max with all accessories',
        price: 45000,
        condition: 'Used',
        category: 'Electronics',
        subcategory: 'Mobiles',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }

      const result = validateData(createProductSchema, validData)
      expect(result.success).toBe(true)
    })

    it('should reject title too long', () => {
      const invalidData = {
        title: 'a'.repeat(71), // 71 characters, exceeds limit
        description: 'Good description',
        price: 1000,
        condition: 'New',
        category: 'Electronics',
        subcategory: 'Mobiles',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }

      const result = validateData(createProductSchema, invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid price', () => {
      const invalidData = {
        title: 'Test Product',
        description: 'Good description',
        price: -100, // Negative price
        condition: 'New',
        category: 'Electronics',
        subcategory: 'Mobiles',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }

      const result = validateData(createProductSchema, invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid pincode', () => {
      const invalidData = {
        title: 'Test Product',
        description: 'Good description',
        price: 1000,
        condition: 'New',
        category: 'Electronics',
        subcategory: 'Mobiles',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '40000' // Too short
      }

      const result = validateData(createProductSchema, invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('contactFormSchema', () => {
    it('should validate valid contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'general',
        message: 'This is a test message with enough content to pass validation.'
      }

      const result = validateData(contactFormSchema, validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'general',
        message: 'Valid message content'
      }

      const result = validateData(contactFormSchema, invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject message too short', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'general',
        message: 'Hi' // Too short
      }

      const result = validateData(contactFormSchema, invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello <script>alert("xss")</script>world</p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello world</p>')
    })

    it('should remove iframe tags', () => {
      const input = '<p>Content <iframe src="evil.com"></iframe>more content</p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Content more content</p>')
    })

    it('should remove event handlers', () => {
      const input = '<button onclick="alert(\'xss\')">Click me</button>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<button>Click me</button>')
    })

    it('should preserve safe content', () => {
      const input = '<p><strong>Bold text</strong> and <em>italic text</em></p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p><strong>Bold text</strong> and <em>italic text</em></p>')
    })
  })

})