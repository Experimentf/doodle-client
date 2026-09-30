import { FaGithub } from 'react-icons/fa6';

import Text from '@/components/Text';

const Footer = () => (
  <footer className="w-full flex items-center justify-center gap-4 py-4 text-xs text-light-chalk-white">
    <Text className="text-xs" disabled>
      © {new Date().getFullYear()} Doodle
    </Text>
    <a
      href="https://github.com/Experimentf/doodle-client"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 hover:text-chalk-white transition-colors"
    >
      <FaGithub /> GitHub
    </a>
    {/* Required by the Croodles CC BY 4.0 license. */}
    <a
      href="https://www.figma.com/community/file/966199982810283152"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-chalk-white transition-colors"
    >
      Avatars: Croodles by vijay verma (CC BY 4.0)
    </a>
  </footer>
);

export default Footer;
