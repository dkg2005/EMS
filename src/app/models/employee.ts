export interface Employee {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  departmentId: number;
  dateOfJoining?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
