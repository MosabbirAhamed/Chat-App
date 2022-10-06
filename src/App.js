import { useEffect, useState } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import { auth } from "./utils/firebase"
import Avatar from '@mui/material/Avatar';


function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) return setUser(null);
      setUser({
        ...authUser?.providerData[0]
      });
    })
    return () => {
      unsubscribe();
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-fuchsia-300 bg-opacity-25 flex flex-col p-3 h-screen">
      <div className=" pb-2 flex items-center justify-between">
        {user && (
          <h2 className="text-gray-500 text-xl font-semibold flex items-center gap-2">
            <span>
              <Avatar className=" !w-9 !h-9" alt={user?.displayName} src={user?.photoURL} />
            </span>
            {user?.displayName}
          </h2>
        )}

        {user && (
          <button onClick={() => auth.signOut()} type="button" className="flex items-center justify-between text-indigo-700 p-2  text-sm font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700  bg-opacity-10 hover:bg-opacity-20" >
            <span className="">Log Out</span>
          </button>
        )}

      </div>
      {user ? <Chat user={user} /> : <Login />}
    </div>
  );
}

export default App;
