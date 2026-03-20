import React, { useState, useRef, useEffect } from 'react';
import { MdChat, MdSend, MdClose, MdSmartToy } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaskar! 🙏 Mi ProjectBot ahe. Tumhala konta project havay? (Eg: 'Show Python Projects', 'Mala React project dakhva')", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Access Projects from Redux to make the bot 'Smart'
    const projectList = useSelector(state => state.project);
    const { allProjects } = projectList;
    const navigate = useNavigate();

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User Message
        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        const lowerInput = input.toLowerCase();
        setInput('');

        // BOT LOGIC (Simple Rule-Based AI)
        setTimeout(() => {
            let botResponse = { text: "Sorry, mala samjal nahi. Please technology che naav taka (Java, Python, MERN).", sender: 'bot' };

            // 1. Greetings
            if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('namaskar')) {
                botResponse.text = "Hello! Kasa ahat? Project shodhayla madat karu?";
            }
            // 2. Marathi Queries
            else if (lowerInput.includes('kasa') || lowerInput.includes('kuthe')) {
                botResponse.text = "Mi ek AI Robot ahe 🤖. Mi tumhala best projects sodhayla madat Karin!";
            }
            // 3. Project Search (Technicall)
            else if (allProjects) {
                const foundProjects = allProjects.filter(p =>
                    lowerInput.includes(p.title.toLowerCase()) ||
                    lowerInput.includes(p.category.toLowerCase()) ||
                    lowerInput.includes(p.techStack.toLowerCase())
                );

                if (foundProjects.length > 0) {
                    const projectNames = foundProjects.map(p => p.title).join(", ");
                    botResponse.text = `Ho! Amchyakade ${foundProjects.length} projects ahet: ${projectNames}. Check Marketplace!`;
                    // Optional: Navigate logic or Link could be added
                } else if (lowerInput.includes('project') || lowerInput.includes('pahi')) {
                    botResponse.text = "Sorry, ya topic var sadhya project nahiye. Pan tumhi 'Marketplace' Check kara!";
                }
            }

            // 4. Price Queries
            if (lowerInput.includes('price') || lowerInput.includes('kimmat') || lowerInput.includes('paise')) {
                botResponse.text = "Ekhada project select kara, mag mi priority price sangu shakto. Sadharan ₹500 - ₹5000 range ahe.";
            }

            setMessages(prev => [...prev, botResponse]);
        }, 1000); // Simulate thinking delay
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-[var(--primary)] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MdSmartToy size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Project Assistant</h3>
                                <p className="text-[10px] opacity-80">Online | Reply in 1s</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="hover:bg-white/20 p-1 rounded-full"><MdClose /></button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-[var(--primary)] text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                        <button type="submit" className="bg-[var(--primary)] text-white p-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50" disabled={!input.trim()}>
                            <MdSend size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`${isOpen ? 'scale-0' : 'scale-100'} transition-transform duration-300 bg-[var(--primary)] text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:scale-110 flex items-center justify-center`}
            >
                <MdChat size={28} />
            </button>
        </div>
    );
};

export default ChatBot;
