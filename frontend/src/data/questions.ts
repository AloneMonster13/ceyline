export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth", "Brisbane"],
    correctAnswer: "Canberra"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn", "Mercury"],
    correctAnswer: "Mars"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo", "Raphael"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean", "Southern Ocean"],
    correctAnswer: "Pacific Ocean"
  },
  {
    id: 5,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946", "1947"],
    correctAnswer: "1945"
  },
  {
    id: 6,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag", "Gl"],
    correctAnswer: "Au"
  },
  {
    id: 7,
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "India", "Brazil"],
    correctAnswer: "Australia"
  },
  {
    id: 8,
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3", "5"],
    correctAnswer: "2"
  },
  {
    id: 9,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain", "Oscar Wilde"],
    correctAnswer: "William Shakespeare"
  },
  {
    id: 10,
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum", "Titanium"],
    correctAnswer: "Diamond"
  },
  {
    id: 11,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
    correctAnswer: "Hydrogen"
  },
  {
    id: 12,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus", "White Rhinoceros"],
    correctAnswer: "Blue Whale"
  },
  {
    id: 13,
    question: "In which city is the Eiffel Tower located?",
    options: ["London", "Rome", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 14,
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit", "Baht"],
    correctAnswer: "Yen"
  },
  {
    id: 15,
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8", "9"],
    correctAnswer: "7"
  },
  {
    id: 16,
    question: "What is the speed of light in vacuum (approximately)?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s", "250,000 km/s"],
    correctAnswer: "300,000 km/s"
  },
  {
    id: 17,
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune", "Mars"],
    correctAnswer: "Saturn"
  },
  {
    id: 18,
    question: "What year did the Titanic sink?",
    options: ["1910", "1911", "1912", "1913", "1914"],
    correctAnswer: "1912"
  },
  {
    id: 19,
    question: "Who is known as the father of computers?",
    options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs", "Ada Lovelace"],
    correctAnswer: "Charles Babbage"
  },
  {
    id: 20,
    question: "What is the largest desert in the world?",
    options: ["Sahara Desert", "Arabian Desert", "Gobi Desert", "Antarctic Desert", "Kalahari Desert"],
    correctAnswer: "Antarctic Desert"
  }
];

export const getRandomQuestions = (count: number = 10): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const shuffleOptions = (options: string[]): string[] => {
  return [...options].sort(() => Math.random() - 0.5);
};
