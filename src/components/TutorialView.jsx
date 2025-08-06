// src/components/TutorialView.jsx
import React from "react";
import "./TutorialView.css";

export default function TutorialView() {
  return (
    <div className="tutorial-view">
      <h2>how to play</h2>

      <section>
        <h3>1. plant your seeds</h3>
        <p>
          Buy seeds from the <strong>shop</strong> (you get three free starter seeds), then press the plant button to plant! 
        </p>
      </section>

      <section>
        <h3>2. water your plants</h3>
        <p>
          Hit the <strong>water</strong> button to launch the mini-game. Tap in time with the rhythm to fill the gauge.
          <em> If you miss, your plant will wilt after 3 misses.</em> 
          <em> Hover any plant card first to see its recipe tooltip, which tells you exactly what action to take next!</em>
        </p>
      </section>

      <section>
        <h3>3. fertilize</h3>
        <p>
          When a recipe requires it, click <strong>fertilize</strong>. 
            <em> You can use standard, premium, or compost fertilizers depending on your inventory.</em>
          <em> Be sure to check the recipe tooltip to know when fertilizing is the correct next step.</em>
        </p>
      </section>

      <section>
        <h3>4. view full recipes</h3>
        <p>
          Switch to the <strong>recipes</strong> tab to see detailed growth recipes for every seed type, perfect for planning your care sequence in advance and working around weather conditions.
          <em> Each plant has a unique recipe that guides you through its growth stages.</em>
        </p>
      </section>

      <section>
        <h3>5. unlock & explore new maps</h3>
        <p>
          Go to the <strong>map</strong> tab to see bloom & coin requirements. Once you meet them, the “Unlock” button will light up,click to unlock, then travel between biomes to expand your garden.
        </p>
      </section>

      <section>
        <h3>6. weather</h3>
        <p>
          Click the <strong>weather</strong> icon when it glows. Plants may require a certain weather condition to grow to their next stage. 
        </p>
      </section>

      <section>
        <h3>7. check your journal</h3>
        <p>
          After each harvest, open the <strong>journal</strong> tab. Reflect on your progress, or write down your thoughts.
        </p>
      </section>

      <div className="tutorial-tips">
        <h4>tips & tricks</h4>
        <ul>
          <li>Hover plant cards to reveal their <strong>recipe tooltip</strong> , it tells you exactly what action to take next.</li>
          <li>Use the <strong>recipes</strong> tab as your detailed guide for each plant’s full care sequence.</li>
          <li>Keep an eye on your bloom count,every bloom brings you closer to new maps.</li>
          <li>Visit the shop often and in different biomes, rarer seeds unlock as you explore more biomes.</li>
        </ul>
      </div>
    </div>
  );
}
