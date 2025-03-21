import * as Tabs from "@radix-ui/react-tabs";
import UserManagement from "../../components/UserManagement";
import ReportManagement from "../../components/ReportManagement";
import ConnectionManagement from "../../components/ConnectionManagement";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import adminService from "../../services/admin.service";

const reports = [
  { id: 1, user: "user123", reason: "Spam", status: "Pending" },
  { id: 2, user: "user456", reason: "Harassment", status: "Resolved" }
];

// const users = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "abc@gmail.com",
//     violations: 2,
//     role: "User"
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "abc@gmail.com",
//     violations: 0,
//     role: "Admin"
//   }
// ];

const connectionStats = [
  { name: "Jan", total: 10 },
  { name: "Feb", total: 15 },
  { name: "Mar", total: 8 },
  { name: "Apr", total: 50 },
  { name: "May", total: 18 }
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = await adminService.getAllUsers();
        setUsers(usersData.users);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Trong component (inline CSS)
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}
      >
        <Loading />
      </div>
    );
  }
  if (error) return Toast.fire({ icon: "error", title: error });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs.Root defaultValue="reports">
        <Tabs.List className="flex gap-4 mb-4">
          <Tabs.Trigger
            className="px-4 py-2 bg-gray-200 rounded"
            value="reports"
          >
            Quản lý Report
          </Tabs.Trigger>
          <Tabs.Trigger className="px-4 py-2 bg-gray-200 rounded" value="users">
            Quản lý User
          </Tabs.Trigger>
          <Tabs.Trigger
            className="px-4 py-2 bg-gray-200 rounded"
            value="connections"
          >
            Quản lý Kết nối
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="reports">
          <div className="grid grid-cols-1 gap-4">
            <ReportManagement reports={reports} />
          </div>
        </Tabs.Content>

        <Tabs.Content value="users">
          <div className="grid grid-cols-1 gap-4">
            <UserManagement users={users} />
          </div>
        </Tabs.Content>

        <Tabs.Content value="connections">
          <div className="bg-white p-6 rounded shadow">
            <ConnectionManagement connectionStats={connectionStats} />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
