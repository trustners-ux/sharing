// ============================================================================
// TRUSTNER INSURANCE BROKERS - POSP PAYOUT DATA
// All commission data, categories, tier logic, and calculation functions
// ============================================================================

// --- Types ---
export type Category = 'A' | 'B' | 'C' | 'D' | 'D+' | 'E' | 'E+' | 'F1' | 'F2' | 'F3';
export type LOB = 'GI' | 'LI' | 'HI';
export type Tier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProductEntry {
  productLine: string;
  product: string;
  insurer: string;
  trustnerCommission: number; // e.g., 25 for 25%
  basis: string;
}

export interface PayoutResult {
  tier: Tier;
  sharingPercent: number;
  agentPayout: number;
  trustnerRetains: number;
}

// --- Categories ---
export const CATEGORIES: Category[] = ['A', 'B', 'C', 'D', 'D+', 'E', 'E+', 'F1', 'F2', 'F3'];

// --- Tier Sharing Percentages (Category × Tier → Sharing %) ---
export const TIER_SHARING: Record<Category, Record<Tier, number>> = {
  'A':  { HIGH: 65, MEDIUM: 55, LOW: 40 },
  'B':  { HIGH: 70, MEDIUM: 60, LOW: 45 },
  'C':  { HIGH: 75, MEDIUM: 65, LOW: 50 },
  'D':  { HIGH: 80, MEDIUM: 70, LOW: 55 },
  'D+': { HIGH: 82, MEDIUM: 72, LOW: 57 },
  'E':  { HIGH: 82, MEDIUM: 72, LOW: 57 },
  'E+': { HIGH: 85, MEDIUM: 75, LOW: 60 },
  'F1': { HIGH: 85, MEDIUM: 75, LOW: 60 },
  'F2': { HIGH: 88, MEDIUM: 78, LOW: 62 },
  'F3': { HIGH: 90, MEDIUM: 80, LOW: 65 },
};

// --- Tier Classification ---
export function getTier(commissionPercent: number): Tier {
  if (commissionPercent >= 30) return 'HIGH';
  if (commissionPercent >= 15) return 'MEDIUM';
  return 'LOW';
}

// --- Calculate Agent Payout ---
export function calculateAgentPayout(trustnerCommission: number, category: Category): PayoutResult {
  const tier = getTier(trustnerCommission);
  const sharingPercent = TIER_SHARING[category][tier];
  const agentPayout = +(trustnerCommission * sharingPercent / 100).toFixed(2);
  const trustnerRetains = +(trustnerCommission - agentPayout).toFixed(2);
  return { tier, sharingPercent, agentPayout, trustnerRetains };
}

// ============================================================================
// GENERAL INSURANCE DATA (144 products)
// ============================================================================
export const GI_DATA: ProductEntry[] = [
  // --- Motor - Two Wheeler (40 products) ---
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Scooter) - Metro", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Scooter) - Non-Metro", insurer: "ICICI Lombard", trustnerCommission: 20, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Bike) - Metro", insurer: "ICICI Lombard", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Bike) - Non-Metro", insurer: "ICICI Lombard", trustnerCommission: 10, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SATP (Standalone TP)", insurer: "ICICI Lombard", trustnerCommission: 2.5, basis: "TP Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SAOD (Standalone OD)", insurer: "ICICI Lombard", trustnerCommission: 20, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Fresh (1+5) - West Metro", insurer: "Bajaj Allianz", trustnerCommission: 57.5, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Fresh (1+5) - West Non-Metro", insurer: "Bajaj Allianz", trustnerCommission: 50, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Fresh (1+5) - North", insurer: "Bajaj Allianz", trustnerCommission: 50, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Fresh (1+5) - South", insurer: "Bajaj Allianz", trustnerCommission: 40, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Fresh (1+5) - East", insurer: "Bajaj Allianz", trustnerCommission: 45, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Comp (Old)", insurer: "Bajaj Allianz", trustnerCommission: 50, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SA OD", insurer: "Bajaj Allianz", trustnerCommission: 45, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW New (1+5) Scooter - Metro", insurer: "HDFC ERGO", trustnerCommission: 40, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW New (1+5) Scooter - Non-Metro", insurer: "HDFC ERGO", trustnerCommission: 35, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW New (1+5) Bike - Metro", insurer: "HDFC ERGO", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW New (1+5) Bike - Non-Metro", insurer: "HDFC ERGO", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Old Scooter Comp", insurer: "HDFC ERGO", trustnerCommission: 40, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Old Bike Comp", insurer: "HDFC ERGO", trustnerCommission: 20, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter SAOD", insurer: "HDFC ERGO", trustnerCommission: 30, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter AOTP", insurer: "HDFC ERGO", trustnerCommission: 45, basis: "TP Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW EV (All OEM)", insurer: "HDFC ERGO", trustnerCommission: 30, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundle (New Scooty) - East", insurer: "TATA AIG", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundle (New Scooty) - West", insurer: "TATA AIG", trustnerCommission: 40, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundle (New Bike) - East", insurer: "TATA AIG", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundle (New Bike) - West", insurer: "TATA AIG", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Rollover PKG", insurer: "TATA AIG", trustnerCommission: 32.5, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW STP Rollover", insurer: "TATA AIG", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Scooter)", insurer: "SBI General", trustnerCommission: 26, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Comprehensive (Bike <=600CC)", insurer: "SBI General", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SATP (Scooter)", insurer: "SBI General", trustnerCommission: 15, basis: "TP Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SATP - Bike", insurer: "Reliance General", trustnerCommission: 51.5, basis: "TP Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW SATP - Scooter", insurer: "Reliance General", trustnerCommission: 57.5, basis: "TP Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Fresh (1+5) Scooter - East", insurer: "Cholamandalam", trustnerCommission: 40, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Scooter Cat 0", insurer: "Kotak Zurich", trustnerCommission: 42, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bike Cat 0", insurer: "Kotak Zurich", trustnerCommission: 30, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundled New", insurer: "Oriental", trustnerCommission: 23, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Package", insurer: "Oriental", trustnerCommission: 16.5, basis: "Net Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundled (1+5) New", insurer: "National", trustnerCommission: 21, basis: "OD Premium" },
  { productLine: "Motor - Two Wheeler", product: "TW Bundle/Package", insurer: "United India", trustnerCommission: 17, basis: "Net Premium" },

  // --- Motor - Private Car (31 products) ---
  { productLine: "Motor - Private Car", product: "PVT CAR Comp (Petrol) - Metro", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp (Petrol) - Non-Metro", insurer: "ICICI Lombard", trustnerCommission: 20, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp (Diesel) - Metro", insurer: "ICICI Lombard", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp (Diesel) - Non-Metro", insurer: "ICICI Lombard", trustnerCommission: 10, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SATP", insurer: "ICICI Lombard", trustnerCommission: 2.5, basis: "TP Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Petrol - Metro", insurer: "Bajaj Allianz", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Petrol - Non-Metro", insurer: "Bajaj Allianz", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Diesel - All", insurer: "Bajaj Allianz", trustnerCommission: 10, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD", insurer: "Bajaj Allianz", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Petrol NCB (<10K OD)", insurer: "HDFC ERGO", trustnerCommission: 17.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Petrol NCB (10-50K OD)", insurer: "HDFC ERGO", trustnerCommission: 19.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Petrol NCB (50K-1L OD)", insurer: "HDFC ERGO", trustnerCommission: 21, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Petrol NCB (1L-2L OD)", insurer: "HDFC ERGO", trustnerCommission: 23, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Petrol NCB (>2L OD)", insurer: "HDFC ERGO", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR SAOD - Diesel", insurer: "HDFC ERGO", trustnerCommission: 15, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Petrol - Metro", insurer: "TATA AIG", trustnerCommission: 25, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Petrol - Non-Metro", insurer: "TATA AIG", trustnerCommission: 17.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Comp Diesel", insurer: "TATA AIG", trustnerCommission: 10, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Bundle (1+3) Honda/Hyundai/KIA", insurer: "TATA AIG", trustnerCommission: 30, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR NewComp - Platinum (Kolkata)", insurer: "SBI General", trustnerCommission: 60, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR NewComp - Silver (Kolkata)", insurer: "SBI General", trustnerCommission: 57, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Non-New Comp - Platinum", insurer: "SBI General", trustnerCommission: 49.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Non-New Comp - Silver", insurer: "SBI General", trustnerCommission: 46.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Petrol Comp - NCB", insurer: "Cholamandalam", trustnerCommission: 22, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR New Petrol Preferred RTO", insurer: "Kotak Zurich", trustnerCommission: 22.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Petrol NCB (1+1)", insurer: "Kotak Zurich", trustnerCommission: 20.5, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Bundled New", insurer: "Oriental", trustnerCommission: 26, basis: "OD Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Bundled (1+3) New", insurer: "National", trustnerCommission: 10, basis: "TP Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Bundle (1+3)", insurer: "United India", trustnerCommission: 15, basis: "Net Premium" },
  { productLine: "Motor - Private Car", product: "PVT CAR Petrol Comp", insurer: "Reliance General", trustnerCommission: 20, basis: "OD Premium" },

  // --- Motor - Commercial Vehicle (60 products) ---
  { productLine: "Motor - Commercial Vehicle", product: "GCV 3W - Comp", insurer: "ICICI Lombard", trustnerCommission: 40, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 3W - SATP", insurer: "ICICI Lombard", trustnerCommission: 40, basis: "TP Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV upto 2.5T - Comp", insurer: "ICICI Lombard", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV upto 2.5T - SATP", insurer: "ICICI Lombard", trustnerCommission: 35, basis: "TP Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5T-3.5T - Comp", insurer: "ICICI Lombard", trustnerCommission: 40, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5T-3.5T - SATP", insurer: "ICICI Lombard", trustnerCommission: 40, basis: "TP Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 7.5T-15T - Comp", insurer: "ICICI Lombard", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 15T-20T - Comp", insurer: "ICICI Lombard", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 20T-43T - Comp", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV >43T - Comp", insurer: "ICICI Lombard", trustnerCommission: 20, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor - Comp (Fresh)", insurer: "ICICI Lombard", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor - SATP", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "TP Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV 3W - Comp", insurer: "ICICI Lombard", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV Taxi - Comp", insurer: "ICICI Lombard", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV School Bus", insurer: "ICICI Lombard", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV <2K Comp - West Metro", insurer: "Bajaj Allianz", trustnerCommission: 66, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV <2K Comp - East", insurer: "Bajaj Allianz", trustnerCommission: 55, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5-3.5K - Comp", insurer: "Bajaj Allianz", trustnerCommission: 42.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 12K+ HCV - Comp", insurer: "Bajaj Allianz", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV 3W - Comp", insurer: "Bajaj Allianz", trustnerCommission: 15, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "School Bus", insurer: "Bajaj Allianz", trustnerCommission: 71, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor Fresh - Comp", insurer: "Bajaj Allianz", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV upto 2.5T - Comp", insurer: "New India / Chola", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5-3.5T - Comp", insurer: "New India / Chola", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 3.5-7.5T - Comp", insurer: "New India / Chola", trustnerCommission: 17.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 7.5-12T - Comp", insurer: "New India / Chola", trustnerCommission: 22.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 12-20T - Comp", insurer: "New India / Chola", trustnerCommission: 22.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 20-40T - Comp", insurer: "New India / Chola", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 40-43T - Comp", insurer: "New India / Chola", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV >43T - Comp", insurer: "New India / Chola", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV 3W Auto - Comp", insurer: "New India / Chola", trustnerCommission: 17.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "School Bus", insurer: "New India / Chola", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Staff Bus", insurer: "New India / Chola", trustnerCommission: 42, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor New - Comp", insurer: "New India / Chola", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor Renewal - Comp", insurer: "New India / Chola", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Excavator/Earth Mover", insurer: "New India / Chola", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Harvester", insurer: "New India / Chola", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV upto 2.5T - Comp", insurer: "HDFC ERGO", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5-3.5T - Comp", insurer: "HDFC ERGO", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "CV Comp - Various", insurer: "HDFC ERGO", trustnerCommission: 22.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV LCV - Comp", insurer: "TATA AIG", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV HCV - Comp", insurer: "TATA AIG", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV 3W - Comp", insurer: "TATA AIG", trustnerCommission: 67.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV 4W School Bus", insurer: "TATA AIG", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV Taxi - Comp", insurer: "TATA AIG", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Tractor - Comp", insurer: "TATA AIG", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV upto 2.5T - Platinum", insurer: "SBI General", trustnerCommission: 42.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2.5-3.5T - Platinum", insurer: "SBI General", trustnerCommission: 26, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV Tractor - Platinum", insurer: "SBI General", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "Agri Tractor - Platinum", insurer: "SBI General", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCCV LCV Payout", insurer: "Shriram GI", trustnerCommission: 40, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV <=2000 Kg", insurer: "United India", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 2000-3500 Kg", insurer: "United India", trustnerCommission: 38, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "School Bus", insurer: "United India", trustnerCommission: 52, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCCV up to 2.5T", insurer: "Oriental", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "School Bus 3W PCCV", insurer: "Oriental", trustnerCommission: 37.5, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "PCV School Bus", insurer: "Kotak Zurich", trustnerCommission: 58, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV 0-2500 Ton", insurer: "Kotak Zurich", trustnerCommission: 40, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "School Bus", insurer: "Reliance General", trustnerCommission: 55, basis: "Net Premium" },
  { productLine: "Motor - Commercial Vehicle", product: "GCV <2K WB Kolkata", insurer: "Reliance General", trustnerCommission: 48, basis: "Net Premium" },

  // --- Non-Motor (13 products) ---
  { productLine: "Non-Motor", product: "Fire & Engineering (<1 Lakh)", insurer: "TATA AIG", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Fire & Engineering (1-5 Lakh)", insurer: "TATA AIG", trustnerCommission: 27.5, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Fire & Engineering (>5 Lakh)", insurer: "TATA AIG", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "GPA (<5 Lakh)", insurer: "TATA AIG", trustnerCommission: 10, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "GPA (5-15 Lakh)", insurer: "TATA AIG", trustnerCommission: 12.5, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "GPA (>15 Lakh)", insurer: "TATA AIG", trustnerCommission: 15, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Marine (<2 Lakh)", insurer: "TATA AIG", trustnerCommission: 22.5, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Marine (>2 Lakh)", insurer: "TATA AIG", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Liability/WC (<5 Lakh)", insurer: "TATA AIG", trustnerCommission: 25, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Liability/WC (>5 Lakh)", insurer: "TATA AIG", trustnerCommission: 27.5, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Co-operative", insurer: "TATA AIG", trustnerCommission: 35, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "PCI Comprehensive (New/Renewal)", insurer: "Reliance General", trustnerCommission: 22.5, basis: "Net Premium" },
  { productLine: "Non-Motor", product: "Extended Warranty", insurer: "Reliance General", trustnerCommission: 20, basis: "Net Premium" },
];

// ============================================================================
// LIFE INSURANCE DATA (75 products)
// ============================================================================
export const LI_DATA: ProductEntry[] = [
  // --- Shriram Life (9 products) ---
  { productLine: "Traditional", product: "Assured Income Plan (15/15 PPT)", insurer: "Shriram Life", trustnerCommission: 71, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Assured Income Plan (12/12 PPT)", insurer: "Shriram Life", trustnerCommission: 65, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Assured Income Plan (10/10 PPT)", insurer: "Shriram Life", trustnerCommission: 55, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Assured Savings POS (15/15 PPT)", insurer: "Shriram Life", trustnerCommission: 60, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Assured Savings POS (15/10 PPT)", insurer: "Shriram Life", trustnerCommission: 45, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Premier Assured Benefit (20/10 PPT)", insurer: "Shriram Life", trustnerCommission: 58, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Early Cash Plan (20/10 PPT)", insurer: "Shriram Life", trustnerCommission: 67, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Sunishchit Labh (20 PPT)", insurer: "Shriram Life", trustnerCommission: 78, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Super Income Plan (10-15 PPT)", insurer: "Shriram Life", trustnerCommission: 73, basis: "1st Year Premium" },

  // --- Bajaj Life (12 products) ---
  { productLine: "PAR", product: "PAR All Products (5 PPT)", insurer: "Bajaj Life", trustnerCommission: 34, basis: "1st Year Premium" },
  { productLine: "PAR", product: "PAR All Products (7 PPT)", insurer: "Bajaj Life", trustnerCommission: 44, basis: "1st Year Premium" },
  { productLine: "PAR", product: "PAR All Products (>=10 PPT)", insurer: "Bajaj Life", trustnerCommission: 54, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Non-PAR All (5 PPT)", insurer: "Bajaj Life", trustnerCommission: 39, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Non-PAR All (7 PPT)", insurer: "Bajaj Life", trustnerCommission: 49, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Non-PAR All (>=10 PPT)", insurer: "Bajaj Life", trustnerCommission: 54, basis: "1st Year Premium" },
  { productLine: "Annuity", product: "Annuity All (5 PPT)", insurer: "Bajaj Life", trustnerCommission: 29, basis: "1st Year Premium" },
  { productLine: "Annuity", product: "Annuity All (>=10 PPT)", insurer: "Bajaj Life", trustnerCommission: 44, basis: "1st Year Premium" },
  { productLine: "Term", product: "Term (<10 PPT)", insurer: "Bajaj Life", trustnerCommission: 54, basis: "1st Year Premium" },
  { productLine: "Term", product: "Term (>=10 PPT)", insurer: "Bajaj Life", trustnerCommission: 59, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "TULIP IPG", insurer: "Bajaj Life", trustnerCommission: 19, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "ULIP SWG", insurer: "Bajaj Life", trustnerCommission: 9, basis: "1st Year Premium" },

  // --- ICICI Prudential (7 products) ---
  { productLine: "PAR/Non-PAR", product: "Par/Non-Par (5 PPT) Offline", insurer: "ICICI Prudential", trustnerCommission: 32.5, basis: "1st Year Premium" },
  { productLine: "PAR/Non-PAR", product: "Par/Non-Par (7 PPT) Offline", insurer: "ICICI Prudential", trustnerCommission: 41.5, basis: "1st Year Premium" },
  { productLine: "PAR/Non-PAR", product: "Par/Non-Par (10 PPT) Offline", insurer: "ICICI Prudential", trustnerCommission: 55, basis: "1st Year Premium" },
  { productLine: "PAR/Non-PAR", product: "Par/Non-Par (12+ PPT) Offline", insurer: "ICICI Prudential", trustnerCommission: 64, basis: "1st Year Premium" },
  { productLine: "Protection", product: "Protection (5-12+ PPT) Offline", insurer: "ICICI Prudential", trustnerCommission: 52.5, basis: "1st Year Premium" },
  { productLine: "Pension", product: "Gold Pension Savings (10 PPT)", insurer: "ICICI Prudential", trustnerCommission: 30, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Smart Goal Assure (7+ PPT)", insurer: "ICICI Prudential", trustnerCommission: 25, basis: "1st Year Premium" },

  // --- Bandhan Life (9 products) ---
  { productLine: "Term", product: "iTerm Prime / Comfort", insurer: "Bandhan Life", trustnerCommission: 50, basis: "1st Year Premium" },
  { productLine: "Term", product: "iTerm Prime ROP (10 PPT)", insurer: "Bandhan Life", trustnerCommission: 55, basis: "1st Year Premium" },
  { productLine: "Term", product: "iTerm Prime ROP (15 PPT)", insurer: "Bandhan Life", trustnerCommission: 60, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "iIncome Wealth (7 PPT)", insurer: "Bandhan Life", trustnerCommission: 38, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "iIncome Wealth (10 PPT)", insurer: "Bandhan Life", trustnerCommission: 66, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "iIncome Wealth (12 PPT)", insurer: "Bandhan Life", trustnerCommission: 68, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "iGVishwas (10 PPT)", insurer: "Bandhan Life", trustnerCommission: 65, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "iGVishwas (12 PPT)", insurer: "Bandhan Life", trustnerCommission: 68, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "iInvest II (<10 PPT)", insurer: "Bandhan Life", trustnerCommission: 17, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "iInvest II (>=10 PPT)", insurer: "Bandhan Life", trustnerCommission: 20, basis: "1st Year Premium" },

  // --- TATA AIA Life (11 products) ---
  { productLine: "PAR", product: "Shubh Maha Life Gold (5 PPT)", insurer: "TATA AIA Life", trustnerCommission: 40, basis: "1st Year Premium" },
  { productLine: "PAR", product: "Shubh Maha Life Gold (10 PPT)", insurer: "TATA AIA Life", trustnerCommission: 54, basis: "1st Year Premium" },
  { productLine: "PAR", product: "Shubh Flexi (12+ PPT)", insurer: "TATA AIA Life", trustnerCommission: 62, basis: "1st Year Premium" },
  { productLine: "PAR", product: "SVIP (10 PPT)", insurer: "TATA AIA Life", trustnerCommission: 57, basis: "1st Year Premium" },
  { productLine: "Protection", product: "Shubh Shakti (5-11 PPT)", insurer: "TATA AIA Life", trustnerCommission: 57, basis: "1st Year Premium" },
  { productLine: "Protection", product: "Shubh Shakti (12+ PPT)", insurer: "TATA AIA Life", trustnerCommission: 62, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Fortune Guarantee Plus (5 PPT)", insurer: "TATA AIA Life", trustnerCommission: 52, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Fortune Guarantee Plus (12 PPT)", insurer: "TATA AIA Life", trustnerCommission: 62, basis: "1st Year Premium" },
  { productLine: "Non-PAR", product: "Fortune Guarantee Pension (12 PPT)", insurer: "TATA AIA Life", trustnerCommission: 62, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "Pro-Fit NROP (5-9 PPT)", insurer: "TATA AIA Life", trustnerCommission: 40.7, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "Pro-Fit WL (10+ PPT)", insurer: "TATA AIA Life", trustnerCommission: 55.1, basis: "1st Year Premium" },

  // --- SUD Life (9 products) ---
  { productLine: "Traditional", product: "Century Royale (12 PPT)", insurer: "SUD Life", trustnerCommission: 80, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Century Income (12 PPT)", insurer: "SUD Life", trustnerCommission: 75, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Smart Income (12 PPT)", insurer: "SUD Life", trustnerCommission: 70, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Century Royale (10 PPT)", insurer: "SUD Life", trustnerCommission: 70, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Century Gold (10 PPT)", insurer: "SUD Life", trustnerCommission: 70, basis: "1st Year Premium" },
  { productLine: "Term", product: "Smart Term (RP)", insurer: "SUD Life", trustnerCommission: 70, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Guarantee Royale (10 PPT)", insurer: "SUD Life", trustnerCommission: 50, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "POS Sanchay (10 PPT)", insurer: "SUD Life", trustnerCommission: 60, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "Life Star TULIP (10 PPT)", insurer: "SUD Life", trustnerCommission: 10, basis: "1st Year Premium" },

  // --- Go Digit Life (6 products) ---
  { productLine: "Traditional", product: "Digit Icon (5 PPT)", insurer: "Go Digit Life", trustnerCommission: 25, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Digit Icon (7 PPT)", insurer: "Go Digit Life", trustnerCommission: 45, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Digit Icon (10 PPT)", insurer: "Go Digit Life", trustnerCommission: 70, basis: "1st Year Premium" },
  { productLine: "Traditional", product: "Digit Icon (12-15 PPT)", insurer: "Go Digit Life", trustnerCommission: 75, basis: "1st Year Premium" },
  { productLine: "Term", product: "Glow (Regular Pay)", insurer: "Go Digit Life", trustnerCommission: 50, basis: "1st Year Premium" },
  { productLine: "Term", product: "Glow Plus (Regular Pay)", insurer: "Go Digit Life", trustnerCommission: 60, basis: "1st Year Premium" },

  // --- LIC (11 products) ---
  { productLine: "Endowment", product: "New Endowment (15+ PPT)", insurer: "LIC", trustnerCommission: 20, basis: "1st Year Premium" },
  { productLine: "Endowment", product: "New Endowment (10-14 PPT)", insurer: "LIC", trustnerCommission: 15, basis: "1st Year Premium" },
  { productLine: "Endowment", product: "Jeevan Lakshya (15+ PPT)", insurer: "LIC", trustnerCommission: 20, basis: "1st Year Premium" },
  { productLine: "Whole Life", product: "Jeevan Anand (15+ PPT)", insurer: "LIC", trustnerCommission: 20, basis: "1st Year Premium" },
  { productLine: "Whole Life", product: "Jeevan Utsav (15+ PPT)", insurer: "LIC", trustnerCommission: 25, basis: "1st Year Premium" },
  { productLine: "Money Back", product: "New Money Back (20/15 PPT)", insurer: "LIC", trustnerCommission: 15, basis: "1st Year Premium" },
  { productLine: "Term", product: "Saral Jeevan (15+ PPT)", insurer: "LIC", trustnerCommission: 12.5, basis: "1st Year Premium" },
  { productLine: "Term", product: "Yuva Term (15+ PPT)", insurer: "LIC", trustnerCommission: 20, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "SIIP (AP 75K+)", insurer: "LIC", trustnerCommission: 4, basis: "1st Year Premium" },
  { productLine: "ULIP", product: "Index Plus (AP 1.2L+)", insurer: "LIC", trustnerCommission: 5.75, basis: "1st Year Premium" },
  { productLine: "Annuity", product: "All Annuity (Single Prem)", insurer: "LIC", trustnerCommission: 2, basis: "Single Premium" },
];

// ============================================================================
// HEALTH INSURANCE DATA (26 products)
// ============================================================================
export const HI_DATA: ProductEntry[] = [
  // --- SBI General Health (12 products) ---
  { productLine: "Indemnity", product: "Alpha (SI 5L-9L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Alpha (SI 10L-14L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Alpha (SI >15L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Super Health (SI 5L-9L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Super Health (SI >10L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Supreme (SI 5L-9L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Supreme (SI >10L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Super Top Up (SI >15L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Indemnity", product: "IPA (SI 10L-14L) - New", insurer: "SBI General", trustnerCommission: 50, basis: "Net Premium" },
  { productLine: "Renewal", product: "All Health Products - Renewal", insurer: "SBI General", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Renewal", product: "Portability - Super Health/Supreme >10L", insurer: "SBI General", trustnerCommission: 30, basis: "Net Premium" },
  { productLine: "Group", product: "GMC (Group Mediclaim)", insurer: "SBI General", trustnerCommission: 7.5, basis: "Net Premium" },

  // --- Aditya Birla Health (6 products) ---
  { productLine: "Indemnity", product: "Max Plus (SI >=10L) - Fresh", insurer: "Aditya Birla Health", trustnerCommission: 45, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Other Indemnity (SI >=10L) - Fresh", insurer: "Aditya Birla Health", trustnerCommission: 42.5, basis: "Net Premium" },
  { productLine: "Indemnity", product: "Any (SI <10L) - Fresh", insurer: "Aditya Birla Health", trustnerCommission: 15, basis: "Net Premium" },
  { productLine: "Renewal", product: "All Products - Renewal", insurer: "Aditya Birla Health", trustnerCommission: 20, basis: "Net Premium" },
  { productLine: "Renewal", product: "Renewal (Member age 60+)", insurer: "Aditya Birla Health", trustnerCommission: 10, basis: "Net Premium" },
  { productLine: "Fixed Benefit", product: "Health Meter (Cap)", insurer: "Aditya Birla Health", trustnerCommission: 12.5, basis: "Net Premium" },

  // --- Special Referral Arrangement (8 products) ---
  { productLine: "Special", product: "HI New Biz Single Year (3.8x)", insurer: "Care/Cigna/Niva/SBI/Rel/HDFC/TATA", trustnerCommission: 49, basis: "Net Premium" },
  { productLine: "Special", product: "HI New Biz Multi Year (3.4x)", insurer: "Care/Cigna/Niva/Rel/Chola/TATA", trustnerCommission: 44, basis: "Net Premium" },
  { productLine: "Special", product: "Travel Insurance (2.8x)", insurer: "Care/Reliance/TATA AIG", trustnerCommission: 36, basis: "Net Premium" },
  { productLine: "Special", product: "PA Personal Accident (3.4x)", insurer: "Reliance/TATA AIG/SBI", trustnerCommission: 44, basis: "Net Premium" },
  { productLine: "Special", product: "HI Porting (2.0x)", insurer: "Care/Cigna/Niva Bupa", trustnerCommission: 26, basis: "Net Premium" },
  { productLine: "Special", product: "Renewal >80% Persistency (1.8x)", insurer: "Care/Cigna/Niva/SBI/Rel/HDFC/TATA", trustnerCommission: 23, basis: "Net Premium" },
  { productLine: "Special", product: "Renewal <80% Persistency (1.6x)", insurer: "Care/Cigna/Niva/SBI/Rel/HDFC/TATA", trustnerCommission: 21, basis: "Net Premium" },
  { productLine: "Special", product: "Age 60+ Fresh/Porting (flat)", insurer: "All HI Insurers", trustnerCommission: 8, basis: "Net Premium" },
];

// --- LOB Data Map ---
export const LOB_CONFIG: Record<LOB, { label: string; fullName: string; data: ProductEntry[]; color: string }> = {
  GI: { label: 'GI', fullName: 'General Insurance', data: GI_DATA, color: '#1565c0' },
  LI: { label: 'LI', fullName: 'Life Insurance', data: LI_DATA, color: '#6a1b9a' },
  HI: { label: 'HI', fullName: 'Health Insurance', data: HI_DATA, color: '#00695c' },
};

// --- LOB-specific Terms & Conditions ---
export const LOB_TERMS: Record<LOB, string[]> = {
  GI: [
    "Commission rates are subject to revision based on insurer grid changes.",
    "Your commission is calculated on the premium basis shown (OD/TP/Net Premium).",
    "Specific RTO restrictions, vehicle age limits, and declined categories apply as per insurer guidelines.",
    "Payouts are processed after premium realization and reconciliation with the insurer.",
    "SATP = Standalone Third Party | SAOD = Standalone Own Damage | Comp = Comprehensive.",
    "This document is confidential and issued to the named POSP/Adviser only.",
    "For queries, contact your Relationship Manager or write to operations@trustner.in.",
  ],
  LI: [
    "Commission rates shown are FIRST YEAR commission only. Renewal commissions may differ.",
    "Life insurance commissions are subject to persistency requirements and clawback provisions.",
    "PPT = Premium Paying Term. Rates vary by PPT \u2014 refer to specific product terms.",
    "PAR products carry bonus allocation; Non-PAR have guaranteed returns.",
    "ULIP commissions are subject to IRDAI capping as per current regulations.",
    "Payouts processed after premium realization. Clawback applies if policy lapses within persistency period.",
    "This document is confidential and issued to the named POSP/Adviser only.",
    "For queries, contact your Relationship Manager or write to operations@trustner.in.",
  ],
  HI: [
    "Commission rates are subject to revision based on insurer grid changes.",
    "New Business and Renewal rates differ \u2014 check the product line carefully.",
    "Age 60+ policies may have different/reduced commission rates as shown.",
    "GMC (Group Mediclaim) rates are typically lower due to group pricing.",
    "Special arrangement rates are applicable only for specified insurer tie-ups.",
    "Payouts are processed after premium realization and reconciliation with the insurer.",
    "This document is confidential and issued to the named POSP/Adviser only.",
    "For queries, contact your Relationship Manager or write to operations@trustner.in.",
  ],
};
