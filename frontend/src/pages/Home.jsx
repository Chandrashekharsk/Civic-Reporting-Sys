import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaChartPie } from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import Footer from "../components/Footer";
import { getReportsCount } from "../apis";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const Home = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getReportsCount();
        setTotalReports(count);
      } catch (err) {
        console.error("Error fetching report count:", err);
      } finally {
        setLoadingCount(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
<section className="relative  py-24 px-6 md:px-16 overflow-hidden rounded-b-3xl shadow-lg">
{/* <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-24 px-6 md:px-16 overflow-hidden rounded-b-3xl shadow-lg"> */}
  <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
      Civic Reporting System
    </h1>
    <p className="text-lg md:text-xl mb-8 drop-shadow-md">
      Report issues in your city, track progress, and help build a smarter community.
    </p>

    <button className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 transform hover:scale-110 transition duration-300 mb-12">
      <Link to="/create-report">Report an Issue</Link>
    </button>

    {/* Centered Report Count */}
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 drop-shadow-md">
        Total Reports Submitted in our Platform
      </h2>
      {loadingCount ? (
        <p className="text-4xl md:text-5xl font-bold animate-pulse">Loading...</p>
      ) : (
        <CountUp
          start={0}
          end={totalReports}
          duration={3}
          separator=","
          className="text-5xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-lg animate-bounce"
        />
      )}
      <p className="mt-2 text-sm md:text-base">Keep building a smarter city! 🚀</p>
    </div>
  </div>

  {/* Hero Background Image */}
  <img
    src="/city2.jpeg"
    alt="City"
    className="absolute top-0 left-0 w-full h-full object-cover opacity-40 z-0"
  />
  <div className="absolute inset-0 bg-black/10 z-0 rounded-b-3xl"></div>
</section>


      {/* Citywide Reports Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Citywide Reports
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Example Total Reports Card */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
              Total Reports 📊
            </h3>
            <CountUp
              start={0}
              end={totalReports}
              duration={3}
              separator=","
              className="text-4xl md:text-5xl font-extrabold text-indigo-500 drop-shadow-lg animate-bounce"
            />
          </div>

          {/* Resolved Reports */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
              Resolved ✅
            </h3>
            <CountUp
              start={0}
              end={120} // replace with API value
              duration={3}
              separator=","
              className="text-4xl md:text-5xl font-extrabold text-green-500 drop-shadow-lg animate-bounce"
            />
          </div>

          {/* Pending Reports */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
              Pending ⏳
            </h3>
            <CountUp
              start={0}
              end={30} // replace with API value
              duration={3}
              separator=","
              className="text-4xl md:text-5xl font-extrabold text-red-500 drop-shadow-lg animate-bounce"
            />
          </div>
        </div>
      </section>

      {/* Interactive Cards Section */}
      <section className="py-20 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <FaMapMarkerAlt className="text-indigo-600 text-4xl mb-4" />,
              title: "Report Issues",
              desc: "Quickly report potholes, streetlight failures, and sanitation issues with location tracking.",
            },
            {
              icon: <MdReportProblem className="text-red-500 text-4xl mb-4" />,
              title: "Track Status",
              desc: "Get real-time updates on the progress of your reports and see resolution timelines.",
            },
            {
              icon: <FaChartPie className="text-green-500 text-4xl mb-4" />,
              title: "Analytics Dashboard",
              desc: "Visualize trends, priority issues, and citywide insights with interactive analytics.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer"
            >
              {card.icon}
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
