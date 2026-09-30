import Text from '@/components/Text';

const AboutSection = () => (
  <div className="w-full p-4 bg-card-surface-2 rounded-lg shadowed flex flex-col gap-2 text-center">
    <Text component="h2" color="warning">
      About Hunchpad
    </Text>
    <Text className="text-xs text-light-chalk-white">
      Hunchpad is a real-time multiplayer drawing game. Take turns sketching a
      secret word while everyone else races to hunch it in chat. Jump into a
      public match instantly, or create a private room and share the link to
      play with friends.
    </Text>
  </div>
);

export default AboutSection;
