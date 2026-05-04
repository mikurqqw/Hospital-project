import api from "./index";

export const submitQuiz = async (quizType, answers, score, total) => {
  const response = await api.post("/quiz/submit", {
    quiz_type: quizType,
    answers,
    score,
    total,
  });
  return response.data;
};
