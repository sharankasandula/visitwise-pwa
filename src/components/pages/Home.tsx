import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  fetchPatients,
  searchPatients,
} from "../../store/slices/patientsSlice";
import { PullToRefresh } from "../ui/PullToRefresh";
import Header from "../layout/Header";
import SearchBar from "../sections/SearchBar";
import PatientList from "../sections/PatientList";
import EmptyState from "../sections/EmptyState";
import LoadingState from "../sections/LoadingState";
import ErrorState from "../sections/ErrorState";
import FloatingActionButton from "../layout/FloatingActionButton";
import EarningsCard from "../EarningsCard";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );
  const visitsByPatient = useSelector(
    (state: RootState) => state.visits.visits
  );
  const paymentsByPatient = useSelector(
    (state: RootState) => state.payments.payments
  );

  useEffect(() => {
    dispatch(fetchPatients() as any);
  }, [dispatch]);

  // Calculate earnings for visibility condition
  const { totalEarnings, totalCollected, totalOutstanding } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let earningsSum = 0;
    let collectedSum = 0;

    patients.forEach((patient: any) => {
      const visits = visitsByPatient[patient.id] || [];
      const payments = paymentsByPatient[patient.id] || [];

      const visitsThisMonth = visits.filter((v: any) => {
        const d = new Date(v.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      // Calculate earnings from visits this month
      visitsThisMonth.forEach((visit: any) => {
        const visitCharge = Number(visit.charge) || 0;
        if (visitCharge > 0) {
          earningsSum += visitCharge;
        } else {
          earningsSum += patient.chargePerVisit || 0;
        }
      });

      // Calculate payments collected this month
      const paymentsThisMonth = payments.filter((p: any) => {
        const d = new Date(p.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      paymentsThisMonth.forEach((payment: any) => {
        collectedSum += payment.amount;
      });
    });

    const outstanding = Math.max(0, earningsSum - collectedSum);

    return {
      totalEarnings: earningsSum,
      totalCollected: collectedSum,
      totalOutstanding: outstanding,
    };
  }, [patients, visitsByPatient, paymentsByPatient]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      dispatch(fetchPatients() as any);
    } else {
      dispatch(searchPatients(term) as any);
    }
  };

  const activePatients = patients.filter((p) => p.isActive);
  const archivedPatients = patients.filter((p) => !p.isActive);

  // Search bar visibility logic:
  // - Hidden: when no patients AND no search term
  // - Visible: when there are patients (regardless of search term)
  // - Visible: when no patients BUT there is a search term
  const shouldShowSearchBar =
    activePatients.length > 0 || searchTerm.trim() !== "";

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    try {
      await dispatch(fetchPatients() as any);
    } catch (error) {
      console.error("Failed to refresh patients:", error);
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content with pull-to-refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Earnings Card and Media Management Link */}
        {activePatients.length > 0 &&
          totalEarnings > 0 &&
          totalCollected > 0 &&
          totalOutstanding > 0 && (
            <div className="sticky px-4 space-y-3">
              <EarningsCard />
              {/* <MediaManagementLink /> */}
            </div>
          )}

        {/* Search Bar */}

        {shouldShowSearchBar && (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            showSearch={true}
          />
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {error && !loading && <ErrorState error={error} />}

        {/* Patient List - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {activePatients.length > 0 ? (
              <PatientList
                activePatients={activePatients}
                archivedPatients={archivedPatients}
              />
            ) : searchTerm.trim() ? (
              <div className="px-4 pb-4">
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    <svg
                      className="w-8 h-8 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      No patients found for "{searchTerm}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4">
                <EmptyState />
              </div>
            )}
          </>
        )}
      </PullToRefresh>

      {/* Floating Action Button */}
      <FloatingActionButton show={activePatients.length >= 1} />
    </div>
  );
};

export default Home;
