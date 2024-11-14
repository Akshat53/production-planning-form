// components/form/FabricDetailsStep.tsx
'use client'

import { useState, useEffect } from 'react'
import { FormData, FabricDetails } from "@/types/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus, AlertCircle } from "lucide-react"
import { FABRICS, PROCESSES } from "@/lib/constants"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { validateFabricDetails, validateQuantity } from '@/lib/validation'

interface FabricDetailsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function FabricDetailsStep({ formData, updateFormData }: FabricDetailsStepProps) {
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({})

  useEffect(() => {
    const usedFabrics = formData.fabrics.map(f => f.name).filter(Boolean)
    const newAvailableFabrics = FABRICS.filter(f => !usedFabrics.includes(f))
    setAvailableFabrics(newAvailableFabrics)
  }, [formData.fabrics])

  const handleAddFabric = () => {
    if (formData.fabrics.length >= FABRICS.length) {
      toast.error("Maximum fabric limit reached")
      return
    }

    const newFabric: FabricDetails = {
      name: '',
      perPieceRequirement: '',
      unit: 'metre',
      processes: [],
      color: '',
      quantity: '',
      skippedStages: []
    }
    
    updateFormData({
      fabrics: [...formData.fabrics, newFabric]
    })
  }

  const handleRemoveFabric = (index: number) => {
    const newFabrics = [...formData.fabrics]
    const removedFabric = newFabrics[index]
    if (removedFabric.name) {
      setAvailableFabrics(prev => [...prev, removedFabric.name].sort())
    }
    newFabrics.splice(index, 1)
    updateFormData({ fabrics: newFabrics })
    
    // Clear validation errors for removed fabric
    const newErrors = { ...validationErrors }
    delete newErrors[`fabric-${index}`]
    setValidationErrors(newErrors)
  }

  const validateFabric = (fabric: FabricDetails, index: number) => {
    const validation = validateFabricDetails(fabric)
    if (!validation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [`fabric-${index}`]: validation.errors
      }))
    } else {
      const newErrors = { ...validationErrors }
      delete newErrors[`fabric-${index}`]
      setValidationErrors(newErrors)
    }
    return validation.isValid
  }

  const handleFabricChange = (index: number, field: keyof FabricDetails, value: string | string[]) => {
    const newFabrics = [...formData.fabrics]
    const oldFabric = newFabrics[index]

    if (field === 'name' && typeof value === 'string') {
      if (oldFabric.name) {
        setAvailableFabrics(prev => [...prev, oldFabric.name].sort())
      }
      setAvailableFabrics(prev => prev.filter(f => f !== value))
    }

    newFabrics[index] = { ...oldFabric, [field]: value }
    updateFormData({ fabrics: newFabrics })

    // Validate the updated fabric
    validateFabric(newFabrics[index], index)
  }

  const handleQuantityChange = (index: number, value: string) => {
    const validation = validateQuantity(
      value,
      index,
      formData.fabrics,
      formData.totalOrderQuantity
    )

    if (validation.isValid) {
      handleFabricChange(index, 'quantity', value)
    } else {
      validation.errors.forEach(error => {
        toast.error(error)
      })
    }
  }

  const renderFabricErrors = (index: number) => {
    const errors = validationErrors[`fabric-${index}`]
    if (!errors || errors.length === 0) return null

    return (
      <div className="mt-2 p-2 bg-red-50 rounded">
        <ul className="text-sm text-red-600 space-y-1">
          {errors.map((error, i) => (
            <li key={i} className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {formData.fabrics.map((fabric, index) => (
        <Card key={index} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => handleRemoveFabric(index)}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Fabric {index + 1}</CardTitle>
              {validationErrors[`fabric-${index}`]?.length > 0 && (
                <Badge variant="destructive">
                  Has Errors
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  Fabric Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Select a fabric from the available options
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={fabric.name}
                  onValueChange={(value) => handleFabricChange(index, 'name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fabric" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFabrics.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Per Piece Requirement</Label>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={fabric.perPieceRequirement}
                  onChange={(e) =>
                    handleFabricChange(index, 'perPieceRequirement', e.target.value)
                  }
                  placeholder="Enter requirement"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <RadioGroup
                value={fabric.unit}
                onValueChange={(value) =>
                  handleFabricChange(index, 'unit', value as 'metre' | 'kg')
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metre" id={`metre-${index}`} />
                  <Label htmlFor={`metre-${index}`}>Metre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id={`kg-${index}`} />
                  <Label htmlFor={`kg-${index}`}>Kg</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Processes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-lg p-3 bg-gray-50">
                {PROCESSES.map((process) => (
                  <div key={process} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${process}-${index}`}
                      checked={fabric.processes.includes(process)}
                      onChange={() => {
                        const newProcesses = fabric.processes.includes(process)
                          ? fabric.processes.filter(p => p !== process)
                          : [...fabric.processes, process]
                        handleFabricChange(index, 'processes', newProcesses)
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label 
                      htmlFor={`${process}-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      {process}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                type="text"
                value={fabric.color}
                onChange={(e) =>
                  handleFabricChange(index, 'color', e.target.value)
                }
                placeholder="Enter color"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Quantity
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 ml-2 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Cannot exceed total order quantity ({formData.totalOrderQuantity})
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                type="number"
                min="1"
                value={fabric.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                placeholder="Enter quantity"
                className={`w-full ${
                  Number(fabric.quantity) > Number(formData.totalOrderQuantity)
                    ? 'border-red-500'
                    : ''
                }`}
              />
              {Number(fabric.quantity) > 0 && (
                <p className="text-sm text-gray-500">
                  {((Number(fabric.quantity) / Number(formData.totalOrderQuantity)) * 100).toFixed(1)}% of total order
                </p>
              )}
            </div>

            {renderFabricErrors(index)}

            {/* Summary Card */}
            {fabric.name && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Fabric Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Total Required:</span>{' '}
                    {(Number(fabric.perPieceRequirement) * Number(fabric.quantity)).toFixed(2)} {fabric.unit}
                  </div>
                  <div>
                    <span className="text-gray-600">Selected Processes:</span>{' '}
                    {fabric.processes.length}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button 
          onClick={handleAddFabric} 
          className="w-full max-w-md"
          disabled={formData.fabrics.length >= FABRICS.length}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Fabric
          {formData.fabrics.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({formData.fabrics.length}/{FABRICS.length})
            </span>
          )}
        </Button>
      </div>

      {/* Total Quantity Summary */}
      {formData.fabrics.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Total Quantity Allocated</h3>
                <p className="text-sm text-gray-600">
                  {formData.fabrics.reduce((sum, fabric) => sum + Number(fabric.quantity), 0)} of {formData.totalOrderQuantity}
                </p>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(formData.fabrics.reduce((sum, fabric) => sum + Number(fabric.quantity), 0) / Number(formData.totalOrderQuantity)) * 100}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {formData.fabrics.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="mb-4">
            <Plus className="h-8 w-8 mx-auto text-gray-400" />
          </div>
          <h3 className="font-medium mb-2">No Fabrics Added Yet</h3>
          <p className="text-sm">
            Click the button above to start adding fabrics to your production plan
          </p>
        </div>
      )}
    </div>
  )
}