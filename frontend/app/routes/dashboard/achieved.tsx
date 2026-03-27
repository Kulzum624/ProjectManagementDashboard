import { Navigate } from "react-router";

const Achieved = () => {
  return <Navigate to="/my-tasks?filter=achieved" replace />;
};

export default Achieved;
