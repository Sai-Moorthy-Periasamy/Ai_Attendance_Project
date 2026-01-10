import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";

const UpdateuserPage = () => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/getusers");
    setRowData(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data) => {
    const { id, password, profession, year, dept, section } = data;

    const payload = {
      ...data,
      year: profession === "student" ? year : null,
      dept: profession === "student" ? dept : null,
      section: profession === "student" ? section : null,
    };

    try {
      await axios.put(`http://localhost:5000/updateuser/${id}`, payload);
      alert("User updated ✅");
      fetchUsers();
    } catch (err) {
      alert("Update failed: " + err.response?.data?.error);
    }
  };

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
      filter:setColumnFilter,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["student", "staff", "admin"] },
    },
    { headerName: "Email", field: "email", editable: true },
    { headerName: "Year", field: "year", editable: true },
    { headerName: "Dept", field: "dept", editable: true },
    { headerName: "Section", field: "section", editable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRendererFramework: (params) => (
        <>
          <button
            onClick={() => handleSave(params.data)}
            style={{ marginRight: "5px" }}
          >
            Save
          </button>
          <button onClick={() => handleDelete(params.data.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: "600px", width: "100%", margin: "20px" }}>
      <h2>Update Users</h2>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={13}
        defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
      />
    </div>
  );
};

export default UpdateuserPage;
