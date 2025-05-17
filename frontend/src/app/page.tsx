import Dashboard from "@/components/Dashboard";
import { mockRecommendations } from "@/data/mockCardData";
export default function Home() {
  return <Dashboard recommendations={mockRecommendations} />;
}
