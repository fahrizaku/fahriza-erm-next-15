import React from "react";
import { Minus } from "lucide-react";

const PrescriptionItem = ({
  item,
  itemIndex,
  prescIndex,
  itemsLength,
  handlePrescriptionItemChange,
  removePrescriptionItem,
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          Obat #{itemIndex + 1}
        </h4>
        <button
          type="button"
          onClick={() => removePrescriptionItem(prescIndex, itemIndex)}
          disabled={itemsLength === 1}
          className={`p-1 rounded-full ${
            itemsLength === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 hover:bg-red-100"
          }`}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drug name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nama Obat
          </label>
          <input
            type="text"
            value={item.manualDrugName}
            onChange={(e) =>
              handlePrescriptionItemChange(
                prescIndex,
                itemIndex,
                "manualDrugName",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama obat"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Dosis
          </label>
          <input
            type="text"
            value={item.dosage}
            onChange={(e) =>
              handlePrescriptionItemChange(
                prescIndex,
                itemIndex,
                "dosage",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3x sehari setelah makan"
          />
        </div>

        {/* Quantity */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Jumlah
          </label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              handlePrescriptionItemChange(
                prescIndex,
                itemIndex,
                "quantity",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionItem;
