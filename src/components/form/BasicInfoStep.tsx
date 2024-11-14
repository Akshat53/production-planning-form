// components/form/BasicInfoStep.tsx
'use client'

import { FormData } from "@/types/form"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface BasicInfoStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData({ endDate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productionPerDay">Production Per Day Per Machine</Label>
            <Input
              id="productionPerDay"
              type="number"
              min="1"
              value={formData.productionPerDay}
              onChange={(e) => updateFormData({ productionPerDay: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalOrderQuantity">Total Order Quantity</Label>
            <Input
              id="totalOrderQuantity"
              type="number"
              min="1"
              value={formData.totalOrderQuantity}
              onChange={(e) => updateFormData({ totalOrderQuantity: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}