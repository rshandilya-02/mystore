"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios";
import { DELETE_FILE, DOWNLOAD_FILE } from "@/services/api";

export type File = {
    file_original_name: string,
    file_type: string,
    size: number,
    createdAt: string,
    id: string|null
};

export const columns: ColumnDef<File>[] = [
    {
        accessorKey: "file_original_name",
        header: () => <div className="font-bold">Name</div>,
        cell: ({ row }) => {
      const payment = row.original;
      console.log("payment is ",payment);
      console.log("payment is ",payment.id);
      const token = localStorage.getItem("mydrive_token");
               

      const downloadUrl = async() => {
        console.log('download url ready ');
        const res = await axios.post(DOWNLOAD_FILE,{
            id:payment.id
        }, {
            headers:{
                    "authorization":`Bearer ${token}`
                },
            withCredentials:true
            });
        console.log('res for download url ',res);

        const url = res.data.url; 

        if(url) {
            window.open(url,"_blank");
        }



      };

      const deleteFile = async() => {
        console.log('inside dete');
        const res = await axios.post(DELETE_FILE,{
            id:payment.id
        }, {
            headers:{
                    "authorization":`Bearer ${token}`
                },
                withCredentials:true
            });

      }
 
      return (
        <div className="flex items-center ">
            <p>{row.getValue("file_original_name")}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={downloadUrl}
            >
             Download/Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={deleteFile}
            >
             Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
           
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    
  },
    },
    {
        accessorKey: "file_type",
        header: "Type"
    },
    {
        accessorKey:"size",
        header: "Size"
    },
    {
        accessorKey:"createdAt",
        header: "CreatedAt",
        cell: ({row}) => {
            console.log('this is row ',row);
            const dateTime:string =row.getValue("createdAt");
            console.log(" this is dateTime ",dateTime);
            const newData = dateTime.split('T');
            return newData[0];
        }    
    }
];