import paypal from "@paypal/checkout-server-sdk";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";

let environment;
if (PAYPAL_MODE === "live") {
    environment = new paypal.core.LiveEnvironment(
        PAYPAL_CLIENT_ID,
        PAYPAL_CLIENT_SECRET
    );
} else {
    environment = new paypal.core.SandboxEnvironment(
        PAYPAL_CLIENT_ID,
        PAYPAL_CLIENT_SECRET
    );
}

const client = new paypal.core.PayPalHttpClient(environment);

export default client;
