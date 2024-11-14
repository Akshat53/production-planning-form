'use client'

import { useEffect, useState } from 'react'
import { FormData } from "@/types/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Package, Factory, BoxesIcon, Plane } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Production Plans</h1>
          <p className="text-gray-500 mt-2">View all submitted production plans and their details</p>
        </div>

        {submissions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Factory className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
              <p className="text-gray-500">Start by creating your first production plan</p>
              <Button 
                className="mt-4"
                onClick={() => router.push('/')}
              >
                Create Production Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Production Plan #{index + 1}
                    </CardTitle>
                    <Badge variant="secondary">
                      {submission.hasInternationalFabric ? 'International' : 'Domestic'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Start Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(submission.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">End Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(submission.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Factory className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Production Per Day:</span>
                          <span className="ml-2 font-medium">
                            {submission.productionPerDay}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <BoxesIcon className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Total Order Quantity:</span>
                          <span className="ml-2 font-medium">
                            {submission.totalOrderQuantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fabrics Information */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Fabrics</h3>
                      <div className="space-y-4">
                        {submission.fabrics.map((fabric, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <div className="font-medium text-gray-900 mb-2">{fabric.name}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-gray-600">
                                Requirement: <span className="text-gray-900">{fabric.perPieceRequirement} {fabric.unit}</span>
                              </div>
                              <div className="text-gray-600">
                                Quantity: <span className="text-gray-900">{fabric.quantity}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {fabric.processes.map((process, pidx) => (
                                <Badge key={pidx} variant="outline">{process}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* International Fabrics Section */}
                  {submission.hasInternationalFabric && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <Plane className="mr-2 h-4 w-4" />
                          International Fabrics
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">
                              China Fabrics:
                              <div className="mt-2 flex flex-wrap gap-2">
                                {submission.chinaFabrics.map((fabric, idx) => (
                                  <Badge key={idx} variant="secondary">{fabric}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Major Fabric:
                              <div className="mt-2">
                                <Badge variant="secondary">{submission.majorFabric}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}