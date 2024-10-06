import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Home = () => {
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState(null);
  const router = useRouter(); 

  const handleTwitterLogin = async () => {
      const res = await fetch('/api/auth/login');
      const data = await res.json();
      window.location.href = data.url; 
  };

  const fetchUserData = async (accessToken) => {
    try {
     const res=await fetch("/api/userInfo?access_token="+accessToken);
      const data=await res.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    const { access_token } = router.query; 
    if (access_token) {
      fetchUserData(access_token); 
    } 
  }, [router.query]); 

  return (
    <div className="bg-black-500 h-screen p-32 text-white">
      {userData ? (
       <>
       <div className='flex flex-col gap-[12px]'>
        <Image src={userData.profile_image_url.replace("_normal","")} alt="Profile Image" width={100} height={100} />
        <div>
          <h1 className="text-2xl">Welcome, {userData.name}!</h1>
          <p>Twitter Username: @{userData.username}</p>
        </div>
        <a href='/' className='p-4 text-blue-500 border-2'>
          Sign Out
        </a>
        </div>
        </>
      ) : (
        <div>
          <button onClick={handleTwitterLogin} className="bg-blue-500 text-white p-2 rounded">
            Connect Twitter
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Home;
