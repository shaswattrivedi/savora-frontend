const mockChefNames = [
  "Aria Monroe",
  "Luca Fernández",
  "Priya Batra",
  "Noah Castillo",
  "Zoe Park",
  "Mateo Ricci",
  "Sasha Imani",
  "Juniper Hayes",
  "Elias Fournier",
  "Mira Solano",
  "Declan O'Keefe",
  "Yara Bennani",
  "Owen Kato",
  "Léa Montrose",
  "Ibrahim Faris"
];

const hashString = (value) => {
  const text = String(value ?? "guest-chef");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getMockChefName = (seed) => {
  const hash = hashString(seed);
  const index = hash % mockChefNames.length;
  return mockChefNames[index];
};

export default getMockChefName;
