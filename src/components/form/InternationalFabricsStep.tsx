// components/form/InternationalFabricsStep.tsx
'use client'

import { FormData } from "@/types/form"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InternationalFabricsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function InternationalFabricsStep({
  formData,
  updateFormData,
}: InternationalFabricsStepProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label>Is International Fabric Present?</Label>
          <RadioGroup
            value={formData.hasInternationalFabric?.toString()}
            onValueChange={(value) =>
              updateFormData({ hasInternationalFabric: value === 'true' })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="int-yes" />
              <Label htmlFor="int-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="int-no" />
              <Label htmlFor="int-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasInternationalFabric && (
          <div className="space-y-2">
            <Label>Select China Fabrics</Label>
            <div className="grid grid-cols-2 gap-2">
              {formData.fabrics.map((fabric) => (
                <div key={fabric.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`china-${fabric.name}`}
                    checked={formData.chinaFabrics.includes(fabric.name)}
                    onChange={() => {
                      const newChinaFabrics = formData.chinaFabrics.includes(
                        fabric.name
                      )
                        ? formData.chinaFabrics.filter((f) => f !== fabric.name)
                        : [...formData.chinaFabrics, fabric.name]
                      updateFormData({ chinaFabrics: newChinaFabrics })
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`china-${fabric.name}`}>{fabric.name}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Choose Major Fabric</Label>
          <Select
            value={formData.majorFabric}
            onValueChange={(value) => updateFormData({ majorFabric: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select major fabric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {formData.fabrics.map((fabric) => (
                <SelectItem key={fabric.name} value={fabric.name}>
                  {fabric.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}