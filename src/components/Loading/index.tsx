import { HTMLAttributes, PropsWithChildren } from 'react';

import Text from '../Text';

interface LoadingProps {
  fullScreen?: boolean;
}

const LoadingParent = ({
  fullScreen,
  children,
  ...rest
}: LoadingProps &
  PropsWithChildren &
  Omit<HTMLAttributes<HTMLElement>, 'className'>) => {
  if (fullScreen)
    return (
      <div className="w-screen h-screen bg-board-green" {...rest}>
        {children}
      </div>
    );
  return (
    <div className="w-full h-full" {...rest}>
      {children}
    </div>
  );
};

const LoadingChild = ({ fullScreen }: LoadingProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {fullScreen && <Text className="mb-4">Loading...</Text>}
      <svg
        className={`${fullScreen ? 'w-1/5 lg:w-36' : 'w-8'} aspect-square`}
        viewBox="0 0 100 100"
      >
        <circle
          r={45}
          cx={50}
          cy={50}
          width={100}
          height={100}
          strokeWidth={fullScreen ? 2 : 4}
          strokeDasharray={100}
          strokeDashoffset={100}
          strokeLinecap="round"
          className="stroke-chalk-white fill-none animate-spin origin-center"
        />
      </svg>
    </div>
  );
};

const Loading = ({
  fullScreen = false,
  ...rest
}: LoadingProps & Omit<HTMLAttributes<HTMLElement>, 'className'>) => {
  return (
    <LoadingParent fullScreen={fullScreen} {...rest}>
      <LoadingChild fullScreen={fullScreen} />
    </LoadingParent>
  );
};

export default Loading;
