import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Badan Penanggulangan Bencana Daerah Kota Probolinggo",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
