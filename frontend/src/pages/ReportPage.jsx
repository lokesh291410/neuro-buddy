import { useLocation } from "react-router-dom";

const ReportPage = () => {
  const location = useLocation();

  const generateReport = () => {
    const jsonData = JSON.stringify(location.state, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "NeuroBuddy_Report.json";
    a.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl">Session Report</h1>
      <button
        className="mt-4 p-2 bg-green-500 text-white"
        onClick={generateReport}
      >
        Download Report
      </button>
    </div>
  );
};

export default ReportPage;
