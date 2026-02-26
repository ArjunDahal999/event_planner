import { v4 as uuidv4 } from "uuid";

const generateToken = ({ timer }: { timer?: number }) => {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + (timer ?? 24 * 60 * 60 * 1000)), //24 hours by default
  };
};

export { generateToken };

const generateSixDigitToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export { generateSixDigitToken };
