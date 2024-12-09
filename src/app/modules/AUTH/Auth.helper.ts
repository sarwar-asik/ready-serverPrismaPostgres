export const createActivationCode = () => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    return activationCode;
  };