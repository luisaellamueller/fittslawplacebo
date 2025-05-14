import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Seite nicht gefunden</h2>
      <p className="text-lg text-gray-700 mb-6">
        Die gesuchte Seite existiert nicht oder wurde verschoben.
      </p>

      <Link to="/" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
        Zurück zur Startseite
      </Link>
    </div>
  );
};

export default NotFound;
