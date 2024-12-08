import React, { useState, useEffect } from 'react';

// Questions array
const questions = [
  {
    question: "Beth places four whole ice cubes in a frying pan at the start of the first minute, then five at the start of the second minute and some more at the start of the third minute, but none in the fourth minute. If the average number of ice cubes per minute placed in the pan while it was frying a crispy egg was five, how many whole ice cubes can be found in the pan at the end of the third minute?",
    options: ["A. 30", "B. 0", "C. 20", "D. 10", "E. 11", "F. 5"],
    correctAnswer: "B",
  },
  {
    question: "A juggler throws a solid blue ball a meter in the air and then a solid purple ball (of the same size) two meters in the air. She then climbs to the top of a tall ladder carefully, balancing a yellow balloon on her head. Where is the purple ball most likely now, in relation to the blue ball?",
    options: [
      "A. at the same height as the blue ball",
      "B. at the same height as the yellow balloon",
      "C. inside the blue ball",
      "D. above the yellow balloon",
      "E. below the blue ball",
      "F. above the blue ball",
    ],
    correctAnswer: "A",
  },
  // Add remaining questions here...
];

function VerificationQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // Randomize and pick a question when the component mounts
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.toUpperCase() === currentQuestion.correctAnswer) {
      setFeedback('Correct! You are now verified as a User.');
      setIsUser(true); // Assign the user tag
    } else {
      setFeedback('Incorrect answer. Please try again.');
    }
  };

  if (!currentQuestion) return <p>Loading...</p>;

  return (
    <section id="verification-question">
      <h2>Human Verification Question</h2>
      <p>{currentQuestion.question}</p>
      <form onSubmit={handleSubmit}>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option[0]} // The first letter of the option (e.g., "A", "B")
                onChange={(e) => setAnswer(e.target.value)}
              />
              {option}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {feedback && <p>{feedback}</p>}
      {isUser && <p className="user-tag">Status: User</p>}
    </section>
  );
}

export default VerificationQuestion;
