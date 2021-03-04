export const validateId = (id: string) => {
  //valid id example : 5fa47a9fd2e41d1f5843d25c
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return false;
  } else {
    return true;
  }
};
