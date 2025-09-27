import axiosObject from "../config/axiosConfig"


export const createReportApi = async (fd) => {
  try {
    const res = await axiosObject.post("/reports", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201 || res.status === 200) {
      return res.data.data; // ✅ return only the report
    } else {
      throw new Error(res.data?.message || "Failed to create report");
    }
  } catch (err) {
    console.error("❌ Error creating report:", err);
    throw err.response?.data || { message: "Server error" };
  }
};


export const checkStatusApi = async(reportId)=>{
  console.log("apicall init");
  try {
    const res = await axiosObject.get(`/reports?id=${reportId}`);
    // console.log("apicall response "+res.data.map((d)=>console.log(d) ));
    let o = {};
    o = res.data;
    console.log("res "+o);
    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error(res.data?.message || "Failed to check status");
    }
  }catch(err) {
    console.error(" Error checking report:", err);
    throw err.response?.data || { message: "Server error" };
  }
}

export const getDashboardReports = async ({ aadharNo, mobile }) => {
  try {
    const params = {};
    if (aadharNo) params.aadharNo = aadharNo;
    if (mobile) params.mobileNo = mobile;

    const res = await axiosObject.get(`reports/my-reports`, { params });
    console.log("res: "+res)

    return res.data; // return reports array
  } catch (err) {
    console.error("❌ Error getting dashboard reports:", err);
    throw err.response?.data || { message: "Server error" };
  }
};

export const getReportsCount = async () => {
  try {
    const res = await axiosObject.get("/reports/getcount/"); // match the backend route
    console.log("contres "+ res);
    if (res.status === 200) {
      return res.data.totalReports; // return the count
    } else {
      throw new Error(res.data?.message || "Failed to fetch report count");
    }
  } catch (err) {
    console.error("❌ Error fetching reports count:", err);
    throw err.response?.data || { message: "Server error" };
  }
};
