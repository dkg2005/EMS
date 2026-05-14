// Department model
// This TypeScript interface defines the shape of a department object used across the app.
// Beginners: interfaces help TypeScript catch incorrect object shapes at compile time.
export interface Department {
  id?: number;
  name: string;
  size: number;
  description?: string;
  status?: string;   // ACTIVE / INACTIVE
}
