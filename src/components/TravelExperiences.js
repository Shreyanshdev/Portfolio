// components/TravelExperiences.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Modal Component (can be in the same file or a separate one, e.g., components/TravelModal.jsx)
const TravelModal = ({ isOpen, onClose, title, content, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onClose} // Close modal when clicking outside
    >
      {/* Modal Overlay with Glassmorphism */}
      <div
        className={`absolute mt-10 inset-0 ${isDark ? 'bg-transparent bg-opacity-20' : 'bg-transparent bg-opacity-50'} backdrop-filter -webkit-backdrop-filter backdrop-blur-lg`}
      ></div>

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`relative p-6 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto sm:mt-0 mt-18 scrollbar-hide
          ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-700'} hover:scale-110 transition-transform`}
        >
          &times;
        </button>
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <div className="text-lg leading-relaxed space-y-4">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

function TravelExperiences({ isDark }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({ title: '', content: '' });
  };

  const nainitalContent = (
    <>
      <p>My journey to the serene hills of Nainital was nothing short of magical. Nestled in the Kumaon Himalayas, this charming lake city captivated me from the moment I arrived. The centerpiece, Naini Lake, shimmered under the sun, inviting boat rides that offered panoramic views of the surrounding peaks.</p>
      <p>I spent hours simply sitting by the lake, watching the vibrant boats and the mist rolling over the mountains. A visit to the Naina Devi Temple, perched on the northern shore, was a peaceful experience, offering spiritual solace amidst breathtaking beauty.</p>
      <p>The Mall Road was a bustling hub of activity, with its lively shops, delicious street food, and charming cafes. I indulged in some local delicacies and found unique souvenirs. The cable car ride to Snow View Point was an absolute highlight, presenting an unparalleled vista of the snow-capped Himalayan range, including Nanda Devi.</p>
      <p>Each photograph I took barely scratches the surface of Nainital's charm. The crisp mountain air, the tranquility of the lake, and the warmth of the locals made this trip an unforgettable escape into nature's embrace. It truly felt like stepping into a postcard.</p>
    </>
  );

  const mathuraVrindavanContent = (
    <>
      <p>Stepping into Mathura and Vrindavan was like entering another realm, one steeped in profound spirituality and devotion. As the birthplace of Lord Krishna, Mathura vibrated with ancient stories and sacred energy. The Krishna Janmabhoomi Temple complex was a powerful experience, where the air hummed with prayers and chants.</p>
      <p>Vrindavan, just a short drive away, felt even more intensely spiritual. Every alleyway, every temple, echoed with tales of Krishna's playful childhood. The Banke Bihari Temple was a highlight, with its unique darshan (viewing of the deity) intervals and the fervent devotion of its congregants.</p>
      <p>I was particularly moved by the Prem Mandir, an architectural marvel of white marble that glows magnificently at night. Its intricate carvings depict various scenes from Krishna's life, and walking through its expansive grounds filled me with a sense of peace and awe. The evening aarti (ritual worship with lamps) by the Yamuna River was an incredibly moving and immersive experience, with thousands of lamps illuminating the water.</p>
      <p>The vibes in both cities were undeniably spiritual – from the devotional songs emanating from temples to the countless pilgrims walking with faith in their hearts. Our experience was truly amazing, connecting us deeply with the rich spiritual heritage and divine energy that permeates every corner of these holy towns.</p>
    </>
  );

  return (
    <>
      {/* Nainital Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-8 items-center "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Nainital"
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
        <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            AUGUST 2024 → NAINITAL
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My Journey to<br />Nainital
          </h2>
          <motion.button
            className={`px-6 py-3 rounded-full cursor-pointer border ${isDark ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("My Journey to Nainital", nainitalContent)}
          >
            SEE FULL EXPERIENCE OF ME
          </motion.button>
        </div>
      </motion.div>

      {/* Mathura Vrindavan Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-8 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={`${isDark ? 'text-white' : 'text-gray-900'} order-2 md:order-1`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            SEPTEMBER 2024 → MATHURA & VRINDAVAN
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Spiritual Vibes<br />Mathura & Vrindavan
          </h2>
          <p>
            The spiritual aura, the temples, the vibes – our experience was truly amazing!
          </p>
          <motion.button
            className={`px-6 py-3 rounded-full cursor-pointer border mt-3 ml-2 ${isDark ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("Spiritual Vibes: Mathura & Vrindavan", mathuraVrindavanContent)}
          >
            SEE FULL EXPERIENCE OF ME
          </motion.button>
        </div>
        <div className="relative order-1 md:order-2">
          <img
            src="https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Mathura & Vrindavan"
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
      </motion.div>

      {/* Render the Modal Component */}
      <TravelModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalContent.title}
        content={modalContent.content}
        isDark={isDark}
      />
    </>
  );
}

export default TravelExperiences;