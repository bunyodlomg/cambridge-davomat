import TelegramLogin from "../components/TelegramLogin";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  const handleAuth = (user) => {
    axios.post("/auth/telegram-login", user)
      .then(res => login(user, res.data.token))
      .catch(err => console.error(err));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-green-600">Login with Telegram</h1>
        <TelegramLogin botName="YourBotName" onAuth={handleAuth} />
      </div>
    </div>
  );
};

export default LoginPage;
