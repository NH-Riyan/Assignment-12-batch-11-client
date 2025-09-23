import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import PaymentForm from '../PaymentForm/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_payment_Key)


const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm></PaymentForm>
        </Elements>
    );
};

export default Payment;