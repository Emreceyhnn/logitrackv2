import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        Error loading Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Maps...</span>
      </div>
    );
  }

  return <>{children}</>;
};
