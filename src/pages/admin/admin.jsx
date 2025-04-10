import * as Tabs from "@radix-ui/react-tabs";
import UserManagement from "../../components/UserManagement";
import ReportManagement from "../../components/ReportManagement";
import ConnectionManagement from "../../components/ConnectionManagement";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import adminService from "../../services/admin.service";
import reportService from "../../services/report.service";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const formatConnection = (connections) => {
  return connections.map((item) => ({
    year: item.year,
    month: monthNames[item.month - 1], // Chuyển số thành tên tháng
    total: item.total
  }));
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [connectionStats, setConnectionStats] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("connections");
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu cho từng tab
  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const reportsData = await reportService.getAllReports();
      setReports(reportsData.reports);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersData = await adminService.getAllUsers();
      setUsers(usersData.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const connectionReports = await adminService.getConnectionReports();
      setConnectionStats(formatConnection(connectionReports.reports));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingConnections(false);
    }
  };

  // Hàm fetch dữ liệu ban đầu khi component mount
  const fetchInitialData = async () => {
    try {
      setLoadingReports(true);
      setLoadingUsers(true);
      setLoadingConnections(true);
      setError(null);
      const [usersData, connectionReports, reportsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getConnectionReports(),
        reportService.getAllReports()
      ]);
      setUsers(usersData.users);
      setConnectionStats(formatConnection(connectionReports.reports));
      setReports(reportsData.reports);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingReports(false);
      setLoadingUsers(false);
      setLoadingConnections(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Xử lý khi tab thay đổi
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    switch (newTab) {
      case "reports":
        fetchReports();
        break;
      case "users":
        fetchUsers();
        break;
      case "connections":
        fetchConnections();
        break;
      default:
        break;
    }
  };

  if (error) return Toast.fire({ icon: "error", title: error });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List className="flex gap-4 mb-4">
          <Tabs.Trigger
            className="px-4 py-2 bg-gray-200 rounded"
            value="connections"
          >
            Quản lý Kết nối
          </Tabs.Trigger>
          <Tabs.Trigger
            className="px-4 py-2 bg-gray-200 rounded"
            value="reports"
          >
            Quản lý Report
          </Tabs.Trigger>
          <Tabs.Trigger className="px-4 py-2 bg-gray-200 rounded" value="users">
            Quản lý User
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="reports">
          <div className="grid grid-cols-1 gap-4">
            {loadingReports ? (
              <div className="flex justify-center items-center py-4">
                <Loading />
              </div>
            ) : (
              <ReportManagement reports={reports} onBanSuccess={fetchReports} />
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="users">
          <div className="grid grid-cols-1 gap-4">
            {loadingUsers ? (
              <div className="flex justify-center items-center py-4">
                <Loading />
              </div>
            ) : (
              <UserManagement users={users} onActionSuccess={fetchUsers} />
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="connections">
          <div className="bg-white p-6 rounded shadow">
            {loadingConnections ? (
              <div className="flex justify-center items-center py-4">
                <Loading />
              </div>
            ) : (
              <ConnectionManagement connectionStats={connectionStats} />
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
