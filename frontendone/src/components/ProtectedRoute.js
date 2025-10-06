import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = authService.getToken();
    
    if (!token) {
      router.push('/signin');
    } else {
      dispatch(setCredentials({ token }));
    }
  }, [dispatch, router]);

  return <>{children}</>;
}
