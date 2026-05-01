import React, { useState, useEffect, useRef } from 'react';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [visibleItems, setVisibleItems] = useState([]);
    const observerRefs = useRef([]);

    const faqs = [
        {
            question: "What is your platform designed for?",
            answer: "Our platform is designed to help students and professionals launch their careers, connect with teammates, and build real-world projects. We provide a collaborative environment where you can learn, grow, and achieve your goals with the support of a vibrant community.",
            icon: ""
        },
        {
            question: "How do I get started?",
            answer: "Getting started is simple! Just sign up for a free account, complete your profile, and explore our community. You can join projects, connect with other members, and start building your portfolio right away. We also offer guided tutorials to help you make the most of the platform.",
            icon: ""
        },
       
        {
            question: "Can I collaborate with others on projects?",
            answer: "Absolutely! Collaboration is at the heart of what we do. You can create teams, invite members, share resources, and work together on projects in real-time. Our platform provides all the tools you need for seamless teamwork.",
            icon: ""
        },
        
     
    ];

    useEffect(() => {
        const observers = observerRefs.current.map((ref, index) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                setVisibleItems((prev) => [...new Set([...prev, index])]);
                            }, index * 100); // Stagger animation
                        }
                    });
                },
                { threshold: 0.1 }
            );

            if (ref) observer.observe(ref);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className=" relative min-h-screen bg-[#fffaf5] py-20 px-4 overflow-hidden ">
            <div className="absolute top-[1%] -right-20 md:-right-100 pointer-events-none z-0 select-none -rotate-35">
                <svg
                    viewBox="0 0 100 120"
                    className="w-[500px] md:w-[900px] h-auto"
                >
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="none"
                        stroke="#fde68a"
                        strokeWidth="0.5"
                        style={{ fontSize: '120px', fontFamily: 'Helvetica', fontWeight: '900' }}
                    >
                        ?
                    </text>
                </svg>
            </div>

                 <div className="absolute top-[45%] -right-20 md:right-260 pointer-events-none z-0 select-none rotate-25">
                <svg
                    viewBox="0 0 100 120"
                    className="w-[500px] md:w-[900px] h-auto"
                >
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="none"
                        stroke="#F4442E"
                        strokeWidth="0.5"
                        style={{ fontSize: '120px', fontFamily: 'Helvetica', fontWeight: '900' }}
                    >
                        ?
                    </text>
                </svg>
            </div>
            <div className=" relative z-10 max-w-4xl mx-auto">

                {/* Header Section with Reveal Animation */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-[#F4442E] to-[#E8563D] text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
                            FAQ
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our platform and services
                    </p>
                </div>



                {/* FAQ Container */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            ref={(el) => (observerRefs.current[index] = el)}
                            className={`transform transition-all duration-700 ${visibleItems.includes(index)
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-10 opacity-0'
                                }`}
                        >
                            <div
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${activeIndex === index
                                    ? 'border-[#F4442E]/30 shadow-lg shadow-[#F4442E]/10 scale-[1.02]'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}
                                onClick={() => toggleFaq(index)}
                            >
                                {/* Question */}
                                <div className="flex items-center justify-between p-6 md:p-7">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Icon */}
                                        <div
                                            className={`text-3xl transition-transform duration-300 ${activeIndex === index ? 'scale-110' : 'group-hover:scale-110'
                                                }`}
                                        >
                                            {faq.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                            {faq.question}
                                        </h3>
                                    </div>

                                    {/* Arrow with pulse effect when active */}
                                    <div className="relative flex-shrink-0 ml-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeIndex === index
                                                ? 'bg-gradient-to-r from-[#F4442E] to-[#E8563D]'
                                                : 'bg-gray-100 group-hover:bg-gray-200'
                                                }`}
                                        >
                                            <svg
                                                className={`w-5 h-5 transition-all duration-300 ${activeIndex === index
                                                    ? 'rotate-180 text-white'
                                                    : 'text-gray-600'
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Answer with slide and fade animation */}
                                <div
                                    className={`transition-all duration-500 ease-in-out ${activeIndex === index
                                        ? 'max-h-96 opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 md:px-7 pb-6 md:pb-7 pt-0 pl-20 md:pl-[5.5rem]">
                                        <div
                                            className={`transform transition-all duration-500 delay-100 ${activeIndex === index
                                                ? 'translate-y-0 opacity-100'
                                                : '-translate-y-2 opacity-0'
                                                }`}
                                        >
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>

                                            {/* Helpful badge */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA with Reveal */}
                {/* <div
                    className="mt-16 text-center bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-8 md:p-10 shadow-lg animate-fade-in-up mb-32"
                    style={{ animationDelay: '0.8s' }}
                >
                    <div className="mb-4 text-5xl">💡</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Can't find the answer you're looking for? Our support team is here to help you 24/7.
                    </p>
                    <button className="bg-gradient-to-r from-[#F4442E] to-[#E8563D] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                        Contact Support
                    </button>
                </div> */}

            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default FAQSection;