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
        export: "Open+Sans:ital,wght@0,300..800;1,300..800",
        className: openSans.className,
    },
    lato: {
        display: "Lato",
        export: "Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900",
        className: lato.className,
    },
    roboto: {
        display: "Roboto",
        export: "Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900",
        className: roboto.className,
    },
    sourceSans3: {
        display: "Source Sans 3",
        export: "Source+Sans+3:ital,wght@0,200..900;1,200..900",
        className: sourceSans3.className,
    },
    notoSans: {
        display: "Noto Sans",
        export: "Noto+Sans:ital,wght@0,100..900;1,100..900",
        className: notoSans.className,
    },
    ptSans: {
        display: "PT Sans",
        export: "PT+Sans:ital,wght@0,400;0,700;1,400;1,700",
        className: ptSans.className,
    },
    ebGaramond: {
        display: "EB Garamond",
        export: "EB+Garamond:ital,wght@0,400..800;1,400..800",
        className: ebGaramond.className,
    },
    merriweather: {
        display: "Merriweather",
        export: "Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900",
        className: merriweather.className,
    },
    niramit: {
        display: "Niramit",
        export: "Niramit:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700",
        className: niramit.className,
    },
};

export default fonts;
