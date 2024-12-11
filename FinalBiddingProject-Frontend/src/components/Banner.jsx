import React, { useRef } from 'react';

function Banner() {
  const targetSectionRef = useRef(null);

  const handleScroll = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <section className="banner">
        <h2>Welcome to TEAM R BIDDING</h2>
        <p>Securely conduct business transactions with ease.</p>
        <p>To get started, click on the Get Started button below.</p>
        <button onClick={handleScroll}>Get Started</button>
      </section>
      <section ref={targetSectionRef} className="target-section">
        <h2>Target Section</h2>
        <p>This is the section you are scrolled to after clicking the button.</p>
      </section>
    </div>
  );
}

export default Banner;
