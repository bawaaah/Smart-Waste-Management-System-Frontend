// WasteTypeFactory.js
export const wasteTypeFactory = (type) => {
  switch (type) {
    case "Electronic Waste":
      return { type, img: require("./images/electronicwaste.jpg") };
    case "Bulky Waste":
      return { type, img: require("./images/bulkwaste.jpg") };
    case "Organic Waste":
      return { type, img: require("./images/organic.jpg") };
    case "Medical Waste":
      return { type, img: require("./images/medicalwaste.jpg") };
    default:
      throw new Error("Unknown waste type");
  }
};
