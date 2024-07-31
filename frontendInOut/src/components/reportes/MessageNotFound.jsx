import React from "react";
import { BiInfoCircle, BiCommentDetail } from "react-icons/bi";

const MessageNotFound = () => {
  return (
    <div className="flex justify-center items-center h-full mt-2">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center p-4 space-x-4 bg-gray-300 border border-green-300 rounded-t-lg">
          <BiInfoCircle className="text-green-800 text-3xl" />
          <p className="text-green-900 font-bold">No hay datos para mostrar</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white border border-t-0 border-green-300 rounded-b-lg">
          <div className="relative flex flex-col items-center mb-4">
            <BiCommentDetail className="text-green-200 text-[80px]" />
          </div>
          <p className="text-gray-700 text-center">
            Este mensaje sugiere que no hay criterios asociados con tu búsqueda
            o que no hay datos en el sistema para ser mostrados actualmente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageNotFound;
