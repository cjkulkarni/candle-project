

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
};


const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};



const itemLeft = {
    hidden: { opacity: 0, x: -100 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const itemRight = {
    hidden: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const textContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const textBounce = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 10,
            duration: 0.6,
        },
    },
};

const textSlideLeft = {
    hidden: { opacity: 0, x: -50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const textSlideRight = {
    hidden: { opacity: 0, x: 50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const imageReveal = {
    hidden: { opacity: 0, scale: 1.1 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const textReveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const slideIn = {
    hidden: { opacity: 0, x: -60 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export {
    container,
    textContainer,
    itemLeft,
    itemRight,
    cardVariant,
    containerVariant,
    textBounce,
    textSlideLeft,
    textSlideRight,
    fadeUp,
    imageReveal,
    textReveal,
    slideIn
};