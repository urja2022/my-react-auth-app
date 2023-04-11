import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
// routes
import { HOME_PAGE_PATH } from '../routes/paths';
import useStore from '../contexts/AuthProvider';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const state = useStore()
  const isAuthenticated = state.isAuthenticated;

  if (isAuthenticated) {
    return <Navigate to={HOME_PAGE_PATH.root} />;
  }

  return <>{children}</>;
}
