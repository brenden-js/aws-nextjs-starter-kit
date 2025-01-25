/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "your-project-name",
            removal: input?.stage === "production" ? "retain" : "remove",
            home: "aws",
        };
    },
    async run() {
        const clerkPublic = new sst.Secret("ClerkPublicKey")
        const clerkSecret = new sst.Secret("ClerkSecretKey")

        const dbUrl = new sst.Secret("DbUrl")
        const dbToken = new sst.Secret("DbToken")

        // The following secrets are only used for the included real estate example application
        // If you're not using the example app, you can safely delete these secrets and their references
        const googleApiKey = new sst.Secret("GoogleApiKey")
        const publicGoogleApiKey = new sst.Secret("PublicGoogleApiKey")
        const googleAiKey = new sst.Secret("GoogleAiKey")
        const houseApiKey = new sst.Secret("HouseApiKey")
        const zipCodeApiKey = new sst.Secret("ZipCodeApiKey")

        const stripePublicKey = new sst.Secret("StripePublicKey")
        const stripeSecretKey = new sst.Secret("StripeSecretKey")
        const stripeWebhookSecret = new sst.Secret("StripeWebhookSecret")

        const inngestSigningKey = new sst.Secret("InngestSigningKey")
        const inngestEventKey = new sst.Secret("InngestEventKey")

        const prodDomain = {
            name: "your-domain.com",
            dns: undefined,
            cert: "arn:aws:acm:us-east-1:XXXXXXXXXXXX:certificate/CERTIFICATE-ID"
        }

        const getDomain = () => {
            if ($app.stage === 'prod') return prodDomain
            return undefined
        }

        const next = new sst.aws.Nextjs("NextjsStarterKit", {
            link: [
                clerkPublic, clerkSecret, dbUrl, dbToken, houseApiKey, googleApiKey, stripeSecretKey,
                stripePublicKey, stripeWebhookSecret, inngestSigningKey, inngestEventKey, publicGoogleApiKey
            ],
            domain: undefined,
            environment: {
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublic.value,
                CLERK_SECRET_KEY: clerkSecret.value,
                NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
                NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
                NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
                NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/dashboard',
                DATABASE_URL: dbUrl.value,
                DATABASE_TOKEN: dbToken.value,
                GOOGLE_API_KEY: googleApiKey.value,
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: publicGoogleApiKey.value,
                HOUSE_DATA_API_KEY: houseApiKey.value,
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY: stripePublicKey.value,
                STRIPE_SECRET_KEY: stripeSecretKey.value,
                STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
                NEXT_PUBLIC_APP_URL: $app.stage === 'prod' ? 'https://your-domain.com' : 'http://localhost:3000',
                INNGEST_SIGNING_KEY: inngestSigningKey.value,
                INNGEST_EVENT_KEY: inngestEventKey.value,
                GOOGLE_AI_KEY: googleAiKey.value,
                ZIPCODE_API_KEY: zipCodeApiKey.value,
            },
        });
    },
}); 