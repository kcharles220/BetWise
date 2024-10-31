// pages/verify-email.tsx
"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

const VerifyEmail: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState<string>("Verifying...");
  const [error, setError] = useState<boolean>(false);
console.log(token)
  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/auth/verify-email/${token}`, {
          method: "GET",
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Verification failed");

        setMessage(data.message || "Email verified successfully");
      } catch (err: any) {
        setError(true);
        setMessage(err.message || "An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error ? "Verification Failed" : "Verification"}
        </h1>
        <p className={`text-lg ${error ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
