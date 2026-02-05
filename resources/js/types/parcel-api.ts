export type ErosionRiskLevel = 'low' | 'moderate' | 'high' | 'critical' | 'unknown';

export interface ParcelApi {
  id: string;
  owner_name?: string | null;
  status: 'draft' | 'validated' | 'official';
  soil_data?: Record<string, unknown> | null;
  created_by?: string | null;
  soil_m?: number | null;
  soil_a?: number | null;
  soil_b?: number | null;
  soil_c?: number | null;
  factor_r?: number | null;
  factor_ls?: number | null;
  factor_c_veg?: number | null;
  factor_p_prac?: number | null;
  computed_k?: number | null;
  computed_erosion?: number | null;
  erosion_risk_level: ErosionRiskLevel;
  geom?: unknown;
}
