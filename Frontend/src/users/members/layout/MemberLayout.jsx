import React, { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';
import gsap from 'gsap';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const MemberLayout = ({ children }) => {
  const [realTimeAnnouncement, setRealTimeAnnouncement] = useState(null);
  const [persistedAnnouncements, setPersistedAnnouncements] = useState([]);
  const marqueeContainerRef = useRef(null);
  const marqueeContentRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5106/api/Announcement/all');
        console.log('Fetched Announcements:', response.data.announcements);
        setPersistedAnnouncements(response.data.announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();

    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5106/hubs/announcementHub')
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');
        connection.on('ReceiveAnnouncement', (message) => {
          console.log('New Announcement:', message);
          setRealTimeAnnouncement(message);
          setTimeout(() => setRealTimeAnnouncement(null), 5000);
          setPersistedAnnouncements((prev) => [...prev, { message, createdAt: new Date().toISOString() }]);
        });
      })
      .catch((err) => console.error('Error connecting to SignalR Hub:', err));

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
  if (!marqueeContainerRef.current || !marqueeContentRef.current) return;

  const container = marqueeContainerRef.current;
  const content = marqueeContentRef.current;

  const containerWidth = container.offsetWidth;
  const contentWidth = content.scrollWidth;

  if (contentWidth < containerWidth) {
    content.innerHTML += content.innerHTML;
  }

  gsap.set(content, { x: containerWidth });

  const animationDistance = contentWidth + containerWidth;

  const anim = gsap.to(content, {
    x: -contentWidth,
    duration: animationDistance / 100,
    ease: 'linear',
    repeat: -1,
    modifiers: {
      x: (x) => `${parseFloat(x) % animationDistance}px`,
    },
  });

  return () => {
    anim.kill();
  };
}, [persistedAnnouncements]);

  return (
    <>
      <Navbar />

      {realTimeAnnouncement && (
        <div className="fixed top-0 left-0 w-full bg-indigo-600 text-white text-center py-2 z-50">
          <p>{realTimeAnnouncement}</p>
        </div>
      )}

      {/* Infinite Marquee */}
      <div className="overflow-hidden bg-indigo-100 py-2 mt-4 rounded-md relative" ref={marqueeContainerRef}>
        {persistedAnnouncements.length > 0 ? (
          <div className="flex whitespace-nowrap" ref={marqueeContentRef}>
            {[...persistedAnnouncements].map((a, i) => (
              <span key={i} className="mx-8 text-gray-700 text-base">
                📢 {a.message}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No announcements at the moment.</p>
        )}
      </div>

      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MemberLayout;