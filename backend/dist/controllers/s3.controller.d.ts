import { type Request, type Response } from "express";
declare const getObject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const putObject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const putObjectFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const deleteObject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const fetchList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export { putObject, fetchList, getObject, deleteObject, putObjectFolder };
//# sourceMappingURL=s3.controller.d.ts.map