import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Admin dashboard for viewing contact submissions.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ContactsDataLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
