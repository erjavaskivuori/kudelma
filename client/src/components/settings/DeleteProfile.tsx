import { useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { remove } from '../../services/user/userSlice';

export const DeleteProfile = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const handleDeleteProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone.'
    )) {
      if (currentUser) {
        try {
          await dispatch(remove(currentUser.id)).unwrap();
          alert('Profile deleted successfully. You will be logged out.');
          void navigate('/');
        } catch {
          alert('Failed to delete profile. Please try again.');
        }
      }
    }
  };

  return (
    <label
      className="w-full inline-flex items-center justify-between gap-4 cursor-pointer p-4 px-5">
    <div className="min-w-0 flex-1 select-none">
        <p className="text-md font-semibold text-heading mb-1">Delete your profile</p>
        <p className="text-md font-normal text-body">
          Deleting your profile will remove all your data, including your cards and settings.
          This action cannot be undone.
        </p>
      </div>
      <button
        onClick={(e) => void handleDeleteProfile(e)}
        className="mt-4 rounded-3xl bg-(--color-medium) font-semibold px-3 py-2 text-white
          hover:bg-red-600"
      >
        Delete Profile
    </button>
    </label>
  );
};
