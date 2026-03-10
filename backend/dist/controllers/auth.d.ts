import { type Request, type Response } from "express";
declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const cliLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const validateCli: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const CheckVerification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export { register, login, cliLogin, validateCli, CheckVerification };
//# sourceMappingURL=auth.d.ts.map