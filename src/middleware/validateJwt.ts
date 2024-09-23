import jwt from "@elysiajs/jwt";
export const validateJwt = async (auth) => {
  const verify = await jwt.verify(auth.value);

  if (!verify) {
    set.status = 401;
    return "Unauthorized";
  }
};
