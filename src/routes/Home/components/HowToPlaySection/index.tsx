import { FaComments, FaPencil, FaTrophy } from 'react-icons/fa6';

import Text from '@/components/Text';

const steps = [
  {
    icon: <FaPencil />,
    title: 'Doodle',
    description:
      "When it's your turn, sketch the secret word for others to guess.",
  },
  {
    icon: <FaComments />,
    title: 'Hunch',
    description:
      'Type your hunches in the chat to guess what others are drawing.',
  },
  {
    icon: <FaTrophy />,
    title: 'Score',
    description: 'Earn points for correct guesses and fast, clever drawing.',
  },
];

// One connected card, not separate floating ones - the steps are a single
// sequence and should read that way.
const HowToPlaySection = () => (
  <div className="w-full p-4 bg-card-surface-2 rounded-lg shadowed">
    <Text component="h2" color="warning" className="text-center mb-3">
      How to Play
    </Text>
    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-dark-chalk-white">
      {steps.map((step) => (
        <div
          key={step.title}
          className="flex-1 flex flex-col items-center text-center gap-1 p-3"
        >
          <div className="text-chalk-yellow text-xl">{step.icon}</div>
          <Text color="warning" className="text-sm font-bold">
            {step.title}
          </Text>
          <Text className="text-xs text-light-chalk-white">
            {step.description}
          </Text>
        </div>
      ))}
    </div>
  </div>
);

export default HowToPlaySection;
