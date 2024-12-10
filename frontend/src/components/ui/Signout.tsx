import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth"; // Adjust the import path as needed
import { Button } from "./Button";

export default function SignoutButton() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignout = () => {
    try {
      signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Signout failed", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignout}
      className="flex items-center"
    >
      Sign Out
    </Button>
  );
}
