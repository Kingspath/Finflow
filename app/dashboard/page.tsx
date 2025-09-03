
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-finflow-primary">Dashboard</h1>
      <p className="mt-4 text-finflow-dark">
        This is your financial overview. Charts, analytics, and reports will be
        displayed here.
      </p>
    </DashboardLayout>
  );
}