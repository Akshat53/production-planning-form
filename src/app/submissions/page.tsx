// app/submissions/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { FormData } from "@/types/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormData[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedSubmissions = localStorage.getItem('productionFormSubmissions')
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions))
    }
  }, [])

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
        <h1 className="text-2xl font-bold">Submitted Production Plans</h1>
      </div>

      <div className="space-y-6">
        {submissions.map((submission, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Submission {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <p>Start Date: {new Date(submission.startDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(submission.endDate).toLocaleDateString()}</p>
                  <p>Production Per Day: {submission.productionPerDay}</p>
                  <p>Total Order Quantity: {submission.totalOrderQuantity}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fabrics</h3>
                  <div className="space-y-2">
                    {submission.fabrics.map((fabric, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">{fabric.name}</p>
                        <p>Requirement: {fabric.perPieceRequirement} {fabric.unit}</p>
                        <p>Quantity: {fabric.quantity}</p>
                        <p>Processes: {fabric.processes.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">International Fabrics</h3>
                  <p>Has International Fabric: {submission.hasInternationalFabric ? 'Yes' : 'No'}</p>
                  {submission.hasInternationalFabric && (
                    <>
                      <p>China Fabrics: {submission.chinaFabrics.join(', ')}</p>
                      <p>Major Fabric: {submission.majorFabric}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No submissions yet
          </div>
        )}
      </div>
    </div>
  )
}