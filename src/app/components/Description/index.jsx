import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../common/RoundedButton';
import Image from 'next/image';
import SpotlightBackground from '../SpotlightBackground';
import { useTextSpotlight } from '../SpotlightBackground/useTextSpotlight';

export default function AnimatedDescription() {
  const phrase =
    "Bringing brands to life with design that speaks, resonates, and truly connects. Because great design isn’t just seen-it’s felt.";
  const description = useRef(null);
  const isInView = useInView(description);

  // Text near the cursor fades to grey as the spotlight passes over it.
  useTextSpotlight(description, ':scope > div > p');

  return (
    <div ref={description} className={styles.description}>
      <SpotlightBackground />
      <div className={styles.body}>
        <p>
          {phrase.split(" ").map((word, index) => (
            <span key={index} className={styles.mask}>
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                key={index}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>
          Hi, I&apos;m <span className='font-bold text-[#275BE1]'>Akhshad</span> blend pixels, code, and vibes to craft digital moments that just feel right.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            <Image 
              src="/images/profile.jpg"
              fill
              alt="background"
            />
          </Rounded>
        </div>
      </div>
    </div>
  );
}
