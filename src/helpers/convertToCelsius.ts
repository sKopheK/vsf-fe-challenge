const convertToCelsius = (temperature: number | undefined) => {
  if (temperature !== undefined) {
    return (temperature - 32) / 1.8;
  }
};

export default convertToCelsius;
