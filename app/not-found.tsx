// pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">WiseBet</h1>
        <p className="text-xl text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <span className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Back To Home
          </span>
        </Link>
      </div>
    </div>
  );
}
