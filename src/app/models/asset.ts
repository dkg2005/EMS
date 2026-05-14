export interface Asset {
  id: number | null;
  name: string;
  code: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'ASSIGNED' | 'REQUEST' | 'DELETED';
  description?: string;
}