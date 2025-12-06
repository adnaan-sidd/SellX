"use client"

import { useRouter } from "next/navigation"
import {
  UserCheck,
  FileText,
  Camera,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Upload,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react"

export default function VerificationHelp() {
  const router = useRouter()

  const acceptedDocuments = [
    {
      type: "Government ID",
      documents: ["Aadhaar Card", "PAN Card", "Passport", "Driving License", "Voter ID"],
      requirements: ["Clear, readable text", "Valid, non-expired", "Full document visible"],
      icon: FileText
    },
    {
      type: "Address Proof",
      documents: ["Utility Bill", "Bank Statement", "Rental Agreement", "Property Tax Receipt"],
      requirements: ["Recent (within 3 months)", "Shows full address", "Official document"],
      icon: Shield
    },
    {
      type: "Business Documents",
      documents: ["GST Certificate", "Business License", "Partnership Deed", "Company Incorporation"],
      requirements: ["Valid and current", "Shows business details", "Official registration"],
      icon: UserCheck
    }
  ]

  const verificationSteps = [
    {
      step: 1,
      title: "Choose Verification Type",
      description: "Select buyer or seller verification from your account",
      details: [
        "Buyer verification unlocks contact features",
        "Seller verification enables product listings",
        "Both require different document sets"
      ]
    },
    {
      step: 2,
      title: "Prepare Documents",
      description: "Gather required documents in digital format",
      details: [
        "Scan documents clearly",
        "Ensure good lighting and focus",
        "Check file size limits (max 5MB)",
        "Use PDF or high-quality images"
      ]
    },
    {
      step: 3,
      title: "Upload Documents",
      description: "Submit documents through the verification portal",
      details: [
        "Follow upload guidelines",
        "Provide additional details if requested",
        "Double-check all information",
        "Submit during business hours for faster processing"
      ]
    },
    {
      step: 4,
      title: "Wait for Review",
      description: "Verification team reviews your submission",
      details: [
        "Typical processing: 24-48 hours",
        "Complex cases may take longer",
        "You'll receive email notification",
        "Check status in your account dashboard"
      ]
    }
  ]

  const uploadGuidelines = [
    {
      guideline: "File Format",
      details: "PDF, JPG, PNG files accepted",
      icon: "📄"
    },
    {
      guideline: "File Size",
      details: "Maximum 5MB per file",
      icon: "📏"
    },
    {
      guideline: "Image Quality",
      details: "High resolution, clear text, good lighting",
      icon: "📸"
    },
    {
      guideline: "Document Validity",
      details: "All documents must be current and valid",
      icon: "✅"
    },
    {
      guideline: "Complete Information",
      details: "Ensure all text is readable and complete",
      icon: "👁️"
    },
    {
      guideline: "No Alterations",
      details: "Do not edit or modify documents",
      icon: "🚫"
    }
  ]

  const approvalTimelines = [
    {
      type: "Buyer Verification",
      timeline: "24-48 hours",
      notes: "Usually processed faster during business hours"
    },
    {
      type: "Seller Verification",
      timeline: "24-72 hours",
      notes: "May require additional business document review"
    },
    {
      type: "Document Corrections",
      timeline: "Additional 24-48 hours",
      notes: "After resubmitting corrected documents"
    },
    {
      type: "Appeals",
      timeline: "3-5 business days",
      notes: "For rejected applications with valid appeals"
    }
  ]

  const commonRejections = [
    {
      reason: "Unclear Documents",
      solutions: [
        "Retake photos with better lighting",
        "Ensure text is sharp and readable",
        "Use higher resolution camera",
        "Clean document before scanning"
      ]
    },
    {
      reason: "Expired Documents",
      solutions: [
        "Submit current, valid documents only",
        "Check expiry dates before uploading",
        "Renew documents if necessary",
        "Contact issuing authority for renewals"
      ]
    },
    {
      reason: "Incomplete Information",
      solutions: [
        "Fill all required fields",
        "Provide complete document sets",
        "Include all requested information",
        "Double-check submission before upload"
      ]
    },
    {
      reason: "Document Mismatch",
      solutions: [
        "Ensure name matches account details",
        "Verify address information",
        "Check document authenticity",
        "Contact support for clarification"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <UserCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Verification Instructions</h1>
            <p className="text-xl text-gray-600">Complete guide to account verification on SellX</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Accepted Documents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Accepted Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {acceptedDocuments.map((docType, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <docType.icon className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{docType.type}</h3>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {docType.documents.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {docType.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-blue-600 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Step-by-Step Verification Process</h2>
          </div>

          <div className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-800 font-bold">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Upload className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-blue-900">Upload Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadGuidelines.map((guideline, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{guideline.icon}</span>
                  <h3 className="font-semibold text-gray-900">{guideline.guideline}</h3>
                </div>
                <p className="text-gray-600 text-sm">{guideline.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Times */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Processing Times & Timelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvalTimelines.map((timeline, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{timeline.type}</h3>
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-lg font-medium text-orange-600">{timeline.timeline}</span>
                </div>
                <p className="text-sm text-gray-600">{timeline.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Rejection Reasons */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-red-900">Common Rejection Reasons & Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonRejections.map((rejection, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-red-900 mb-4">{rejection.reason}</h3>
                <ul className="space-y-2">
                  {rejection.solutions.map((solution, solIndex) => (
                    <li key={solIndex} className="flex items-start text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Selfie Verification */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Camera className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-green-900">Selfie Verification Requirements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-4">Photo Requirements</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Clear, well-lit face photo
                </li>
                <li className="flex items-center text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Full face visible (no sunglasses/glasses)
                </li>
                <li className="flex items-center text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Neutral background
                </li>
                <li className="flex items-center text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Recent photo (within 6 months)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-4">What NOT to Do</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Don't use filters or editing
                </li>
                <li className="flex items-center text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Don't wear hats or head coverings
                </li>
                <li className="flex items-center text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Don't use group photos
                </li>
                <li className="flex items-center text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Don't submit blurry or dark photos
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Was this verification guide helpful?</h2>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span>Yes, very helpful</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-100 text-red-800 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors">
              <ThumbsDown className="w-5 h-5" />
              <span>Could be better</span>
            </button>
          </div>
        </div>

        {/* Start Verification */}
        <div className="bg-green-600 text-white rounded-lg p-8 text-center">
          <UserCheck className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Ready to Get Verified?</h3>
          <p className="text-green-100 mb-6">
            Complete verification to unlock all platform features and build trust with other users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/verify-buyer')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Verify as Buyer
            </button>
            <button
              onClick={() => router.push('/become-seller')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Become a Seller
            </button>
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}