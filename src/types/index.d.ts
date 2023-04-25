import { Request } from 'express';
import { Employee } from '@/employee/entities/employee.entity';

export type TIdAndUsername = 'id' | 'username';

declare module 'express' {
  interface Request {
    user: Pick<Employee, TIdAndUsername>;
    parentSpan: any;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RUNNING: string;
      id: Employee['id'];
    }
  }
}
