import { defineDict } from './locale';

/**
 * Authentication copy (Authentication forms + AuthTemplate screens).
 * Error formula: what happened + what to do. SSO buttons keep the provider
 * name and add the MN verb.
 */
export const authDict = defineDict({
  en: {
    // Form labels / helpers
    email: 'Email',
    workEmail: 'Work email',
    password: 'Password',
    fullName: 'Full name',
    passwordHint: 'At least 8 characters.',
    forgotHelper: "We'll send a reset link if an account exists.",

    // Validation
    errEmailEmpty: 'Enter your email address.',
    errEmailInvalid: 'Enter a valid email address.',
    errPasswordEmpty: 'Enter your password.',
    errPasswordShort: 'Password must be at least 8 characters.',
    errNameEmpty: 'Enter your full name.',
    errSummary: 'Fix {n} fields to continue',

    // SSO
    ssoGoogle: 'Continue with Google',
    ssoGithub: 'Continue with GitHub',
    or: 'or',

    // Buttons / links
    signIn: 'Sign in',
    signUp: 'Sign up',
    createAccount: 'Create account',
    forgotPassword: 'Forgot password?',
    sendResetLink: 'Send reset link',
    resend: 'Resend',
    backToSignIn: 'Back to sign in',
    terms: 'By signing up you agree to our Terms of Service and Privacy Policy.',

    // Magic link sent
    sentBefore: 'We sent a sign-in link to ',
    sentAfter: '. Open it on this device to continue.',
    didntGet: "Didn't get it?",

    // Screens
    signInTitle: 'Sign in',
    signInSubtitle: 'Welcome back. Sign in to continue.',
    noAccount: "Don't have an account?",
    signUpTitle: 'Create your account',
    signUpSubtitle: 'Start free, no credit card.',
    haveAccount: 'Already have an account?',
    forgotTitle: 'Forgot password?',
    forgotSubtitle: "We'll email you a reset link.",
    magicTitle: 'Check your inbox',
    magicSubtitle: 'We sent a magic link to your email.',

    // Demo
    demoError: "That email and password don't match. Check both and try again.",
    demoSuccess: 'Signed in — this is a demo, nothing was sent.',
    demoHintBefore: 'Demo: submissions succeed after 800ms. Add ',
    demoHintAfter: ' to the URL to preview the error state.',
  },
  mn: {
    email: 'И-мэйл',
    workEmail: 'Ажлын и-мэйл',
    password: 'Нууц үг',
    fullName: 'Бүтэн нэр',
    passwordHint: '8-аас доошгүй тэмдэгт.',
    forgotHelper: 'Бүртгэл байвал сэргээх холбоос илгээнэ.',

    errEmailEmpty: 'И-мэйл хаяг оруулна уу.',
    errEmailInvalid: 'И-мэйл хаяг буруу байна. Шалгаад дахин оруулна уу.',
    errPasswordEmpty: 'Нууц үг оруулна уу.',
    errPasswordShort: 'Нууц үг 8-аас доошгүй тэмдэгттэй байна. Уртасгаад дахин оруулна уу.',
    errNameEmpty: 'Бүтэн нэрээ оруулна уу.',
    errSummary: 'Үргэлжлүүлэхийн тулд {n} талбар засна уу',

    ssoGoogle: 'Google-ээр үргэлжлүүлэх',
    ssoGithub: 'GitHub-ээр үргэлжлүүлэх',
    or: 'эсвэл',

    signIn: 'Нэвтрэх',
    signUp: 'Бүртгүүлэх',
    createAccount: 'Бүртгэл үүсгэх',
    forgotPassword: 'Нууц үгээ мартсан уу?',
    sendResetLink: 'Сэргээх холбоос илгээх',
    resend: 'Дахин илгээх',
    backToSignIn: 'Нэвтрэх рүү буцах',
    terms: 'Бүртгүүлснээр та Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг зөвшөөрч байна.',

    sentBefore: 'Нэвтрэх холбоосыг ',
    sentAfter: ' руу илгээлээ. Үргэлжлүүлэхийн тулд энэ төхөөрөмж дээрээ нээнэ үү.',
    didntGet: 'Ирсэнгүй юу?',

    signInTitle: 'Нэвтрэх',
    signInSubtitle: 'Тавтай морил. Үргэлжлүүлэхийн тулд нэвтэрнэ үү.',
    noAccount: 'Бүртгэлгүй юу?',
    signUpTitle: 'Бүртгэл үүсгэх',
    signUpSubtitle: 'Үнэгүй эхлэх, карт шаардахгүй.',
    haveAccount: 'Бүртгэлтэй юу?',
    forgotTitle: 'Нууц үгээ мартсан уу?',
    forgotSubtitle: 'Сэргээх холбоосыг и-мэйлээр илгээнэ.',
    magicTitle: 'Шуудангаа шалгана уу',
    magicSubtitle: 'Нэвтрэх холбоосыг и-мэйл рүү тань илгээлээ.',

    demoError: 'И-мэйл, нууц үг таарахгүй байна. Хоёуланг нь шалгаад дахин оролдоно уу.',
    demoSuccess: 'Нэвтэрлээ — энэ демо, юу ч илгээгдээгүй.',
    demoHintBefore: 'Демо: илгээлт 800ms-ийн дараа амжилттай болно. URL-д ',
    demoHintAfter: ' нэмбэл алдааны төлөв харагдана.',
  },
});
