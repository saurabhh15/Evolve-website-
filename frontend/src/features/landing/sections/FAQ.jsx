import React, { useState, useEffect, useRef } from 'react';

const FAQItem = ({ faq, index, isActive, onToggle, isVisible }) => {
    const answerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const el = answerRef.current;
        if (!el) return;

        const updateHeight = () => {
            if (answerRef.current) {
                setHeight(answerRef.current.scrollHeight);
            }
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(() => {
            if (answerRef.current) {
                setHeight(answerRef.current.scrollHeight);
            }
        });
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, [faq.answer, isActive]);

    return (
        <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div
                className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group relative z-10 ${isActive
                    ? 'border-[#F4442E]/30 shadow-lg shadow-[#F4442E]/10 scale-[1.01] sm:scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                onClick={onToggle}
            >
                {/* Question */}
                <div className="flex items-center justify-between p-4 sm:p-6 md:p-7 bg-white relative z-20">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 pr-2 sm:pr-4">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                            {faq.question}
                        </h3>
                    </div>
                    <div className="relative flex-shrink-0 ml-2 sm:ml-4">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-[#F4442E] to-[#E8563D]'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                            <svg
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? 'rotate-180 text-white' : 'text-gray-600'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Answer */}
                <div style={{
                    height: isActive ? `${height}px` : '0px',
                    opacity: isActive ? 1 : 0,
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    overflow: 'hidden',
                }} className="relative z-10 bg-white">
                    <div ref={answerRef} className="px-4 sm:px-6 md:px-7 pb-4 sm:pb-6 md:pb-7 pt-0">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [visibleItems, setVisibleItems] = useState([]);
    const observerRefs = useRef([]);

    const faqs = [
        {
            question: "What is your platform designed for?",
            answer: "Our platform is designed to help students and professionals launch their careers, connect with teammates, and build real-world projects. We provide a collaborative environment where you can learn, grow, and achieve your goals with the support of a vibrant community.",
        },
        {
            question: "How do I get started?",
            answer: "Getting started is simple! Just sign up for a free account, complete your profile, and explore our community. You can join projects, connect with other members, and start building your portfolio right away. We also offer guided tutorials to help you make the most of the platform.",
        },
        {
            question: "Can I collaborate with others on projects?",
            answer: "Absolutely! Collaboration is at the heart of what we do. You can create teams, invite members, share resources, and work together on projects in real-time. Our platform provides all the tools you need for seamless teamwork.",
        },
    ];

    useEffect(() => {
        const currentRefs = observerRefs.current;
        const observers = currentRefs.map((ref, index) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                setVisibleItems((prev) => [...new Set([...prev, index])]);
                            }, index * 100);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            if (ref) observer.observe(ref);
            return observer;
        });
        return () => { observers.forEach((observer) => observer.disconnect()); };
    }, []);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="relative bg-[#fffaf5] py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">

            {/* Decorative ? */}
            <div className="absolute top-[2%] md:top-[1%] -right-10 sm:-right-20 lg:-right-40 pointer-events-none z-0 select-none -rotate-[35deg]">
                <svg viewBox="0 0 100 120" className="w-[250px] sm:w-[400px] lg:w-[700px] h-auto opacity-60 md:opacity-100">
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="none" stroke="#fde68a" strokeWidth="0.5"
                        style={{ fontSize: '120px', fontFamily: 'Helvetica', fontWeight: '900' }}>?</text>
                </svg>
            </div>

            <div className="absolute top-[60%] md:top-[45%] -left-16 sm:-left-20 pointer-events-none z-0 select-none rotate-[25deg]">
                <svg viewBox="0 0 100 120" className="w-[250px] sm:w-[400px] lg:w-[700px] h-auto opacity-30 md:opacity-100">
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="none" stroke="#F4442E" strokeWidth="0.5"
                        style={{ fontSize: '120px', fontFamily: 'Helvetica', fontWeight: '900' }}>?</text>
                </svg>
            </div>

            <div className="relative z-20 max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16" style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
                    <div className="inline-block mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-[#F4442E] to-[#E8563D] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
                            FAQ
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight px-2"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #111827, #4B5563)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-2">
                        Find answers to common questions about our platform and services
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} ref={(el) => (observerRefs.current[index] = el)}>
                            <FAQItem
                                faq={faq}
                                index={index}
                                isActive={activeIndex === index}
                                onToggle={() => toggleFaq(index)}
                                isVisible={visibleItems.includes(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default FAQSection;