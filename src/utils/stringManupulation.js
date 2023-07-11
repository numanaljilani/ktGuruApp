export const stringManupuation = (desc, upto) => {
  if (desc.length > 40) {
    return desc.slice(0, upto) + " .....";
  } else {
    return desc
  }
};
