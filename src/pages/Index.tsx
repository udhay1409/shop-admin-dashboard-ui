
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the store page instead of the root which requires authentication check
  return <Navigate to="/store" replace />;
};

export default Index;
