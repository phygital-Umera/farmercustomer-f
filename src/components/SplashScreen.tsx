import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import scooterImg from '../assets/splash-scooter.jpg';

type SplashScreenProps = {
  onFinish: () => void;
};

const RIDE_DURATION = 2.4; // seconds
const FADE_DURATION = 0.5; // seconds
const REDUCED_MOTION_HOLD = 1500; // ms

/**
 * One-time animated splash: the delivery scooter rides in from the left,
 * pauses in the centre, rides off to the right, then the overlay fades out.
 */
const SplashScreen = ({onFinish}: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  // Reduced-motion fallback: show the image statically, then fade out.
  useEffect(() => {
    if (!reduceMotion) return;
    const t = setTimeout(() => setVisible(false), REDUCED_MOTION_HOLD);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="splash"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white"
          initial={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: FADE_DURATION, ease: 'easeInOut'}}
        >
          {/* Horizontal ride: enter left → pause centre → exit right */}
          <motion.div
            className="relative flex w-[80vw] max-w-[520px] flex-col items-center sm:w-[60vw]"
            initial={{x: reduceMotion ? 0 : '-100vw'}}
            animate={
              reduceMotion ? {x: 0} : {x: ['-100vw', '0vw', '0vw', '100vw']}
            }
            transition={
              reduceMotion
                ? {duration: 0}
                : {
                    duration: RIDE_DURATION,
                    times: [0, 0.35, 0.6, 1],
                    ease: ['easeOut', 'linear', 'easeIn'],
                  }
            }
            onAnimationComplete={() => {
              if (!reduceMotion) setVisible(false);
            }}
          >
            {/* Road-bump bob + slight forward lean */}
            <motion.img
              src={scooterImg}
              alt="Farmer Vegetable Store delivery scooter"
              draggable={false}
              className="h-auto w-full select-none"
              style={{transformOrigin: '50% 90%'}}
              animate={
                reduceMotion
                  ? undefined
                  : {y: [0, -4, 0, -2, 0], rotate: [0, -1, 0, -0.5, 0]}
              }
              transition={{
                duration: 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Ground shadow under the wheels */}
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="bg-gray-300/50 absolute bottom-[3%] h-[3%] w-[55%] rounded-full blur-sm"
                animate={{scaleX: [1, 0.95, 1, 0.97, 1]}}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
