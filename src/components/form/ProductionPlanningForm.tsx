// components/form/ProductionPlanningForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormData } from "@/types/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BasicInfoStep } from "./BasicInfoStep"
import { FabricDetailsStep } from "./FabricDetailsStep"
import { InternationalFabricsStep } from "./InternationalFabricsStep"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { validateStep } from '@/lib/validation'

const initialFormData: FormData = {
  startDate: '',
  endDate: '',
  productionPerDay: '',
  totalOrderQuantity: '',
  fabrics: [],
  hasInternationalFabric: null,
  chinaFabrics: [],
  majorFabric: '',
  trims: [],
  accessories: []
}

export function ProductionPlanningForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNextStep = () => {
    const validation = validateStep(step, formData)
    if (validation.isValid) {
      setStep((prev) => prev + 1)
    } else {
      validation.errors.forEach((error) => {
        toast.error(error)
      })
    }
  }

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = async () => {
    const validation = validateStep(step, formData)
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error)
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Get existing submissions from localStorage
      const existingSubmissions = localStorage.getItem('productionFormSubmissions')
      const submissions = existingSubmissions 
        ? JSON.parse(existingSubmissions) 
        : []
      
      // Add new submission with timestamp
      const newSubmission = {
        ...formData,
        submittedAt: new Date().toISOString(),
        id: Date.now().toString() // unique identifier
      }
      
      submissions.push(newSubmission)

      // Save to localStorage
      localStorage.setItem('productionFormSubmissions', JSON.stringify(submissions))

      // Show success message
      toast.success('Form submitted successfully', {
        description: 'Redirecting to submissions page...'
      })

      // Reset form
      setFormData(initialFormData)
      setStep(1)

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/submissions')
      }, 1500)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      case 2:
        return (
          <FabricDetailsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      case 3:
        return (
          <InternationalFabricsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex items-center ${
              stepNumber !== 3 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber !== 3 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  stepNumber < step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Fabric Details'}
            {step === 3 && 'International Fabrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Description */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">
            {step === 1 && 'Enter the basic production details including dates and quantities.'}
            {step === 2 && 'Add and configure the fabrics needed for production.'}
            {step === 3 && 'Specify international fabric requirements and select the major fabric.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}