import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    if(req.headers.authorization) { const token = req.headers.authorization.split(' ')[1]; 
    // const token = req.headers.authorization.split(" ")[1];
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, "sEcReT");
      req.userId = decodedData?.id;
      req.username = decodedData?.username;
      req.user.role = decodedData?.role;
    }
  }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
