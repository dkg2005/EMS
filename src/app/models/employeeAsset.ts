export interface EmployeeAsset {
  id?: number;
  employeeId?: number;       // used in update/delete
  employeeIds?: number[];    // used only for create
  assetIds: number[];
  flag: 'CREATE' | 'UPDATE' | 'DELETE';
}
