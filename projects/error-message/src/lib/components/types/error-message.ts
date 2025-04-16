export interface ErrorMessages {
  required?: string;
  email?: string;
  minlength?: string | ((val: any) => string);
  maxlength?: string | ((val: any) => string);
  pattern?: string;
  min?: string | ((val: any) => string);
  max?: string | ((val: any) => string);
  [key: string]: string | ((val: any) => string) | undefined;
}

