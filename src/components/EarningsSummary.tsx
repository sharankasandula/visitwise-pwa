import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Users } from 'lucide-react';
import { RootState } from '../store';

const EarningsSummary: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { visits } = useSelector((state: RootState) => state.visits);
  const { monthlyEarnings } = useSelector((state: RootState) => state.earnings);

  // Calculate earnings by patient
  const earningsByPatient = patients.map(patient => {
    const patientVisits = visits.filter(v => v.patientId === patient.id && v.completed);
    const totalEarned = patientVisits.reduce((sum, visit) => sum + (visit.paymentReceived || 0), 0);
    const totalDue = patientVisits.length * patient.chargePerVisit - totalEarned;
    
    return {
      ...patient,
      visitsCompleted: patientVisits.length,
      totalEarned,
      totalDue,
    };
  }).filter(p => p.visitsCompleted > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-3 p-1 hover:bg-primary-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Earnings Summary</h1>
            <p className="text-primary-100 text-sm">Monthly financial overview</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-primary-600">
                  ₹{monthlyEarnings.total.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Collected</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{monthlyEarnings.collected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{monthlyEarnings.pending.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Collection Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round((monthlyEarnings.collected / monthlyEarnings.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(monthlyEarnings.collected / monthlyEarnings.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Earnings by Patient */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Earnings by Patient</h3>
          </div>
          <div className="divide-y">
            {earningsByPatient.map((patient) => (
              <div key={patient.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.visitsCompleted} visits completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      ₹{patient.totalEarned.toLocaleString()}
                    </p>
                    {patient.totalDue > 0 && (
                      <p className="text-sm text-orange-600">
                        ₹{patient.totalDue.toLocaleString()} due
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(patient.totalEarned / (patient.totalEarned + patient.totalDue)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {earningsByPatient.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No earnings data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;
