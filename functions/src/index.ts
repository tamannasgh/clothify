import { setGlobalOptions } from "firebase-functions";
import { onCall } from "firebase-functions/https";
import { createHmac } from "node:crypto";
import Razorpay from "razorpay";

setGlobalOptions({ maxInstances: 10 });

let razorpay: Razorpay;

function getRazorpay() {
	if (!razorpay) {
		razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID!,
			key_secret: process.env.RAZORPAY_KEY_SECRET!,
		});
	}
	return razorpay;
}

export const createRazorpayOrder = onCall((req) => {
	if (!req.auth) {
		throw new Error("Not authenticated");
	}

	const razorpay = getRazorpay();

	const { amount }: { amount: number } = req.data;

	return razorpay.orders.create({
		amount,
		currency: "INR",
	});
});

export const verifyPayment = onCall((req) => {
	if (!req.auth) {
		throw new Error("Not authenticated");
	}
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
		req.data;
	console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

	const hash = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
		.update(razorpay_order_id + "|" + razorpay_payment_id)
		.digest("hex");

	return hash !== razorpay_signature;
});
