import Text from '@/components/Text';

const AboutSection = () => (
  <div className="w-full p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col gap-2 text-center">
    <Text component="h2" color="warning">
      About Doodle
    </Text>
    <Text className="text-xs text-light-chalk-white">
      Doodle is a real-time multiplayer drawing and guessing game. Take turns
      sketching a secret word while everyone else races to guess it in chat.
      Jump into a public match instantly, or create a private room and share the
      link to play with friends.
    </Text>
  </div>
);

export default AboutSection;
