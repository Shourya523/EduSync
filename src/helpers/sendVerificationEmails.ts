import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmails";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerification(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return { success: true, message:'Verification email sent successfully'}
    } catch (error) {
        console.log("Error sending messages",error);
        return{success: false,message:"Verification email not sent"};

    }
}