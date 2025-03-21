import { CheckCircle, Lock, SkipForward } from "lucide-react";

const ReportManagement = ({ reports }) => {
  return (
    <>
      {reports.map((report) => (
        <div
          key={report.id}
          className="p-4 bg-white rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-semibold">{report.user}</p>
            <p className="text-gray-600">Reason: {report.reason}</p>
            <p
              className={`text-sm ${
                report.status === "Pending" ? "text-red-500" : "text-green-500"
              }`}
            >
              {report.status}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-red-500 text-white rounded flex items-center">
              <Lock size={16} className="mr-2" /> Ban
            </button>
            <button className="px-3 py-2 bg-green-500 text-white rounded flex items-center">
              <CheckCircle size={16} className="mr-2" /> Resolve
            </button>
            <button className="px-3 py-2 bg-gray-500 text-white rounded flex items-center">
              <SkipForward size={16} className="mr-2" /> Skip
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReportManagement;
