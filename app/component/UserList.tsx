"use client";

import { useEffect, useState } from "react";
import { database } from "../../lib/firebase"; // Adjust the path as necessary
import { ref, get } from "firebase/database";

interface User {
  uid: string;
  name: string;
  email: string;
  timeStamp: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        const data = snapshot.val();

        console.log("Fetched users:", data); // Debug log

        if (data) {
          // Use Object.entries to get [uid, userData]
          const usersArray: User[] = Object.entries(data).map(
            ([uid, user]: [string, any]) => ({
              uid,
              name: user.name || "",
              email: user.email || "",
              timeStamp: user.timeStamp || "",
            })
          );

          // Sort by timestamp (latest first)
          usersArray.sort(
            (a, b) =>
              new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
          );

          setUsers(usersArray);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User List (Latest First)</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.uid} className="border p-4 rounded-lg shadow-md">
              <p>
                <strong>UID:</strong> {user.uid}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
