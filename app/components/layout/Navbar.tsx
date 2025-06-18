'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import AuthButton from '../auth/AuthButton';
import LoginModal from '../auth/login/LoginModal';
import SignupModal from '../auth/signup/SignupModal';
import Image from 'next/image';
import { getUserId, resetAuthCookies } from '@/app/lib/actions'; 
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string | null;
  email: string | null;
  avatar_url_display: string | null;
}

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile/',
        {credentials: 'include'} // access token expiration solve
      ); // <-- Calling the Next.js proxy
      if (!response.ok) throw new Error("Failed to fetch");
      const profile = await response.json();

      setUserProfile({
        name: profile.name,
        email: profile.email,
        avatar_url_display: profile.avatar_url || "/user-avatar-male.png"
      });
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setUserProfile({ name: null, email: null, avatar_url_display: "/user-avatar-male.png" }); // Fallback
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userId = await getUserId();
        const loggedIn = !!userId;
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          await fetchUserProfile();
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsLoggedIn(false); // Ensure logged out on error
      } finally {
        setIsLoading(false); // Stop loading
      }
      
    };
    
    checkAuthStatus();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    closeLoginModal();
    router.refresh(); // Refresh the page to update state across components
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    closeSignupModal();
    router.refresh(); // Refresh the page to update state across components
  };

  const handleLogout = () => {
    resetAuthCookies();

    setIsLoggedIn(false);
    setIsDropdownOpen(false);

    router.refresh();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center z-10">
        <Logo />
        
        <div className="flex items-center">
          {isLoading ? (
            <div className="w-24 h-10" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image
                  src={userProfile?.avatar_url_display || "/user-avatar-male.png"}
                  alt={userProfile?.name || 'User Avatar'}
                  width={40}
                  height={40}
                  // fill
                  className="object-cover"
                  priority // preload image, as it's largest contentful paint
                />
              </button>
              {isDropdownOpen && <ProfileDropdown onLogout={handleLogout} />}
            </div>
          ) : (
            <div className="flex">
              <AuthButton 
                label="Log In" 
                onClick={openLoginModal} 
                variant="outline"
              />
              <AuthButton 
                label="Sign Up" 
                onClick={openSignupModal}
              />
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onSwitchToSignup={openSignupModal}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal} 
        onSwitchToLogin={openLoginModal}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default Navbar;