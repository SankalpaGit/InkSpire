// App.jsx (or HomePage.jsx)
import React, { useEffect, useRef } from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedBooks } from '../components/home/FeaturedBooks';
import MemberLayout from '../layout/MemberLayout';

const HomePage = () => {
  return (
    <MemberLayout>
      <div className=" text-gray-800 ">

        <Hero />
        <FeaturedBooks />

      </div>
    </MemberLayout>
  );
};

export default HomePage;
