import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { DollarSign } from "lucide-react";

const EarningsCard: React.FC = () => {
  const { monthlyEarnings } = useSelector((state: RootState) => state.earnings);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-gray-600 text-sm">Earnings This Month</p>
          <p className="text-2xl font-bold text-primary-600">
            ₹{monthlyEarnings.collected.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-green-600">
          Collected: ₹{monthlyEarnings.collected.toLocaleString()}
        </span>
        <span className="text-orange-600">
          Pending: ₹{monthlyEarnings.pending.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${
              (monthlyEarnings.collected / monthlyEarnings.total) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
};

export default EarningsCard;
