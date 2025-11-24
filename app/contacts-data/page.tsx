'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, LogOut, Mail, Calendar, MessageSquare } from 'lucide-react';

interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    status: string;
}

export default function ContactsDataPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [fetchError, setFetchError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            // Create Basic Auth header
            const credentials = btoa(`${username}:${password}`);

            const response = await fetch('/api/contacts', {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts);
                setIsAuthenticated(true);
                // Store credentials for future requests
                sessionStorage.setItem('auth', credentials);
            } else {
                setLoginError('Invalid username or password');
            }
        } catch (error) {
            setLoginError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        setContacts([]);
        sessionStorage.removeItem('auth');
    };

    // Check if already authenticated on mount
    useEffect(() => {
        const storedAuth = sessionStorage.getItem('auth');
        if (storedAuth) {
            fetch('/api/contacts', {
                headers: {
                    'Authorization': `Basic ${storedAuth}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.contacts) {
                        setContacts(data.contacts);
                        setIsAuthenticated(true);
                    }
                })
                .catch(() => {
                    sessionStorage.removeItem('auth');
                });
        }
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold mb-2 text-center">Admin Login</h1>
                        <p className="text-center text-gray-600 mb-8">Access contact submissions</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition pr-12"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {loginError && (
                                <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-black text-white py-3 rounded-lg font-medium transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                    }`}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Contact Submissions</h1>
                        <p className="text-gray-600">Total: {contacts.length} messages</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

                {/* Contacts Grid */}
                {contacts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-xl text-gray-600">No contact submissions yet</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{contact.name}</h3>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={16} />
                                            <a href={`mailto:${contact.email}`} className="hover:text-black transition">
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        {formatDate(contact.createdAt)}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Message:</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{contact.message}</p>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${contact.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {contact.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
