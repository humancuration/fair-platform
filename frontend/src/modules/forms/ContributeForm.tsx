import { Card, CardContent, CardHeader, CardMedia, CardActions, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const ContributeForm = () => {
    const [amount, setAmount] = useState(100);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://example.com/success',
            },
        });

        if (error) {
            console.error(error);
        }
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader title="Contribute to a Campaign" />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Contribute to a campaign using Stripe for payment processing.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <PaymentElement
                        options={{
                            amount,
                            currency: 'usd',
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Contribute
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ContributeForm;