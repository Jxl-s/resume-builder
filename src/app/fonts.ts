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
        export: "Open+Sans",
        style: openSans.style,
    },
    lato: {
        display: "Lato",
        export: "Lato",
        style: lato.style,
    },
    roboto: {
        display: "Roboto",
        export: "Roboto",
        style: roboto.style,
    },
    sourceSans3: {
        display: "Source Sans 3",
        export: "Source+Sans+3",
        style: sourceSans3.style,
    },
    notoSans: {
        display: "Noto Sans",
        export: "Noto+Sans",
        style: notoSans.style,
    },
    ptSans: {
        display: "PT Sans",
        export: "PT+Sans",
        style: ptSans.style,
    },
    ebGaramond: {
        display: "EB Garamond",
        export: "EB+Garamond",
        style: ebGaramond.style,
    },
    merriweather: {
        display: "Merriweather",
        export: "Merriweather",
        style: merriweather.style,
    },
    niramit: {
        display: "Niramit",
        export: "Niramit",
        style: niramit.style,
    },
} as const;

export default fonts;
