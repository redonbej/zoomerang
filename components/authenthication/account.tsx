"use client";

import { LogInIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from "@/components/hooks/useAuth";
import ProfileDropdown from './profileDropdown';

export default function Account() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? (
                <ProfileDropdown/>
            ) : (
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/login" className="text-base flex items-center gap-2">
                        <LogInIcon className="!size-5" /> Sign In
                    </Link>
                </Button>
            )}
        </>
    );
}
