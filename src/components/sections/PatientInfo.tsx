import React, { useState } from "react";
import { Phone, Navigation, ChevronUp, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Card, CardContent } from "../ui/Card";
import { default as Badge } from "../ui/Badge";
import WhatsAppIcon from "../ui/icons/WhatsAppIcon";

interface Patient {
  id: string;
  name: string;
  age?: number;
  gender: string;
  condition: string;
  chargePerVisit: number;
  protocol?: string;
  notes?: string;
  phone?: string;
  googleMapsLink?: string;
  isActive: boolean;
}

interface PatientInfoProps {
  patient: Patient;
  onCall: () => void;
  onWhatsApp: () => void;
  onNavigate: () => void;
}

const PatientInfo: React.FC<PatientInfoProps> = ({
  patient,
  onCall,
  onWhatsApp,
  onNavigate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(false);

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "border-blue-500 bg-blue-50 text-blue-700";
      case "female":
        return "border-pink-500 bg-pink-50 text-pink-700";
      default:
        return "border-purple-500 bg-purple-50 text-purple-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderCode = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "M";
      case "female":
        return "F";
      default:
        return "O";
    }
  };

  const truncatedNotes =
    patient.notes && patient.notes.length > 15
      ? `${patient.notes.substring(0, 15)}...`
      : patient.notes;

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        {/* Main Row */}
        <div className="flex items-center gap-3">
          <Avatar
            className={`h-10 w-10 border ${getGenderColor(patient.gender)}`}
          >
            <AvatarFallback
              className={`text-xs font-medium ${getGenderColor(
                patient.gender
              )}`}
            >
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          {/* Patient Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-card-foreground capitalize truncate text-sm">
                {patient.name.length > 20
                  ? `${patient.name.slice(0, 20)}...`
                  : patient.name}
              </h4>
              <span className="text-xs font-medium text-muted-foreground">
                ({patient.age ?? ""}
                {getGenderCode(patient.gender)})
              </span>
              {!patient.isActive && (
                <Badge className="text-xs bg-warning text-warning-foreground">
                  Archived
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="capitalize">{patient.condition}</span>
              <span>•</span>
              <span className="font-medium text-primary">
                ₹{patient.chargePerVisit?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
              aria-label={showDetails ? "Hide details" : "Show details"}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            {patient.protocol && (
              <div className="text-xs">
                <span className="font-medium text-card-foreground">
                  Protocol:{" "}
                </span>
                <span className="text-muted-foreground">
                  {patient.protocol}
                </span>
              </div>
            )}

            {patient.notes && (
              <div className="text-xs">
                <span className="font-medium text-card-foreground">
                  Notes:{" "}
                </span>
                <span className="text-muted-foreground">
                  {expandedNotes ? patient.notes : truncatedNotes}
                </span>
                {patient.notes.length > 15 && (
                  <button
                    onClick={() => setExpandedNotes(!expandedNotes)}
                    aria-expanded={expandedNotes}
                    aria-label={
                      expandedNotes ? "Collapse notes" : "Expand notes"
                    }
                    className="ml-1 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    {expandedNotes ? (
                      <ChevronUp className="h-2 w-2" />
                    ) : (
                      <ChevronDown className="h-2 w-2" />
                    )}
                  </button>
                )}
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={onCall}
                disabled={!patient.phone}
                className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={patient.phone ? "Call patient" : "No phone number"}
              >
                <Phone className="h-6 w-6" />
              </button>

              <button
                onClick={onWhatsApp}
                disabled={!patient.phone}
                className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  patient.phone ? "Send WhatsApp reminder" : "No phone number"
                }
              >
                <WhatsAppIcon className="h-6 w-6" />
              </button>

              <button
                onClick={onNavigate}
                disabled={!patient.googleMapsLink}
                className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  patient.googleMapsLink ? "Navigate to patient" : "No location"
                }
              >
                <Navigation className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
