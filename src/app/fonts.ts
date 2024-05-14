import {
    EB_Garamond,
    Lato,
    Merriweather,
    Niramit,
    Noto_Sans,
    Open_Sans,
    PT_Sans,
    Roboto,
    Source_Sans_3,
} from "next/font/google";

const openSans = Open_Sans({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

// Load some fonts to be used
const lato = Lato({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const roboto = Roboto({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const notoSans = Noto_Sans({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const ptSans = PT_Sans({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const merriweather = Merriweather({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const niramit = Niramit({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

const fonts = {
    openSans: {
        display: "Open Sans",
        className: openSans.className,
    },
    lato: {
        display: "Lato",
        className: lato.className,
    },
    roboto: {
        display: "Roboto",
        className: roboto.className,
    },
    sourceSans3: {
        display: "Source Sans 3",
        className: sourceSans3.className,
    },
    notoSans: {
        display: "Noto Sans",
        className: notoSans.className,
    },
    ptSans: {
        display: "PT Sans",
        className: ptSans.className,
    },
    ebGaramond: {
        display: "EB Garamond",
        className: ebGaramond.className,
    },
    merriweather: {
        display: "Merriweather",
        className: merriweather.className,
    },
    niramit: {
        display: "Niramit",
        className: niramit.className,
    },
};

export default fonts;