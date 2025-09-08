import FileUpload from "../components/FileUpload";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Upload an Invoice</h1>
      <FileUpload />
    </div>
  );
};

export default Home;