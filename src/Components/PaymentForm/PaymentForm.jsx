import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useContext, useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthContext';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure()
    const { user } = useContext(AuthContext)
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
        }
        else {
            setError('');

            const res = await axiosSecure.post('/create-payment-intent')

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
                    console.log('Payment succeeded!');
                    const paymentData = {
                        email: user.email,
                        transactionId: result.paymentIntent.id,
                        paymentMethod: result.paymentIntent.payment_method_types
                    }

                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    console.log(paymentRes)

                }
            }
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
                <CardElement className="p-2 border rounded">
                </CardElement>
                <button
                    type='submit'
                    className="btn btn-primary text-black w-full"
                    disabled={!stripe}
                >
                    Pay ${10}
                </button>
                {
                    error && <p className='text-red-500'>{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;