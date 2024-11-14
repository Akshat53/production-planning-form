// lib/validations.ts
import { FormData, FabricDetails, ValidationResult } from "@/types/form"

export const validateBasicInfo = (data: FormData): ValidationResult => {
  const errors: string[] = []

  if (!data.startDate) {
    errors.push("Start date is required")
  }

  if (!data.endDate) {
    errors.push("End date is required")
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.push("Start date cannot be after end date")
  }

  if (!data.productionPerDay) {
    errors.push("Production per day is required")
  } else if (Number(data.productionPerDay) <= 0) {
    errors.push("Production per day must be greater than 0")
  }

  if (!data.totalOrderQuantity) {
    errors.push("Total order quantity is required")
  } else if (Number(data.totalOrderQuantity) <= 0) {
    errors.push("Total order quantity must be greater than 0")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFabricDetails = (fabric: FabricDetails): ValidationResult => {
  const errors: string[] = []

  if (!fabric.name) {
    errors.push("Fabric name is required")
  }

  if (!fabric.perPieceRequirement) {
    errors.push("Per piece requirement is required")
  } else if (Number(fabric.perPieceRequirement) <= 0) {
    errors.push("Per piece requirement must be greater than 0")
  }

  if (!fabric.unit) {
    errors.push("Unit selection is required")
  }

  if (!fabric.quantity) {
    errors.push("Quantity is required")
  } else if (Number(fabric.quantity) <= 0) {
    errors.push("Quantity must be greater than 0")
  }

  if (fabric.processes.length === 0) {
    errors.push("At least one process must be selected")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFabricsQuantity = (
  fabrics: FabricDetails[],
  totalOrderQuantity: string
): ValidationResult => {
  const errors: string[] = []
  const total = fabrics.reduce((sum, fabric) => sum + Number(fabric.quantity), 0)

  if (total > Number(totalOrderQuantity)) {
    errors.push("Sum of all fabric quantities cannot exceed total order quantity")
  }

  if (total < Number(totalOrderQuantity)) {
    errors.push("Sum of all fabric quantities must equal total order quantity")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateInternationalFabrics = (data: FormData): ValidationResult => {
  const errors: string[] = []

  if (data.hasInternationalFabric === null) {
    errors.push("Please specify if international fabric is present")
  }

  if (data.hasInternationalFabric === true) {
    if (data.chinaFabrics.length === 0) {
      errors.push("Please select at least one China fabric")
    }

    if (!data.majorFabric) {
      errors.push("Please select a major fabric")
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateStep = (step: number, formData: FormData): ValidationResult => {
  switch (step) {
    case 1:
      return validateBasicInfo(formData)
    
    case 2: {
      // First check if there are any fabrics
      if (formData.fabrics.length === 0) {
        return {
          isValid: false,
          errors: ["At least one fabric is required"]
        }
      }

      // Validate each fabric
      const fabricErrors: string[] = []
      formData.fabrics.forEach((fabric, index) => {
        const validation = validateFabricDetails(fabric)
        if (!validation.isValid) {
          validation.errors.forEach(error  => {
            fabricErrors.push(`Fabric ${index + 1}: ${error}`)
          })
        }
      })

      // Validate total quantity
      const quantityValidation = validateFabricsQuantity(
        formData.fabrics,
        formData.totalOrderQuantity
      )
      
      return {
        isValid: fabricErrors.length === 0 && quantityValidation.isValid,
        errors: [...fabricErrors, ...quantityValidation.errors]
      }
    }

    case 3:
      return validateInternationalFabrics(formData)

    default:
      return { isValid: true, errors: [] }
  }
}

// Helper functions
export const validateQuantity = (
  quantity: string,
  index: number,
  fabrics: FabricDetails[],
  totalOrderQuantity: string
): ValidationResult => {
  const errors: string[] = []
  const qty = Number(quantity)
  const totalQty = Number(totalOrderQuantity)

  if (qty > totalQty) {
    errors.push(`Quantity cannot exceed total order quantity (${totalQty})`)
  }

  const otherQuantitiesSum = fabrics
    .map(f => Number(f.quantity))
    .reduce((sum, current, idx) => idx !== index ? sum + current : sum, 0)

  if (qty + otherQuantitiesSum > totalQty) {
    errors.push('Sum of all fabric quantities cannot exceed total order quantity')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) {
    errors.push("Start date cannot be after end date")
  }

  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > 365) {
    errors.push("Date range cannot exceed one year")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}