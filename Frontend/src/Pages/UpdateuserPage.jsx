import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { SelectEditorModule, LicenseManager } from "ag-grid-enterprise";
import { FaSave, FaTrashAlt } from "react-icons/fa";

// Set your AG Grid Enterprise license key
LicenseManager.setLicenseKey("YOUR_LICENSE_KEY_HERE");
ModuleRegistry.registerModules([AllCommunityModule, SelectEditorModule]);

const UpdateuserPage = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getusers");
      // Do not send password to frontend
      const sanitized = res.data.map(u => ({ ...u }));
      setRowData(sanitized);
    } catch (err) {
      alert("Failed to fetch users: " + err.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Save user after editing
  const handleSave = async (data) => {
    // Remove password from payload
    const payload = { ...data };
    delete payload.password;

    try {
      await axios.put(`http://localhost:5000/updateuser/${data.id}`, payload);
      alert("User updated ✅");
      fetchUsers();
    } catch (err) {
      alert("Update failed: " + err.response?.data?.error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/deleteuser/${id}`);
      alert("User deleted ✅");
      setRowData(rowData.filter((r) => r.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.response?.data?.error);
    }
  };

  const columns = [
    { headerName: "ID", field: "id", editable: false, width: 80 },
    { headerName: "Name", field: "name", editable: true },
    { headerName: "RollNo", field: "rollno", editable: true },
    {
      headerName: "Profession",
      field: "profession",
      editable: true,
      filter: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["student", "staff", "admin"] },
    },
    { headerName: "Email", field: "email", editable: true },
    { headerName: "Year", field: "year", editable: true, filter: true },
    { headerName: "Dept", field: "dept", editable: true, filter: true },
    { headerName: "Section", field: "section", editable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => handleSave(params.data)}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
            }}
          >
            <FaSave /> Save
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
            }}
          >
            <FaTrashAlt /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "600px", width: "100%", margin: "20px" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Update Users</h2>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        defaultColDef={{
          flex: 1,
          minWidth: 120,
          resizable: true,
          sortable: true,
          filter: true,
        }}
      />
    </div>
  );
};

export default UpdateuserPage;
