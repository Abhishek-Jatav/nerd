import React, { useEffect, useState } from "react";
import { database } from "../../lib/firebase"; // adjust path as needed
import { ref, onValue } from "firebase/database";

interface Material {
  id: string;
  title: string;
  timestamp: number;
}

interface UserContributionsProps {
  userUid: string;
  userData: any; // optional, use if needed for avatar, name etc.
}

const UserContributions: React.FC<UserContributionsProps> = ({
  userUid,
  userData,
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const materialsRef = ref(database, "materials");
    const unsubscribe = onValue(materialsRef, (snapshot) => {
      const data = snapshot.val();
      const contributions: Material[] = [];

      if (data) {
        Object.entries(data).forEach(([key, value]: any) => {
          if (value.contributerId === userUid) {
            contributions.push({
              id: key,
              title: value.title,
              timestamp: value.timestamp,
            });
          }
        });

        // Sort by timestamp (newest first)
        contributions.sort((a, b) => b.timestamp - a.timestamp);
      }

      setMaterials(contributions);
    });

    return () => unsubscribe();
  }, [userUid]);

  return (
    <div className="p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">
        Contributions by {userData?.name || "User"}
      </h2>
      <ul>
        {materials.map((material) => (
          <li key={material.id} className="mb-2">
            <strong className="text-white">{material.title}</strong> →{" "}
            <span className="text-gray-600 text-md">
              {new Date(material.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserContributions;
