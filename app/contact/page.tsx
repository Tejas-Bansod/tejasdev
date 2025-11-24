'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Header from '../components/header/header';
import { Mail, Github, Linkedin, ArrowUpRight, Send, Instagram } from 'lucide-react';

const socialLinks = [
    {
        name: 'Email',
        handle: 'tejas.bansod.work@gmail.com',
        href: 'mailto:tejas.bansod.work@gmail.com',
        icon: Mail,
        description: 'Best way to reach me'
    },
    {
        name: 'GitHub',
        handle: '@Tejas-Bansod',
        href: 'https://github.com/Tejas-Bansod',
        icon: Github,
        description: 'Check out my code'
    },
    {
        name: 'LinkedIn',
        handle: 'Tejas Bansod',
        href: 'https://www.linkedin.com/in/tejas-bansod-profile/',
        icon: Linkedin,
        description: 'Let\'s connect professionally'
    },
    {
        name: 'Instagram',
        handle: '@itstejasbansod',
        href: 'https://www.instagram.com/itstejasbansod',
        icon: Instagram,
        description: 'Follow my journey'
    },
];

export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useGSAP(() => {
        // Hero animation
        const tl = gsap.timeline();

        tl.from('.hero-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out"
        })
            .from('.social-item', {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.5")
            .from('.form-field', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.6");

        // Floating animation for decorative elements
        gsap.to('.float-element', {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.5
        });

    }, { scope: containerRef });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage({ type: 'success', text: 'Message sent successfully! I\'ll get back to you soon.' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitMessage({ type: 'error', text: data.error || 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f5f5f5] text-[#262626] relative overflow-hidden">
            <Header />

            {/* Decorative floating elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className="float-element absolute top-1/4 right-1/4 w-64 h-64 bg-black rounded-full blur-3xl" />
                <div className="float-element absolute bottom-1/4 left-1/4 w-96 h-96 bg-black rounded-full blur-3xl" />
            </div>

            <main className="relative pt-32 pb-32 px-6 md:px-12 lg:px-24">

                {/* Hero Section */}
                <section className="mb-32 md:mb-40">
                    <div className="overflow-hidden mb-8">
                        <p className="hero-line text-sm uppercase tracking-[0.3em] opacity-40 font-mono">
                            Get in touch
                        </p>
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="hero-line text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[0.95] font-bold tracking-tight mb-8">
                            Let's work<br />together
                        </h1>
                    </div>
                    <div className="overflow-hidden max-w-2xl">
                        <p className="hero-line text-xl md:text-2xl leading-relaxed opacity-70">
                            Have a project in mind or just want to chat?
                            I'm always open to discussing new opportunities and creative ideas.
                        </p>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-12 gap-16 md:gap-20">

                    {/* Left Column - Social Links */}
                    <div className="md:col-span-5">
                        <h2 className="text-2xl font-bold mb-8">Connect</h2>
                        <div className="space-y-6">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target={link.name !== 'Email' ? '_blank' : undefined}
                                    rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                                    className="social-item group block border-b border-black/10 pb-6 hover:border-black/30 transition-colors duration-300"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium text-lg">{link.name}</span>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                    </div>
                                    <p className="text-sm opacity-60 mb-1">{link.description}</p>
                                    <p className="font-mono text-sm opacity-40">{link.handle}</p>
                                </a>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-16 pt-8 border-t border-black/10">
                            <h3 className="font-bold mb-4">Location</h3>
                            <p className="opacity-60 mb-6">Based in India<br />Available worldwide</p>

                            <h3 className="font-bold mb-4">Response Time</h3>
                            <p className="opacity-60">Usually within 24 hours</p>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="md:col-span-7">
                        <h2 className="text-2xl font-bold mb-8">Send a message</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name Field */}
                            <div className="form-field">
                                <label
                                    htmlFor="name"
                                    className={`block text-sm uppercase tracking-widest mb-3 transition-opacity ${focusedField === 'name' ? 'opacity-100' : 'opacity-40'
                                        }`}
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black pb-3 text-xl outline-none transition-colors duration-300"
                                    placeholder="Your Name"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="form-field">
                                <label
                                    htmlFor="email"
                                    className={`block text-sm uppercase tracking-widest mb-3 transition-opacity ${focusedField === 'email' ? 'opacity-100' : 'opacity-40'
                                        }`}
                                >
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black pb-3 text-xl outline-none transition-colors duration-300"
                                    placeholder="example@example.com"
                                />
                            </div>

                            {/* Message Field */}
                            <div className="form-field">
                                <label
                                    htmlFor="message"
                                    className={`block text-sm uppercase tracking-widest mb-3 transition-opacity ${focusedField === 'message' ? 'opacity-100' : 'opacity-40'
                                        }`}
                                >
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    rows={6}
                                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black pb-3 text-xl outline-none resize-none transition-colors duration-300"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {/* Success/Error Message */}
                            {submitMessage && (
                                <div className={`p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {submitMessage.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="form-field pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`group inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:gap-5 hover:px-12'
                                        }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>

                        {/* Note */}
                        <p className="mt-12 text-sm opacity-40 italic">
                            * I respect your privacy. Your information will never be shared with third parties.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <section className="mt-40 md:mt-56 border-t border-black/10 pt-16">
                    <div className="text-center">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
                            Ready to bring your ideas to life?
                        </h3>
                        <p className="text-lg opacity-60 max-w-xl mx-auto">
                            Let's create something amazing together. Drop me a message and let's get started.
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}
