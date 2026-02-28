import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../features/users/services/user.service";
import { interactionService } from "../features/blog/services/interaction.service";
import EditProfileModal from "../features/users/components/EditProfileModal";
import { Loader2, MoreHorizontal, UserPlus, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import clsx from "clsx";
import MinimalPostCard from "../features/blog/components/MinimalPostCard";
import { useTitle } from "../hooks/useTitle";

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useTitle(
    profileUser
      ? `${profileUser.fullName} (@${profileUser.username})`
      : "Profile",
  );

  const handleFollow = async () => {
    if (!currentUser) return;
    setIsFollowing(!isFollowing);
    try {
      await interactionService.toggleFollow(profileUser._id);
    } catch (error) {
      setIsFollowing(!isFollowing);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserProfile(username);
      const profileId = userData.data._id;
      setProfileUser(userData.data);

      const postsData = await userService.getUserPosts(profileId);
      setPosts(postsData.data.posts);
      // check if followed
      if (currentUser && currentUser.username !== username) {
        const followingRes = await interactionService.getMyFollowedAuthors();
        const myFollowingList = followingRes.data || [];
        const isAlreadyFollowing = myFollowingList.some(
          (u) => u._id === profileId,
        );
        setIsFollowing(isAlreadyFollowing);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSuccess = (updatedData) => {
    setProfileUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId),
    );
  };

  if (loading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    );
  if (!profileUser)
    return <div className='text-center py-20'>User not found</div>;

  const isOwnProfile =
    currentUser && currentUser.username === profileUser.username;

  return (
    <div className='min-h-screen bg-[#F5F5EE]'>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10'>
          {/* --- LEFT: POSTS FEED (Main Content) --- */}
          <main className='lg:col-span-8 lg:border-r border-zinc-100 min-h-screen lg:pr-12 order-2 lg:order-1'>
            <div className='hidden lg:block mb-8'>
              <h1 className='text-4xl font-bold text-[#000000] mb-2'>
                {profileUser.fullName}
              </h1>
              <div className='flex gap-6 text-sm text-zinc-500 border-b border-zinc-100 pb-4'>
                <span className='text-red-900 border-b-2 border-zinc-900 pb-1 -mb-4 cursor-pointer font-display'>
                  My Stories
                </span>
              </div>
            </div>

            <div className='flex flex-col'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <MinimalPostCard
                    key={post._id}
                    post={post}
                    onDelete={handlePostDelete}
                  />
                ))
              ) : (
                <div className='py-12 text-zinc-500 italic'>
                  {profileUser.fullName} hasn't published any stories yet.
                </div>
              )}
            </div>
          </main>

          {/* --- RIGHT: SIDEBAR (User Info) --- */}
          <aside className='lg:col-span-4 order-1 lg:order-2'>
            <div className='sticky top-24'>
              {/* Avatar */}
              <div className='w-24 h-24 rounded-full overflow-hidden bg-zinc-200 mb-6'>
                <img
                  src={profileUser.avatar || "https://via.placeholder.com/150"}
                  alt={profileUser.username}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Name & Bio */}
              <h2 className='text-xl font-bold text-zinc-900 block lg:hidden'>
                {profileUser.fullName}
              </h2>
              <h3 className='font-medium text-zinc-900 mb-3 block lg:hidden md:block'>
                @{profileUser.username}
              </h3>

              <h2 className='hidden lg:block font-bold text-zinc-900 text-lg mb-1'>
                {profileUser.fullName}
              </h2>
              <div className='text-zinc-500 text-sm mb-4 font-sans'>
                @{profileUser.username}
              </div>

              <p className='text-zinc-600 text-sm leading-relaxed mb-6'>
                {profileUser.bio || "No bio yet."}
              </p>

              {/* Actions */}
              <div className='flex items-center gap-4 mb-8'>
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className='text-green-700 text-sm hover:text-green-800 font-medium cursor-pointer'
                  >
                    Edit profile
                  </button>
                ) : (
                  <Button
                    onClick={handleFollow}
                    className={clsx(
                      "rounded-full px-6",
                      isFollowing
                        ? "bg-white border border-green-700 text-green-700"
                        : "bg-green-700 text-white hover:bg-green-800",
                    )}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}

                {/* More Menu */}
                <button className='text-zinc-400 hover:text-black'>
                  <MoreHorizontal className='w-5 h-5' />
                </button>
              </div>

              {/* Stats */}
              <div className='flex flex-col gap-3 text-sm text-zinc-500'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-zinc-900'>
                    {profileUser.followersCount}
                  </span>{" "}
                  Followers
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-zinc-900'>
                    {profileUser.followingCount}
                  </span>{" "}
                  Following
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <Calendar className='w-4 h-4' /> Joined{" "}
                  {new Date(profileUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Edit Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          currentUser={profileUser}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </div>
  );
}
