import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../common/RoundedButton';
import Image from 'next/image'; 

export default function AnimatedDescription() {
  const phrase =
    "Bringing brands to life with design that speaks, resonates, and truly connects. Because great design isn’t just seen-it’s felt.";
  const description = useRef(null);
  const isInView = useInView(description);

  return (
    <div ref={description} className={styles.description}>
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
        Hi, I'm <span className='font-bold text-[#275BE1]'>Akhshad</span> blend pixels, code, and vibes to craft digital moments that just feel right.
        </motion.p>
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className={styles.button}>
            {/* <p>About Me</p> */}
            <Image 
              src="/images/A.jpg"
              fill
              alt="background"
            />
          </Rounded>
           
        </div>
      </div>
    </div>
  );
}
