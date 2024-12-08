
import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientError = (error:Prisma.PrismaClientKnownRequestError ) => {
 let errors: IGenericErrorMessage[] = [];

  let message = error.message ??"Prisma Client Error (handleClientError.ts)"
  const statusCode = 400;

  if(error.code === "P2025"){
    message =( error.meta?.cause as string) || "Record not Found (handleClientError.ts)"

    errors = [
      {
        path:"",
        message
      }
    ]
  }
  else if(error.code ==="P2003"){
    if(error?.message.includes('delete()` invocation:')){
      message = "Delete Failed (handleCLient.ts)";
      errors = [
        {
          path:"",
          message
        }
      ]
    }

  }
  else if (error.code === "P2002") {
    // console.log('sssssssssss',error.message,"eeeeeeeeeeee")
    message = "The value must be unique. Violation of unique constraint failed (handleClientError.ts)";
    errors = [
      {
        path: "",
        message:error.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError
