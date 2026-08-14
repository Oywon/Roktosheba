import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(badgeRef.current, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
  }, []);

  return (
    <header className="page-header">
      <div ref={badgeRef} className="hero-badge">Rokto</div>
      <div>
        <motion.h1 initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          {title}
        </motion.h1>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  );
}
