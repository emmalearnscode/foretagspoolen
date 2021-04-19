import React from "react";

import AdminCompanyCard from "../admin-company-card/admin-company-card";

import "./admin-company-list.scss";

const AdminCompanyList = ({ companyData }) => {
  //console.log("CL", companyData);
  return (
    <ul className="admin-company-list">
      {companyData.map((company) => (
        <AdminCompanyCard key={company.id} data={company} />
      ))}
    </ul>
  );
};

export default AdminCompanyList;