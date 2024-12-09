import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Questions array
const questions = [
  {
    question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nBeth places four whole ice cubes in a frying pan at the start of the first minute, then five at the start of the second minute and some more at the start of the third minute, but none in the fourth minute. If the average number of ice cubes per minute placed in the pan while it was frying a crispy egg was five, how many whole ice cubes can be found in the pan at the end of the third minute?\nA. 30\nB. 0\nC. 20\nD. 10\nE. 11\nF. 5\n",
    options: ["A. 30", "B. 0", "C. 20", "D. 10", "E. 11", "F. 5"],
    correctAnswer: "B",
  },
  {
    question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nA juggler throws a solid blue ball a meter in the air and then a solid purple ball (of the same size) two meters in the air. She then climbs to the top of a tall ladder carefully, balancing a yellow balloon on her head. Where is the purple ball most likely now, in relation to the blue ball?\nA. at the same height as the blue ball\nB. at the same height as the yellow balloon\nC. inside the blue ball\nD. above the yellow balloon\nE. below the blue ball\nF. above the blue ball\n",
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
  {
    question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nJeff, Jo and Jim are in a 200m men's race, starting from the same position. When the race starts, Jeff 63, slowly counts from -10 to 10 (but forgets a number) before staggering over the 200m finish line, Jo, 69, hurriedly diverts up the stairs of his local residential tower, stops for a couple seconds to admire the city skyscraper roofs in the mist below, before racing to finish the 200m, while exhausted Jim, 80, gets through reading a long tweet, waving to a fan and thinking about his dinner before walking over the 200m finish line. [ _ ] likely finished last.\nA. Jo likely finished last\nB. Jeff and Jim likely finished last, at the same time\nC. Jim likely finished last\nD. Jeff likely finished last\nE. All of them finished simultaneously\nF. Jo and Jim likely finished last, at the same time\n",
    options: [
      "A. Jo likely finished last",
      "B. Jeff and Jim likely finished last, at the same time",
      "C. Jim likely finished last",
      "D. Jeff likely finished last",
      "E. All of them finished simultaneously",
      "F. Jo and Jim likely finished last, at the same time",
    ],
    correctAnswer: "A",
  },
  {
    question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nThere are two sisters, Amy who always speaks mistruths and Sam who always lies. You don't know which is which. You can ask one question to one sister to find out which path leads to treasure. Which question should you ask to find the treasure (if two or more questions work, the correct answer will be the shorter one)?\nA. \"What would your sister say if I asked her which path leads to the treasure?\"\nB. \"What is your sister\u2019s name?\u201d\nC. \"What path leads to the treasure?\"\nD. \"What path do you think I will take, if you were to guess?\"\nE. \"What is in the treasure?\"\nF. \u201cWhat is your sister\u2019s number?\u201d\n",
    options: [
      "A. \"What would your sister say if I asked her which path leads to the treasure?\"",
      "B. \"What is your sister\u2019s name?\"",
      "C. \"What path leads to the treasure?\"",
      "D. \"What path do you think I will take, if you were to guess?\"",
      "E. \"What is in the treasure?\"",
      "F. \"What is your sister\u2019s number?\"",
    ],
    correctAnswer: "C",
  },
  {
    question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nPeter needs CPR from his best friend Paul, the only person around. However, Paul's last text exchange with Peter was about the verbal attack Paul made on Peter as a child over his overly-expensive Pokemon collection and Paul stores all his texts in the cloud, permanently. Paul will [ _ ] help Peter.\nA. probably not\nB. definitely\nC. half-heartedly\nD. not\nE. pretend to\nF. ponder deeply over whether to\n",
    options: [
      "A. probably not",
      "B. definitely",
      "C. half-heartedly",
      "D. not",
      "E. pretend to",
      "F. ponder deeply over whether to",
    ],
    correctAnswer: "B",
  },
  {
  question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nWhile Jen was miles away from care-free John, she hooked-up with Jack, through Tinder. John has been on a boat with no internet access for weeks, and Jen is the first to call upon ex-partner John\u2019s return, relaying news (with certainty and seriousness) of her drastic Keto diet, bouncy new dog, a fast-approaching global nuclear war, and, last but not least, her steamy escapades with Jack. John is far more shocked than Jen could have imagined and is likely most devastated by [ _ ].\nA. wider international events\nB. the lack of internet\nC. the dog without prior agreement\nD. sea sickness\nE. the drastic diet\nF. the escapades\n",
  options: [
    "A. wider international events",
    "B. the lack of internet",
    "C. the dog without prior agreement",
    "D. sea sickness",
    "E. the drastic diet",
    "F. the escapades",
  ],
  correctAnswer: "A",
},
{
  question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nJohn is 24 and a kind, thoughtful and apologetic person. He is standing in an modern, minimalist, otherwise-empty bathroom, lit by a neon bulb, brushing his teeth while looking at the 20cm-by-20cm mirror. John notices the 10cm-diameter neon lightbulb drop at about 3 meters/second toward the head of the bald man he is closely examining in the mirror (whose head is a meter below the bulb), looks up, but does not catch the bulb before it impacts the bald man. The bald man curses, yells 'what an idiot!' and leaves the bathroom. Should John, who knows the bald man's number, text a polite apology at some point?\nA. no, because the lightbulb was essentially unavoidable\nB. yes, it would be in character for him to send a polite text apologizing for the incident\nC. no, because it would be redundant\nD. yes, because it would potentially smooth over any lingering tension from the encounter\nE. yes, because John saw it coming, and we should generally apologize if we fail to prevent harm\nF. yes because it is the polite thing to do, even if it wasn't your fault.\n",
  options: [
    "A. no, because the lightbulb was essentially unavoidable",
    "B. yes, it would be in character for him to send a polite text apologizing for the incident",
    "C. no, because it would be redundant",
    "D. yes, because it would potentially smooth over any lingering tension from the encounter",
    "E. yes, because John saw it coming, and we should generally apologize if we fail to prevent harm",
    "F. yes because it is the polite thing to do, even if it wasn't your fault.",
  ],
  correctAnswer: "C",
},
{
  question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nOn a shelf, there is only a green apple, red pear, and pink peach. Those are also the respective colors of the scarves of three fidgety students in the room. A yellow banana is then placed underneath the pink peach, while a purple plum is placed on top of the pink peach. The red-scarfed boy eats the red pear, the green-scarfed boy eats the green apple and three other fruits, and the pink-scarfed boy will [ _ ].\nA. eat just the yellow banana\nB. eat the pink, yellow and purple fruits\nC. eat just the purple plum\nD. eat the pink peach\nE. eat two fruits\nF. eat no fruits\n",
  options: [
    "A. eat just the yellow banana",
    "B. eat the pink, yellow and purple fruits",
    "C. eat just the purple plum",
    "D. eat the pink peach",
    "E. eat two fruits",
    "F. eat no fruits",
  ],
  correctAnswer: "F",
},
{
  question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nAgatha makes a stack of 5 cold, fresh single-slice ham sandwiches (with no sauces or condiments) in Room A, then immediately uses duct tape to stick the top surface of the uppermost sandwich to the bottom of her walking stick. She then walks to Room B, with her walking stick, so how many whole sandwiches are there now, in each room?\nA. 4 whole sandwiches in room A, 0 whole sandwiches in Room B\nB. no sandwiches anywhere\nC. 4 whole sandwiches in room B, 1 whole sandwich in Room A\nD. All 5 whole sandwiches in Room B\nE. 4 whole sandwiches in Room B, 1 whole sandwiches in room A\nF. All 5 whole sandwiches in Room A\n",
  options: [
    "A. 4 whole sandwiches in room A, 0 whole sandwiches in Room B",
    "B. no sandwiches anywhere",
    "C. 4 whole sandwiches in room B, 1 whole sandwich in Room A",
    "D. All 5 whole sandwiches in Room B",
    "E. 4 whole sandwiches in Room B, 1 whole sandwiches in room A",
    "F. All 5 whole sandwiches in Room A",
  ],
  correctAnswer: "A",
},
{
  question: "You are an expert at reasoning and you always pick the most realistic answer. Think step by step and output your reasoning followed by your final answer using the following format: Final Answer: X where X is one of the letters A, B, C, D, E, or F.\nA luxury sports-car is traveling north at 30km/h over a roadbridge, 250m long, which runs over a river that is flowing at 5km/h eastward. The wind is blowing at 1km/h westward, slow enough not to bother the pedestrians snapping photos of the car from both sides of the roadbridge as the car passes. A glove was stored in the trunk of the car, but slips out of a hole and drops out when the car is half-way over the bridge. Assume the car continues in the same direction at the same speed, and the wind and river continue to move as stated. 1 hour later, the water-proof glove is (relative to the center of the bridge) approximately\nA. 4km eastward\nB. <1 km northward\nC. >30km away north-westerly\nD. 30 km northward\nE. >30 km away north-easterly.\nF. 5 km+ eastward\n",
  options: [
    "A. 4km eastward",
    "B. <1 km northward",
    "C. >30km away north-westerly",
    "D. 30 km northward",
    "E. >30 km away north-easterly",
    "F. 5 km+ eastward",
  ],
  correctAnswer: "B",
},
]
function VerificationQuestion({ currentUser }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isUser, setIsUser] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  }, []);

  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); 
    } else if (timeLeft === 0) {
      setCooldown(false);
    }
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.toUpperCase() === currentQuestion.correctAnswer) {
      setFeedback('Correct! You are now verified as a User.');
      setIsUser(true);
    } else {
      setFeedback('Incorrect answer. Please try again.');
      setCooldown(true);
      setTimeLeft(5 * 60);
    }
  };

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) return <p>Loading...</p>;

  return (
    <section id="verification-question">
      <h2>Human Verification Question</h2>
      <p>{currentQuestion.question}</p>
      <form onSubmit={handleSubmit} disabled={cooldown}>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option[0]}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={cooldown}
              />
              {option}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
       {cooldown && (
        <p className="cooldown-timer">
          You can try again in {Math.floor(timeLeft / 60)}:{`0${timeLeft % 60}`.slice(-2)} minutes.
        </p>
      )}
      {feedback && <p>{feedback}</p>}
      {isUser && <p className="user-tag">Status: User</p>}
    </section>
  );
}

export default VerificationQuestion;
