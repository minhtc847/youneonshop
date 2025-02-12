// components/RedirectListener.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectListener: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const handleRedirect = () => {
            router.push('/login');
        };

        window.addEventListener('redirectToLogin', handleRedirect);

        return () => {
            window.removeEventListener('redirectToLogin', handleRedirect);
        };
    }, [router]);

    return null;
};

export default RedirectListener;