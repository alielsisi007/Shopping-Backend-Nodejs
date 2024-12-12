import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role, // أضف الحقل role هنا
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export default generateToken;
