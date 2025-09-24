import { useEffect, useState } from "react";
import axios from "axios";

interface KudelmaResponse {
  message: string;
}

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<KudelmaResponse>("/api/kudelma");
        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchData();
  }, []);

  return (
    <div>
      <p>Message from backend: {message}</p>
    </div>
  );
};

export default App;
