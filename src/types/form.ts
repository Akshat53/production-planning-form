// types/form.ts
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export type Unit = 'metre' | 'kg'

export interface FabricDetails {
  name: string
  perPieceRequirement: string
  unit: Unit
  processes: string[]
  color: string
  quantity: string
  skippedStages: string[]
}

export interface FormData {
  startDate: string
  endDate: string
  productionPerDay: string
  totalOrderQuantity: string
  fabrics: FabricDetails[]
  hasInternationalFabric: boolean | null
  chinaFabrics: string[]
  majorFabric: string
  trims: string[]
  accessories: string[]
}

export interface FormStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}