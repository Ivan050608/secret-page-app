'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../lib/authHelpers';
import SecretLayout from '../../components/SecretLayout';
import { useRouter } from 'next/navigation';  

export default function SecretPage3() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const router = useRouter(); 

  // Fetch accepted friends
  const fetchFriends = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) setError(error.message);
    else setFriends(data || []);
  };

  // Fetch incoming pending friend requests
  const fetchPendingRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .select('user_id')
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (error) setError(error.message);
    else setPendingRequests(data || []);
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, [user]);

  const handleSearch = async () => {
    if (!friendSearch) return;

    const { data, error } = await supabase
      .from('public_profiles')
      .select('id, email')
      .ilike('email', `%${friendSearch}%`);

    if (error) setError(error.message);
    else setFoundUser(data?.[0] || null);
  };

  const handleAddFriend = async () => {
    if (!foundUser) return;

    const { error } = await supabase
      .from('friends')
      .upsert([  // Send friend request
        { user_id: user.id, friend_id: foundUser.id, status: 'pending' },
        { user_id: foundUser.id, friend_id: user.id, status: 'pending' },
      ]);

    if (error) setError(error.message);
    else {
      alert('Friend request sent!');
      setFoundUser(null);
      setFriendSearch('');
    }
  };

  const handleAcceptFriend = async (senderId) => {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .or(`and(user_id.eq.${senderId},friend_id.eq.${user.id}),and(user_id.eq.${user.id},friend_id.eq.${senderId})`);

    if (error) setError(error.message);
    else {
      alert('Friend request accepted!');
      fetchFriends();
      fetchPendingRequests();
    }
  };

  const handleRemoveFriend = async (friendId) => {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

    if (error) setError(error.message);
    else {
      setFriends(friends.filter(f => f.friend_id !== friendId));
      alert('Friend removed!');
    }
  };

  const handleViewSecretMessage = (friendId) => {
    // Navigate to secret page of the friend to view their secret message
    router.push(`/secret-page-1/${friendId}`);
  };

  return (
    <SecretLayout>
      <h1 className="text-xl font-bold mb-4">Your Friends</h1>
      {error && <div className="text-red-500">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="space-x-2 mb-4"
      >
        <input
          type="text"
          value={friendSearch}
          onChange={(e) => setFriendSearch(e.target.value)}
          placeholder="Search users by email"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {foundUser && (
        <div className="mb-4">
          <p>Found user: {foundUser.email}</p>
          <button
            onClick={handleAddFriend}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-1"
          >
            Send Friend Request
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-6">Pending Requests</h2>
      <ul className="space-y-2 mb-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <li key={req.user_id} className="flex justify-between items-center">
              <span>User ID: {req.user_id}</span>
              <button
                onClick={() => handleAcceptFriend(req.user_id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
            </li>
          ))
        ) : (
          <p>No pending friend requests.</p>
        )}
      </ul>

      <h2 className="text-lg font-semibold mb-2">Friend List</h2>
      <ul className="space-y-2">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.friend_id} className="flex justify-between items-center">
              <span>Friend ID: {friend.friend_id}</span>
              <button
                onClick={() => handleRemoveFriend(friend.friend_id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
              <button
                onClick={() => handleViewSecretMessage(friend.friend_id)}
                className="bg-green-600 text-white px-3 py-1 rounded ml-2"
              >
                View Secret Message
              </button>
            </li>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </ul>
    </SecretLayout>
  );
}
