import { FaGithub } from 'react-icons/fa6';

import Text from '@/components/Text';

const linkClass =
  'underline-offset-2 hover:underline hover:text-chalk-white transition-colors';

const Footer = () => (
  <footer className="w-full flex flex-col items-center gap-1.5 px-4 py-4 text-center text-light-chalk-white">
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
      <Text className="text-xs" disabled>
        © {new Date().getFullYear()} Hunchpad
      </Text>
      <a
        href="https://github.com/Experimentf/doodle-client"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-chalk-white transition-colors"
      >
        <FaGithub /> GitHub
      </a>
    </div>
    {/* Attribution the Croodles avatars' CC BY 4.0 license asks for: creator, source and license. */}
    <p className="text-[0.7rem] opacity-80">
      Avatars from{' '}
      <a
        href="https://www.figma.com/community/file/966199982810283152"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Croodles
      </a>{' '}
      by vijay verma ·{' '}
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
        rel="noopener noreferrer license"
        className={linkClass}
      >
        CC BY 4.0
      </a>
    </p>
  </footer>
);

export default Footer;
