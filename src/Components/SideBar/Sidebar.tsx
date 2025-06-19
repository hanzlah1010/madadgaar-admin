import "bootstrap/dist/css/bootstrap.min.css"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { HelpRequest } from "../../schemas/requests"
import { useQueryClient } from "@tanstack/react-query"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import GpsFixedOutlinedIcon from "@mui/icons-material/GpsFixedOutlined"
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined"
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined"
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"

const requests: HelpRequest[] = [
  {
    id: 1,
    patient: "Ali Khan",
    location: "Lahore",
    status: "Pending",
    type: "Bike"
  },
  {
    id: 2,
    patient: "Sara Ahmed",
    location: "Karachi",
    status: "Completed",
    type: "Van"
  },
  {
    id: 3,
    patient: "Sara Ahmed",
    location: "Karachi",
    status: "Pending",
    type: "Van"
  },
  {
    id: 4,
    patient: "Bilal Raza",
    location: "Islamabad",
    status: "Pending",
    type: "Fire Brigade"
  },
  {
    id: 5,
    patient: "Hassan Riaz",
    location: "Faisalabad",
    status: "Pending",
    type: "Bike"
  },
  {
    id: 6,
    patient: "Zainab Gul",
    location: "Rawalpindi",
    status: "Completed",
    type: "Van"
  },
  {
    id: 7,
    patient: "Hamza Tariq",
    location: "Multan",
    status: "Pending",
    type: "Bike"
  },
  {
    id: 8,
    patient: "Farhan Ali",
    location: "Peshawar",
    status: "Pending",
    type: "Van"
  },
  {
    id: 9,
    patient: "Ayesha Noor",
    location: "Quetta",
    status: "Completed",
    type: "Fire Brigade"
  },
  {
    id: 10,
    patient: "Saad Mahmood",
    location: "Lahore",
    status: "Pending",
    type: "Bike"
  },
  {
    id: 11,
    patient: "Rehan Siddiqui",
    location: "Hyderabad",
    status: "Pending",
    type: "Van"
  },
  {
    id: 12,
    patient: "Nadia Khan",
    location: "Sialkot",
    status: "Completed",
    type: "Bike"
  },
  {
    id: 13,
    patient: "Usman Ghani",
    location: "Gujranwala",
    status: "Pending",
    type: "Van"
  },
  {
    id: 14,
    patient: "Tariq Mehmood",
    location: "Sargodha",
    status: "Pending",
    type: "Fire Brigade"
  },
  {
    id: 15,
    patient: "Fatima Baig",
    location: "Bahawalpur",
    status: "Pending",
    type: "Bike"
  },
  {
    id: 16,
    patient: "Shahzad Alam",
    location: "Sukkur",
    status: "Completed",
    type: "Van"
  },
  {
    id: 17,
    patient: "Maira Javed",
    location: "Mardan",
    status: "Pending",
    type: "Fire Brigade"
  },
  {
    id: 18,
    patient: "Danish Ahmed",
    location: "Abbottabad",
    status: "Pending",
    type: "Van"
  },
  {
    id: 19,
    patient: "Rabia Malik",
    location: "Larkana",
    status: "Completed",
    type: "Bike"
  },
  {
    id: 20,
    patient: "Waleed Akram",
    location: "Gujrat",
    status: "Pending",
    type: "Bike"
  }
]

const Sidebar = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token")
      queryClient.setQueryData(["session"], null)
      navigate("/")
    } catch (error) {
      console.error("Logout Error:", (error as Error)?.message)
    }
  }

  return (
    <div
      className="bg-dark text-white vh-100 position-fixed top-0 start-0 p-2"
      style={{
        width: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <ul
        className="nav flex-column"
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">
            <h1
              style={{
                fontFamily: "monospace",
                fontSize: "1.4rem",
                fontWeight: "500"
              }}
            >
              MadadGaar
            </h1>
          </Link>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <DashboardOutlinedIcon fontSize="small" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/livetracking"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <GpsFixedOutlinedIcon fontSize="small" />
            Live Tracking
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/managerequests"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <RecentActorsOutlinedIcon fontSize="small" />
            Manage Requests
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/accidentdetection"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <CarCrashOutlinedIcon fontSize="small" />
            Accident Detection
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/crew"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <PeopleOutlinedIcon fontSize="small" />
            Medical Crew
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/ambulances"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <AirportShuttleOutlinedIcon fontSize="small" />
            Ambulances
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/reports"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <ReportGmailerrorredOutlinedIcon fontSize="small" />
            Reports
          </NavLink>
        </li>
        {/* <li className="nav-item">
          <NavLink
            style={{ borderRadius: "10px" }}
            to="/settings"
            className="nav-link text-white d-flex align-items-center column-gap-2"
          >
            <SettingsOutlinedIcon fontSize="small" />
            Settings
          </NavLink>
        </li> */}
      </ul>
      <button
        onClick={handleLogout}
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center column-gap-2"
      >
        <LogoutOutlinedIcon fontSize="small" />
        Logout
      </button>
    </div>
  )
}

export default Sidebar
