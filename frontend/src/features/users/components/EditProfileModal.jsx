import React, { useState } from "react";
import { X, Loader2, Camera } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import api from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) {
  const { login } = useAuth(); // We use this to update local context after save

  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || "",
    bio: currentUser.bio || "",
    avatar: currentUser.avatar || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // 1. Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const response = await api.post("/upload/image", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, avatar: response.data.data.imageUrl }));
    } catch (error) {
      console.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Call the API via the parent prop or service
      // We assume parent passed the actual service call or we do it here:
      const response = await api.patch("/users/update-account", formData);

      // Update global auth context so Navbar avatar updates immediately
      // We can manually trigger a "silent login" or state update if AuthContext exposes it.
      // For now, we rely on the parent to refetch or page reload,
      // OR we manually update localStorage if AuthContext reads from there on mount.

      onUpdateSuccess(response.data.data); // Pass updated user back
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-zinc-100'>
          <h3 className='font-bold text-lg'>Profile Information</h3>
          <button onClick={onClose} className='text-zinc-400 hover:text-black'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Avatar Section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative group'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-50'>
                <img
                  src={formData.avatar || "https://via.placeholder.com/100"}
                  alt='Avatar'
                  className='w-full h-full object-cover'
                />
              </div>
              <label className='absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer'>
                <Camera className='w-6 h-6' />
                <input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                />
              </label>
              {isUploading && (
                <div className='absolute inset-0 flex items-center justify-center bg-white/80 rounded-full'>
                  <Loader2 className='w-6 h-6 animate-spin text-black' />
                </div>
              )}
            </div>
            <p className='text-xs text-green-600 font-medium cursor-pointer'>
              {isUploading ? "Uploading..." : "Click image to update"}
            </p>
          </div>

          {/* Inputs */}
          <div className='space-y-4'>
            <div>
              <label className='text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block'>
                Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className='bg-zinc-50 border-transparent focus:bg-white transition-all'
              />
            </div>
            <div>
              <label className='text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block'>
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                maxLength={160}
                className='w-full rounded-md bg-zinc-50 border-transparent focus:bg-white focus:ring-2 focus:ring-black/5 px-3 py-2 text-sm resize-none transition-all'
              />
              <div className='text-right text-xs text-zinc-400 mt-1'>
                {formData.bio.length}/160
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end gap-3 pt-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={onClose}
              className='rounded-full'
            >
              Cancel
            </Button>
            <Button
              disabled={isSaving || isUploading}
              className='bg-green-600 hover:bg-green-700 text-white rounded-full px-6'
            >
              {isSaving ? <Loader2 className='w-4 h-4 animate-spin' /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
