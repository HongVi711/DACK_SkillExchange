import { CircleX, Lock, TriangleAlert } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import adminService from "../../services/admin.service";
import reportService from "../../services/report.service";

const ReportManagement = ({ reports: initialReports, onBanSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(initialReports);

  const handleBan = async (userId, reportId) => {
    try {
      setLoading(true);
      const response_user = await adminService.lockUser(userId, true);
      const response_report = await reportService.changeStatus(
        reportId,
        "Banned"
      );
      if (response_user.status && response_report.status) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId ? { ...report, status: "Banned" } : report
          )
        );
        Swal.fire({
          title: "Success",
          text: "Đã cấm người dùng",
          icon: "success"
        });
        if (onBanSuccess) onBanSuccess(); // Chỉ fetch lại reports
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWarning = async (reportId) => {
    try {
      setLoading(true);
      const response = await reportService.changeStatus(reportId, "Warning");

      if (response.status) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId ? { ...report, status: "Warning" } : report
          )
        );
        Swal.fire({
          title: "Success",
          text: "Đã gửi cảnh báo",
          icon: "success"
        });
        if (onBanSuccess) onBanSuccess(); // Chỉ fetch lại reports
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to send warning",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reportId) => {
    try {
      setLoading(true);
      const response = await reportService.cancelReport(reportId);

      if (response.status) {
        if (onBanSuccess) onBanSuccess(); // Chỉ fetch lại reports
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {reports.map((report) => (
        <div
          key={report._id}
          className="p-4 bg-white rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-semibold">
              {report?.userId?.name} - {report?.userId?.email}
            </p>
            <p className="text-gray-600">Reason: {report.reason}</p>
            <p className="text-gray-600">
              Reported by: {report?.reportedBy?.name}
            </p>
            <p className="text-gray-600">Email: {report?.reportedBy?.email}</p>
            <p
              className={`text-sm ${
                report.status === "Processing"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {report.status}
            </p>
          </div>
          {report.status === "Processing" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBan(report?.userId?._id, report._id)}
                disabled={loading}
                className={`px-3 py-2 bg-red-500 text-white rounded flex items-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Lock size={16} className="mr-2" /> Ban
              </button>
              <button
                onClick={() => handleWarning(report._id)}
                disabled={loading}
                className={`px-3 py-2 bg-yellow-500 text-white rounded flex items-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <TriangleAlert size={16} className="mr-2" /> Warning
              </button>
              <button
                onClick={() => handleCancel(report._id)}
                disabled={loading}
                className={`px-3 py-2 bg-gray-500 text-white rounded flex items-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CircleX size={16} className="mr-2" /> Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ReportManagement;
