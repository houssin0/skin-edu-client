import bcryptjs from "bcryptjs";

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(password, salt);
  return { hash, salt };
};

const rehashPassword = async (password, salt) => {
    const rehashedPassword = await bcryptjs.hash(password, salt);
    return rehashedPassword;
  };

export { hashPassword, rehashPassword };

