export interface EmployeeFormInputs {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  position: string;
  branch: string;
  startDate: string; // YYYY-MM-DD
  phone: string;
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeDetails: {
    position: string;
    branch: string;
    startDate: string; // YYYY-MM-DD
    phone: string;
  };
}
