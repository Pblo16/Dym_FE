import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAndUpdateAvatarHybrid, extractAvatarUrl } from "@/api/auth";
import ImageUpload from "@/components/ImageUpload";

/**
 * Converts file to base64 data URL for preview
 * @param file - Image file to convert
 * @returns Promise with base64 data URL
 */
const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Handles avatar file selection and creates preview
 * @param file - Selected image file
 * @param setAvatar - Function to update avatar state
 * @param setPendingFile - Function to store pending file
 * @param setHasPendingChanges - Function to update pending changes state
 */
const handleAvatarSelection = async (
  file: File,
  setAvatar: (url: string) => void,
  setPendingFile: (file: File) => void,
  setHasPendingChanges: (pending: boolean) => void
): Promise<void> => {
  try {
    const dataUrl = await convertFileToDataUrl(file);
    setAvatar(dataUrl);
    setPendingFile(file);
    setHasPendingChanges(true);
  } catch (error) {
    console.error('Error processing avatar file:', error);
    throw new Error('Error al procesar la imagen');
  }
};

/**
 * Gets current avatar URL from user data
 * @param user - User object
 * @returns Current avatar URL or null
 */
const getCurrentAvatarUrl = (user: any): string | null => {
  return extractAvatarUrl(user);
};

/**
 * Handles successful avatar upload and state updates
 * @param updatedUser - Updated user data from server
 * @param updateUser - Function to update user in context
 * @param setAvatar - Function to update local avatar state
 * @param setPendingFile - Function to clear pending file
 * @param setHasPendingChanges - Function to update pending changes state
 */
const handleSuccessfulUpload = (
  updatedUser: any,
  updateUser: (user: any) => void,
  setAvatar: (url: string | null) => void,
  setPendingFile: (file: File | null) => void,
  setHasPendingChanges: (pending: boolean) => void
): void => {
  updateUser(updatedUser);

  // Extract and set the new avatar URL
  const newAvatarUrl = getCurrentAvatarUrl(updatedUser);
  setAvatar(newAvatarUrl);

  // Reset pending state
  setPendingFile(null);
  setHasPendingChanges(false);

  console.log('Avatar uploaded successfully:', updatedUser);
};

/**
 * Uploads avatar to server and updates user profile
 * Uses hybrid approach: user token first, API token as fallback
 * @param file - Avatar file to upload
 * @param userId - User ID
 * @param token - JWT token
 * @param updateUser - Function to update user in context
 * @param setAvatar - Function to update local avatar state
 * @param setPendingFile - Function to clear pending file
 * @param setHasPendingChanges - Function to update pending changes state
 * @returns Promise that resolves when upload is complete
 */
const uploadAvatarToServer = async (
  file: File,
  userId: number,
  token: string,
  updateUser: (user: any) => void,
  setAvatar: (url: string | null) => void,
  setPendingFile: (file: File | null) => void,
  setHasPendingChanges: (pending: boolean) => void
): Promise<void> => {
  try {
    const updatedUser = await uploadAndUpdateAvatarHybrid(file, userId, token);
    handleSuccessfulUpload(updatedUser, updateUser, setAvatar, setPendingFile, setHasPendingChanges);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Error al subir el avatar al servidor');
  }
};

/**
 * Validates required data for avatar upload
 * @param pendingFile - File to upload
 * @param user - Current user
 * @param token - JWT token
 * @returns True if all required data is present
 */
const validateUploadRequirements = (
  pendingFile: File | null,
  user: any,
  token: string | null
): boolean => {
  if (!pendingFile) {
    console.error('No file selected for upload');
    return false;
  }
  if (!user) {
    console.error('User data not available');
    return false;
  }
  if (!token) {
    console.error('Authentication token not available');
    return false;
  }
  return true;
};

/**
 * Resets all avatar-related state to initial values
 * @param user - Current user data
 * @param setAvatar - Function to update avatar state
 * @param setPendingFile - Function to clear pending file
 * @param setHasPendingChanges - Function to update pending changes state
 */
const resetAvatarState = (
  user: any,
  setAvatar: (url: string | null) => void,
  setPendingFile: (file: File | null) => void,
  setHasPendingChanges: (pending: boolean) => void
): void => {
  const originalAvatarUrl = getCurrentAvatarUrl(user);
  setAvatar(originalAvatarUrl);
  setPendingFile(null);
  setHasPendingChanges(false);
};

/**
 * Handles the complete upload process with proper error handling
 * @param uploadParams - Object containing all upload parameters
 */
const executeAvatarUpload = async ({
  pendingFile,
  user,
  token,
  updateUser,
  setAvatar,
  setPendingFile,
  setHasPendingChanges,
  setIsUploading
}: {
  pendingFile: File;
  user: any;
  token: string;
  updateUser: (user: any) => void;
  setAvatar: (url: string | null) => void;
  setPendingFile: (file: File | null) => void;
  setHasPendingChanges: (pending: boolean) => void;
  setIsUploading: (loading: boolean) => void;
}): Promise<void> => {
  setIsUploading(true);

  try {
    await uploadAvatarToServer(
      pendingFile,
      user.id,
      token,
      updateUser,
      setAvatar,
      setPendingFile,
      setHasPendingChanges
    );
  } catch (error) {
    console.error('Upload failed:', error);
    // TODO: Show user notification for error
    throw error;
  } finally {
    setIsUploading(false);
  }
};

/**
 * Renders user information section
 * @param user - User data to display
 */
const UserInfoSection = ({ user }: { user: { username: string; email: string } | null }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="pt-4 border-t">
      <h2 className="mb-4 font-semibold text-xl">Información del Usuario</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Usuario:</span>
          <span className="text-gray-700">{user.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span className="text-gray-700">{user.email}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders avatar upload section
 * @param avatar - Current avatar URL
 * @param onAvatarSelect - Function to handle avatar selection
 * @param isUploading - Upload status
 */
const AvatarSection = ({
  avatar,
  onAvatarSelect,
  isUploading
}: {
  avatar: string | null;
  onAvatarSelect: (file: File) => void;
  isUploading: boolean;
}) => (
  <div className="mb-6 text-center">
    <ImageUpload
      onImageSelect={onAvatarSelect}
      currentImage={avatar || undefined}
      maxSizeInMB={5}
    />
    {isUploading && (
      <p className="mt-2 text-blue-500 text-sm">Subiendo avatar...</p>
    )}
  </div>
);

/**
 * Renders save changes section with save and cancel buttons
 * @param onSave - Save function
 * @param onCancel - Cancel function
 * @param isUploading - Upload status
 * @param hasPendingChanges - Whether there are unsaved changes
 */
const SaveChangesSection = ({
  onSave,
  onCancel,
  isUploading,
  hasPendingChanges
}: {
  onSave: () => void;
  onCancel: () => void;
  isUploading: boolean;
  hasPendingChanges: boolean;
}) => (
  hasPendingChanges && (
    <div className="bg-yellow-50 mb-4 p-3 border border-yellow-200 rounded">
      <p className="mb-3 text-yellow-800 text-sm">Tienes cambios sin guardar</p>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isUploading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 px-4 py-2 rounded text-white text-sm transition-colors"
        >
          {isUploading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 px-4 py-2 rounded text-white text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
);

/**
 * Renders logout action section
 * @param onLogout - Logout function
 */
const ActionsSection = ({ onLogout }: { onLogout: () => void }) => (
  <div className="mt-4 pt-4 border-t">
    <button
      onClick={onLogout}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full text-white transition-colors"
    >
      Cerrar Sesión
    </button>
  </div>
);

/**
 * Profile page component that displays user information and allows avatar upload
 */
const Profile = () => {
  const { user, logout, isAuthenticated, token, updateUser } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  /**
   * Initialize avatar URL when user data changes
   */
  useEffect(() => {
    if (user) {
      const currentAvatarUrl = getCurrentAvatarUrl(user);
      setAvatar(currentAvatarUrl);
    }
  }, [user]);

  /**
   * Handles avatar file selection for preview
   * @param file - Selected image file
   */
  const onAvatarSelect = async (file: File) => {
    try {
      await handleAvatarSelection(file, setAvatar, setPendingFile, setHasPendingChanges);
    } catch (error) {
      console.error('Error selecting avatar:', error);
      // TODO: Show user notification
    }
  };

  /**
   * Saves avatar changes to server with validation
   */
  const handleSaveChanges = async () => {
    if (!validateUploadRequirements(pendingFile, user, token)) {
      return;
    }

    try {
      await executeAvatarUpload({
        pendingFile: pendingFile!,
        user,
        token: token!,
        updateUser,
        setAvatar,
        setPendingFile,
        setHasPendingChanges,
        setIsUploading
      });
    } catch (error) {
      // Error already handled in executeAvatarUpload
    }
  };

  /**
   * Cancels pending changes and resets to original avatar
   */
  const handleCancelChanges = () => {
    resetAvatarState(user, setAvatar, setPendingFile, setHasPendingChanges);
  };

  /**
   * Renders the authenticated user profile view
   */
  const renderAuthenticatedProfile = () => (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-6 font-bold text-2xl">Perfil</h1>
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
        <AvatarSection
          avatar={avatar}
          onAvatarSelect={onAvatarSelect}
          isUploading={isUploading}
        />

        <SaveChangesSection
          onSave={handleSaveChanges}
          onCancel={handleCancelChanges}
          isUploading={isUploading}
          hasPendingChanges={hasPendingChanges}
        />

        <UserInfoSection user={user} />
        <ActionsSection onLogout={logout} />
      </div>
    </div>
  );

  /**
   * Renders the access denied view for unauthenticated users
   */
  const renderAccessDenied = () => (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 font-bold text-2xl">Acceso Denegado</h1>
      <p className="text-gray-600">Debes iniciar sesión para ver esta página.</p>
    </div>
  );

  return isAuthenticated && user ? renderAuthenticatedProfile() : renderAccessDenied();
};

export default Profile;