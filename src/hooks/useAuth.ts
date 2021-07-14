import { useState } from "react";

const useAuth = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  return {isAuthed, setIsAuthed};
}

export default useAuth;