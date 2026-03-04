import { Metadata } from "next";
import PayoutGenerator from "@/components/payouts/PayoutGenerator";

export const metadata: Metadata = {
  title: "POSP Payout Schedule Generator - Trustner Insurance Brokers",
  description:
    "Generate your personalized POSP commission payout schedule across General Insurance, Life Insurance, and Health Insurance. Download a professional PDF.",
};

export default function PayoutsPage() {
  return (
    <div>
      <PayoutGenerator />
    </div>
  );
}
