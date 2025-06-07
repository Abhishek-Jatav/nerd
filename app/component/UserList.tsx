"use client";

import { useEffect, useState } from "react";
import { database } from "../../lib/firebase"; // Adjust the path as necessary
import { ref, get } from "firebase/database";
import toast from "react-hot-toast";

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

        if (data) {
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

          if (usersArray.length === 0) {
            toast("No users found.", { icon: "📭" });
          }

          setUsers(usersArray);
        } else {
          toast("No users found in the database.", { icon: "📭" });
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        User List (Latest First)
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No users found.
        </p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.uid}
              className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-colors">
              <p className="truncate">
                <strong className="text-gray-900 dark:text-gray-100">
                  UID:
                </strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {user.uid}
                </span>
              </p>
              <p className="truncate">
                <strong className="text-gray-900 dark:text-gray-100">
                  Name:
                </strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </p>
              <p className="truncate">
                <strong className="text-gray-900 dark:text-gray-100">
                  Email:
                </strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Registered:{" "}
                {user.timeStamp
                  ? new Date(user.timeStamp).toLocaleString()
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
