import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('portfolio');
        const collection = db.collection('contacts');

        // Insert the contact form data
        const result = await collection.insertOne({
            name,
            email,
            message,
            createdAt: new Date(),
            status: 'new'
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Message sent successfully!',
                id: result.insertedId
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving contact form:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
