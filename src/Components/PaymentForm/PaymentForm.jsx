import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useContext, useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthContext';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');
            setLoading(true);

            const res = await axiosSecure.post('/create-payment-intent');
            const clientSecret = res.data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setError('');
                if (result.paymentIntent.status === 'succeeded') {
                    const paymentData = {
                        email: user.email,
                        transactionId: result.paymentIntent.id,
                        paymentMethod: result.paymentIntent.payment_method_types
                    };

                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    console.log(paymentRes);

                    // ✅ SweetAlert after successful payment
                    Swal.fire({
                        title: "Payment Successful",
                        text: `Transaction ID: ${result.paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: "#2563eb", // Tailwind blue-600
                        confirmButtonText: "OK"
                    });
                }
            }

            setLoading(false);
        }
    };

    return (
        <div>
            <p className='text-center text-2xl font-medium '>Grab Your Premium Membership Now </p>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200"
            >
                <h2 className="text-xl font-semibold text-center text-gray-700">
                    Complete Your Payment
                </h2>

                <div className="p-3 border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                    <CardElement className="p-2 text-lg" />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full py-3 rounded-lg font-medium 
                               bg-blue-600 hover:bg-blue-700 
                               text-white shadow-sm transition duration-200"
                >
                    {loading ? "Processing..." : "Pay $10"}
                </button>

                {error && (
                    <p className="text-red-600 text-center font-medium">{error}</p>
                )}
            </form>
        </div>
        </div>
    );
};

export default PaymentForm;
