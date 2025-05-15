
interface NotFoundProps {
  statusCode?: number;
  message?: string;
  imageUrl?: string;
}

function NotFound({ statusCode, message, imageUrl }: NotFoundProps) {
  return (
    <div
      className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 h-screen text-center font-sans bg-gray-100 p-5"
    >
      {/* Image Section */}
      <img
        src={imageUrl || "../src/assets/404notfound.png"}
        alt="Not Found"
        className="mb-5 rounded-lg w-3/5 sm:w-2/5 max-w-[450px] md:w-1/2"
      />

      {/* Text Section */}
      <div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-wrap" 
          style={{
            fontFamily: "Arial, sans-serif", // Custom inline font-family
          }}
        >
          {message || "Page Not Found"}
        </h2>
        <a
          href="/"
          target="_self"
          className="inline-block px-6 py-3 bg-blue-500 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go back to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;