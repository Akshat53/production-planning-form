export interface FabricDetails {
    name: string;
    perPieceRequirement: string;
    unit: 'metre' | 'kg';
    processes: string[];
    color: string;
    quantity: string;
    skippedStages: string[];
  }
  
  export interface FormData {
    startDate: string;
    endDate: string;
    productionPerDay: string;
    totalOrderQuantity: string;
    fabrics: FabricDetails[];
    hasInternationalFabric: boolean | null;
    chinaFabrics: string[];
    majorFabric: string;
    trims: string[];
    accessories: string[];
  }