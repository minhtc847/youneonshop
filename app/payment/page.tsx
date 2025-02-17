'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrder } from "@/service/cartServices";
import { useSession } from "next-auth/react";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const amount = searchParams.get("total");
        const addressParam = searchParams.get("address");

        if (amount && addressParam) {
            setTotal(parseInt(amount));
            setAddress(decodeURIComponent(addressParam));
        }
    }, [searchParams]);

    useEffect(() => {
        if (!session) return;

        const token = session.user?.authentication_token;
        if (!token || total === 0 || !address) return;

        createOrder(token, total, address)
            .then((order) => {
                const qrUrl = `https://img.vietqr.io/image/BIDV-4271014332-compact2.png?amount=${total}&addInfo=${order.orderId}&accountName=Tran%20Cao%20Minh`;
                setQrCodeSrc(qrUrl);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to create order:", err);
                setError("Failed to create order. Please try again.");
                setLoading(false);
            });
    }, [session, total, address]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-2xl font-bold mb-4">Payment</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <p className="text-lg mb-4">Scan the QR code to complete your payment.</p>
                    {qrCodeSrc && (
                        <img src={qrCodeSrc} alt="QR Code for Payment" className="border border-gray-600 rounded-lg h-[400px]" />
                    )}
                    <p className="mt-4 text-lg">Total: {total.toLocaleString()}đ</p>
                </>
            )}
        </div>
    );
}
